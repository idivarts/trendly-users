import BottomSheetActions from "@/components/BottomSheetActions";
import JobCard from "@/components/collaboration/CollaborationCard";
import { Text, View } from "@/components/theme/Themed";
import Colors from "@/constants/Colors";
import AppLayout from "@/layouts/app-layout";
import { useTheme } from "@react-navigation/native";
import { Link } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { FlatList, TouchableOpacity } from "react-native";
import { FirestoreDB } from "@/utils/firestore";
import { AuthApp } from "@/utils/auth";
import { DummyProposalData } from "@/constants/Proposal";
import { CollaborationType } from "@/shared-libs/firestore/trendly-pro/constants/collaboration-type";
import { PromotionType } from "@/shared-libs/firestore/trendly-pro/constants/promotion-type";
import { SocialPlatform } from "@/shared-libs/firestore/trendly-pro/constants/social-platform";
import { stylesFn } from "@/styles/Proposal.styles";

const ProposalScreen = () => {
  const [selectedTab, setSelectedTab] = useState<"proposals" | "forYou">(
    "proposals"
  );
  const [isVisible, setIsVisible] = useState(false);
  const [proposals, setProposals] = useState<any[]>([]);
  const [selectedCollabId, setSelectedCollabId] = useState<string | null>(null);

  const openBottomSheet = (id: string) => {
    setIsVisible(true);
    setSelectedCollabId(id);
  };
  const closeBottomSheet = () => setIsVisible(false);

  const theme = useTheme();
  const styles = stylesFn(theme);
  const user = AuthApp.currentUser;

  const fetchProposals = async () => {
    try {
      const collaborationCol = collection(FirestoreDB, "collaborations");
      const collabSnapshot = await getDocs(collaborationCol);

      // Map over the collaborations to fetch applications for each collaboration
      const proposalsWithApplications = await Promise.all(
        collabSnapshot.docs.map(async (doc) => {
          const collab = { id: doc.id, ...doc.data() };

          // Fetch applications for the current collaboration
          const applicationCol = collection(
            FirestoreDB,
            "collaborations",
            collab.id,
            "applications"
          );
          const applicationSnapshot = await getDocs(applicationCol);
          const applicationData = applicationSnapshot.docs.map(
            (applicationDoc) => ({
              id: applicationDoc.id,
              userId: applicationDoc.data().userId,
              ...applicationDoc.data(),
            })
          );

          console.log("applicationData", applicationData);

          const userApplications = applicationData.filter(
            (application) => application.userId === user?.uid
          );

          console.log("userApplications", userApplications, user?.uid);
          return userApplications.length > 0 ? collab : null;
        })
      );

      console.log("proposalsWithApplications", proposalsWithApplications);

      const validProposals = proposalsWithApplications.filter(
        (proposal) => proposal !== null
      );

      setProposals(validProposals);
    } catch (error) {
      console.error("Error fetching proposals: ", error);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, [user]);

  const filteredProposals = useMemo(() => proposals, [proposals]);

  return (
    <AppLayout>
      <View style={styles.container}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            width: "100%",
            marginBottom: 20,
          }}
        >
          <TouchableOpacity onPress={() => setSelectedTab("proposals")}>
            <Text
              style={
                selectedTab === "proposals" ? styles.titleActive : styles.title
              }
            >
              Applications
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setSelectedTab("forYou")}>
            <Text
              style={
                selectedTab === "forYou" ? styles.titleActive : styles.title
              }
            >
              Invitations
            </Text>
          </TouchableOpacity>
        </View>

        {selectedTab === "proposals" &&
          (proposals.length === 0 ? (
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
                No Application found
              </Text>
            </View>
          ) : (
            <FlatList
              data={proposals}
              renderItem={({ item }) => (
                <JobCard
                  name={item.name}
                  id={item.id}
                  brandName={item.brandName}
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
                  invitaions={undefined}
                />
              )}
              keyExtractor={(item, index) => index.toString()}
              style={{ height: "100%" }}
              ListFooterComponent={
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
                      },
                    ]}
                  >
                    Looking for past proposals
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
                    <Link href={"/collaboration-details"} style={{}}>
                      <Text>View Past Proposals</Text>
                    </Link>
                  </View>
                </View>
              }
            />
          ))}

        {selectedTab === "forYou" && (
          <FlatList
            data={DummyProposalData}
            renderItem={({ item }) => (
              <JobCard
                name={item.name}
                brandName={item.brandName}
                onOpenBottomSheet={openBottomSheet}
                brandId={item.brandId}
                budget={{
                  min: Number(item.budget.min),
                  max: Number(item.budget.max),
                }}
                cardType="proposal"
                collaborationType={CollaborationType.PAID}
                id="1"
                location={item.location}
                managerId="managerId"
                numberOfInfluencersNeeded={1}
                platform={SocialPlatform.INSTAGRAM}
                promotionType={PromotionType.ADD_REVIEWS}
                timeStamp={item.timeStamp}
                applications={undefined}
                invitaions={undefined}
              />
            )}
            keyExtractor={(item, index) => index.toString()}
            style={{ height: "100%" }}
            ListFooterComponent={
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
                  Looking for past proposals
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
                  <Link href={"/collaboration-details"} style={{}}>
                    <Text>View Past Proposals</Text>
                  </Link>
                </View>
              </View>
            }
          />
        )}
      </View>

      {isVisible && (
        <BottomSheetActions
          cardId={selectedCollabId || ""}
          cardType="proposal"
          isVisible={isVisible}
          onClose={closeBottomSheet}
          key={selectedCollabId}
        />
      )}
    </AppLayout>
  );
};

export default ProposalScreen;
