import BottomSheetActions from "@/components/BottomSheetActions";
import JobCard from "@/components/collaboration/CollaborationCard";
import { Text, View } from "@/components/theme/Themed";
import Colors from "@/constants/Colors";
import AppLayout from "@/layouts/app-layout";
import { useTheme } from "@react-navigation/native";
import { Link, router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  doc as firebaseDoc,
  getDoc,
} from "firebase/firestore";
import { ActivityIndicator, FlatList, Image } from "react-native";
import { FirestoreDB } from "@/utils/firestore";
import { AuthApp } from "@/utils/auth";
import { RefreshControl } from "react-native";
import { stylesFn } from "@/styles/Proposal.styles";
import { Button } from "react-native-paper";
import EmptyState from "../ui/empty-state";

const Applications = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [proposals, setProposals] = useState<any[]>([]);
  const [selectedCollabId, setSelectedCollabId] = useState<string | null>(null);
  const [notPendingProposals, setNotPendingProposals] = useState<number>();

  const openBottomSheet = (id: string) => {
    setIsVisible(true);
    setSelectedCollabId(id);
  };
  const closeBottomSheet = () => setIsVisible(false);

  const theme = useTheme();
  const styles = stylesFn(theme);
  const user = AuthApp.currentUser;

  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchProposals();
    setRefreshing(false);
  };

  const fetchProposals = async () => {
    try {
      const collaborationCol = collection(FirestoreDB, "collaborations");
      const collabSnapshot = await getDocs(collaborationCol);
      let totalNotPendingApplications = 0;

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

          const applicationCol = collection(
            FirestoreDB,
            "collaborations",
            collab.id,
            "applications"
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

          if (applicationData.length === 0) {
            return null;
          }

          const userApplications = applicationData.filter(
            (application) => application.userId === user?.uid
          );

          const notPendingApplications = userApplications.filter(
            (application) => application.status !== "pending"
          ).length;

          totalNotPendingApplications += notPendingApplications;

          return {
            ...collab,
            applications: applicationData,
            brandName: brandData.data().name,
          };
        })
      );

      const validProposals = proposalsWithApplications.filter((proposal) => {
        return proposal !== null;
      });

      setProposals(validProposals);
      setNotPendingProposals(totalNotPendingApplications);
    } catch (error) {
      console.error("Error fetching proposals: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, [user]);

  const pendingProposals = useMemo(
    () =>
      proposals.filter((proposal) => {
        return proposal.applications[0].status === "pending";
      }),
    [proposals]
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
      {proposals.length === 0 && notPendingProposals === 0 ? (
        <EmptyState
          image={require("@/assets/images/illustration6.png")}
          subtitle="Start Applying today and get exclusive collabs"
          title="No Applications yet"
          action={() => router.push("/collaborations")}
          actionLabel="Explore Collaborations"
        />
      ) : pendingProposals.length !== 0 ? (
        <FlatList
          data={pendingProposals}
          renderItem={({ item }) => (
            <JobCard
              name={item.name}
              id={item.id}
              data={item.applications}
              status="pending"
              brandName={item.brandName}
              description={item.description}
              brandId={item.brandId}
              budget={{
                min: Number(item.budget.min),
                max: Number(item.budget.max),
              }}
              onOpenBottomSheet={openBottomSheet}
              cardType="proposal"
              collaborationType={item.collaborationType}
              location={item.location}
              managerId="managerId"
              numberOfInfluencersNeeded={1}
              platform={item.platform}
              promotionType={item.promotionType}
              timeStamp={item.timeStamp}
              applications={undefined}
              invitations={undefined}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
          style={{ height: "100%", width: "100%" }}
          ListFooterComponent={
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                padding: 20,
              }}
            >
              {notPendingProposals !== 0 && (
                <View>
                  <Text
                    style={[
                      styles.title,
                      {
                        marginBottom: 10,
                      },
                    ]}
                  >
                    Looking for past applications
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
                    <Link
                      href={{
                        pathname: "/past/application",
                      }}
                      style={{}}
                    >
                      <Text>View Past Applications</Text>
                    </Link>
                  </View>
                </View>
              )}
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[Colors(theme).primary]} // Customize color based on theme
            />
          }
        />
      ) : (
        <>
          {pendingProposals.length === 0 && notPendingProposals !== 0 && (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                gap: 50,
              }}
            >
              <EmptyState
                image={require("@/assets/images/illustration6.png")}
                subtitle="No Applications Found"
                hideAction
              />

              <Button
                mode="contained"
                onPress={() => router.push("/collaborations")}
              >
                New Collaborations
              </Button>
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
                  Looking for past applications
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
                  <Link href={"/past/application"} style={{}}>
                    <Text>View Past Applications</Text>
                  </Link>
                </View>
              </View>
            </View>
          )}
        </>
      )
      }
      {
        isVisible && (
          <BottomSheetActions
            cardId={selectedCollabId || ""}
            cardType="proposal"
            isVisible={isVisible}
            onClose={closeBottomSheet}
            snapPointsRange={["20%", "50%"]}
            key={selectedCollabId}
          />
        )
      }
    </View >
  );
};

export default Applications;
