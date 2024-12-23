import BottomSheetActions from "@/components/BottomSheetActions";
import JobCard from "@/components/collaboration/CollaborationCard";
import { Text, View } from "@/components/theme/Themed";
import Colors from "@/constants/Colors";
import AppLayout from "@/layouts/app-layout";
import { useTheme } from "@react-navigation/native";
import { Link } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  doc as firebaseDoc,
  getDoc,
} from "firebase/firestore";
import { ActivityIndicator, FlatList, RefreshControl } from "react-native";
import { FirestoreDB } from "@/utils/firestore";
import { AuthApp } from "@/utils/auth";
import { stylesFn } from "@/styles/Proposal.styles";
import EmptyState from "../ui/empty-state";

const Invitations = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCollabId, setSelectedCollabId] = useState<string | null>(null);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [notPendingInvitations, setNotPendingInvitations] = useState<number>();
  const [refreshing, setRefreshing] = useState(false);

  const openBottomSheet = (id: string) => {
    setIsVisible(true);
    setSelectedCollabId(id);
  };
  const closeBottomSheet = () => setIsVisible(false);

  const theme = useTheme();
  const styles = stylesFn(theme);
  const user = AuthApp.currentUser;

  const [isLoading, setIsLoading] = useState(true);
  const fetchInvitations = async () => {
    try {
      const collaborationCol = collection(FirestoreDB, "collaborations");
      const collabSnapshot = await getDocs(collaborationCol);
      let totalNotPendingInvitations = 0;

      // Map over the collaborations to fetch applications for each collaboration
      const invitationsWithApplications = await Promise.all(
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
            where("userId", "==", user?.uid)
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

          const userApplications = applicationData.filter(
            (application) => application.userId === user?.uid
          );

          const notPendingApplications = userApplications.filter(
            (application) => application.status !== "pending"
          ).length;

          totalNotPendingInvitations += notPendingApplications;

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

      const validProposals = invitationsWithApplications.filter(
        (proposal) => proposal !== null
      );

      setInvitations(validProposals);
      setNotPendingInvitations(totalNotPendingInvitations);
    } catch (error) {
      console.error("Error fetching proposals: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, [user]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchInvitations();
    setRefreshing(false);
  };

  const pendingInvitations = useMemo(
    () =>
      invitations.filter((invitation) => {
        return invitation.applications.status === "pending";
      }),
    [invitations]
  );

  if (isLoading) {
    return (
      <AppLayout>
        <View style={styles.container}>
          <ActivityIndicator size="large" color={Colors(theme).primary} />
        </View>
      </AppLayout>
    );
  }

  return (
    <View
      style={{
        width: "100%",
        flex: 1,
      }}
    >
      {pendingInvitations.length === 0 && notPendingInvitations === 0 ? (
        <EmptyState
          hideAction
          image={require("@/assets/images/illustration5.png")}
          subtitle="Start building your profile today to have better reach. If any brand invites you to collaborate we woudl show it here"
          title="No Invitations yet"
        />
      ) : pendingInvitations.length !== 0 ? (
        <FlatList
          data={pendingInvitations}
          renderItem={({ item }) => (
            <JobCard
              id={item.id}
              status="pending"
              name={item.name}
              brandName={item.brandName}
              onOpenBottomSheet={openBottomSheet}
              description={item.description}
              brandId={item.brandId}
              budget={{
                min: Number(item.budget.min),
                max: Number(item.budget.max),
              }}
              cardType="invitation"
              collaborationType={item.collaborationType}
              location={item.location}
              managerId="managerId"
              numberOfInfluencersNeeded={1}
              platform={item.platform}
              promotionType={item.promotionType}
              timeStamp={item.timeStamp}
              applications={undefined}
              invitations={undefined}
              data={item.applications}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
          ListFooterComponent={
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                padding: 20,
              }}
            >
              {notPendingInvitations !== 0 && (
                <View>
                  <Text
                    style={[
                      styles.title,
                      {
                        marginBottom: 10,
                        color: Colors(theme).text,
                      },
                    ]}
                  >
                    Looking for past invitations
                  </Text>
                  <View
                    style={{
                      backgroundColor: Colors(theme).card,
                      padding: 10,
                      borderRadius: 5,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Link href={"/past/invitation"} style={{}}>
                      <Text>View Past Invitations</Text>
                    </Link>
                  </View>
                </View>
              )}
            </View>
          }
          contentContainerStyle={{
            padding: 16,
            gap: 16,
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[Colors(theme).primary]} // Customize color based on theme
            />
          }
        />
      ) : (
        <View>
          {pendingInvitations.length === 0 && notPendingInvitations !== 0 && (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                padding: 20,
              }}
            >
              <Text
                style={[
                  styles.title,
                  {
                    marginBottom: 10,
                    color: Colors(theme).text,
                  },
                ]}
              >
                Looking for past invitations
              </Text>
              <View
                style={{
                  backgroundColor: Colors(theme).card,
                  padding: 10,
                  borderRadius: 5,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Link href={"/past/invitation"} style={{}}>
                  <Text>View Past Invitations</Text>
                </Link>
              </View>
            </View>
          )}
        </View>
      )}
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
    </View>
  );
};

export default Invitations;
