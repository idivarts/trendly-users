import React, { useEffect } from "react";
import { View, FlatList } from "react-native";
import AppLayout from "@/layouts/app-layout";
import JobCard from "@/components/collaboration/CollaborationCard";
import {
  collection,
  getDoc,
  query,
  where,
  getDocs,
  doc as firebaseDoc,
} from "firebase/firestore";
import { FirestoreDB } from "@/utils/firestore";
import { AuthApp } from "@/utils/auth";
import BottomSheetActions from "@/components/BottomSheetActions";
import ScreenHeader from "@/components/ui/screen-header";

const PastApplicationPage = (props: any) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [proposals, setProposals] = React.useState<any>();
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedCollabId, setSelectedCollabId] = React.useState<string | null>(
    null
  );
  const openBottomSheet = (id: string) => {
    setIsVisible(true);
    setSelectedCollabId(id);
  };
  const closeBottomSheet = () => setIsVisible(false);

  const user = AuthApp.currentUser;

  const fetchProposals = async () => {
    try {
      const collaborationCol = collection(FirestoreDB, "collaborations");
      const collabSnapshot = await getDocs(collaborationCol);

      // Map over the collaborations to fetch applications for each collaboration
      const proposalsWithApplications = await Promise.all(
        collabSnapshot.docs.map(async (doc) => {
          const collab = {
            id: doc.id,
            brandId: doc.data().brandId,
            ...doc.data(),
          };
          const brandDoc = firebaseDoc(
            collection(FirestoreDB, "brands"),
            collab.brandId
          );
          const brandData = await getDoc(brandDoc);
          if (!brandData.exists()) {
            return null;
          }

          // Fetch applications for the current collaboration
          const applicationCol = collection(
            FirestoreDB,
            "collaborations",
            collab.id,
            "applications"
          );

          const applicationSnapshot = query(
            applicationCol,
            where("userId", "==", user?.uid),
            where("status", "in", ["accepted", "rejected"])
          );

          const applicationData = await getDocs(applicationSnapshot).then(
            (querySnapshot) => {
              return querySnapshot.docs.map((doc) => ({
                id: doc.id,
                userId: doc.data().userId,
                status: doc.data().status,
                ...doc.data(),
              }));
            }
          );

          if (applicationData.length === 0) {
            return null;
          }

          return {
            ...collab,
            applications: applicationData[0],
            brandName: brandData.data().name,
          };
        })
      );

      const validProposals = proposalsWithApplications.filter(
        (proposal: any) => {
          if (proposal === null) {
            return false;
          }
          return (
            proposal !== null ||
            proposal.applications.status === "accepted" ||
            proposal.applications.status === "rejected"
          );
        }
      );

      setProposals(validProposals);
    } catch (error) {
      console.error("Error fetching proposals: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  return (
    <AppLayout>
      <ScreenHeader
        title="Past Applications"
      />
      <View
        style={{
          flex: 1,
        }}
      >
        <FlatList
          data={proposals}
          renderItem={({ item }) => (
            <JobCard
              name={item.name}
              id={item.id}
              data={item.applications}
              brandName={item.brandName}
              brandId={item.brandId}
              budget={{
                min: Number(item.budget.min),
                max: Number(item.budget.max),
              }}
              description={item.description}
              status={item.status}
              onOpenBottomSheet={openBottomSheet}
              cardType="proposal"
              collaborationType={item.collaborationType}
              location={item.location}
              managerId={item.managerId}
              numberOfInfluencersNeeded={1}
              platform={item.platform}
              promotionType={item.promotionType}
              timeStamp={item.timeStamp}
              applications={undefined}
              invitations={undefined}
            />
          )}
          contentContainerStyle={{
            padding: 16,
            gap: 16,
          }}
          keyExtractor={(item) => item.id}
        />
      </View>
      {isVisible && (
        <BottomSheetActions
          cardId={selectedCollabId || ""}
          cardType="proposal"
          isVisible={isVisible}
          onClose={closeBottomSheet}
          snapPointsRange={["20%", "50%"]}
          key={selectedCollabId}
        />
      )}
    </AppLayout>
  );
};

export default PastApplicationPage;
