import React, { useEffect } from "react";
import { View, FlatList } from "react-native";
import { Appbar } from "react-native-paper";
import AppLayout from "@/layouts/app-layout";
import { useTheme } from "@react-navigation/native";
import { stylesFn } from "@/styles/CollaborationDetails.styles";
import BackButton from "@/components/ui/back-button/BackButton";
import JobCard from "@/components/collaboration/CollaborationCard";
import Colors from "@/constants/Colors";
import { CollaborationType } from "@/shared-libs/firestore/trendly-pro/constants/collaboration-type";
import { SocialPlatform } from "@/shared-libs/firestore/trendly-pro/constants/social-platform";
import { PromotionType } from "@/shared-libs/firestore/trendly-pro/constants/promotion-type";
import {
  collection,
  query,
  where,
  doc as firebaseDoc,
  getDoc,
} from "firebase/firestore";
import { FirestoreDB } from "@/utils/firestore";
import { getDocs } from "firebase/firestore";
import { AuthApp } from "@/utils/auth";
import BottomSheetActions from "@/components/BottomSheetActions";

const PastApplicationPage = (props: any) => {
  const theme = useTheme();
  const styles = stylesFn(theme);
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
            "invitations"
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
      <Appbar.Header
        statusBarHeight={0}
        style={{
          backgroundColor: Colors(theme).background,
        }}
      >
        <BackButton />
        <Appbar.Content title="Past Invitations" color={Colors(theme).text} />
      </Appbar.Header>
      <View
        style={{
          flex: 1,
          backgroundColor: Colors(theme).background,
          padding: 10,
        }}
      >
        <FlatList
          data={proposals}
          renderItem={({ item }) => (
            <JobCard
              name={item.name}
              id={item.id}
              brandName={item.brandName}
              description={item.description}
              brandId={item.brandId}
              budget={{
                min: Number(item.budget.min),
                max: Number(item.budget.max),
              }}
              onOpenBottomSheet={openBottomSheet}
              cardType="proposal"
              collaborationType={CollaborationType.PAID}
              location={item.location}
              managerId="managerId"
              numberOfInfluencersNeeded={1}
              platform={SocialPlatform.INSTAGRAM}
              promotionType={PromotionType.ADD_REVIEWS}
              timeStamp={item.timeStamp}
              applications={undefined}
              invitations={undefined}
            />
          )}
          style={{ height: "100%", width: "100%" }}
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