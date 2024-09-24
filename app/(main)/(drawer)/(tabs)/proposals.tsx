import BottomSheetActions from "@/components/BottomSheetActions";
import JobCard from "@/components/collaboration/CollaborationCard";
import { Text, View } from "@/components/theme/Themed";
import Colors from "@/constants/Colors";
import { DummyProposalData } from "@/constants/Proposal";
import AppLayout from "@/layouts/app-layout";
import { CollaborationType } from "@/shared-libs/firestore/trendly-pro/constants/collaboration-type";
import { PromotionType } from "@/shared-libs/firestore/trendly-pro/constants/promotion-type";
import { SocialPlatform } from "@/shared-libs/firestore/trendly-pro/constants/social-platform";
import { stylesFn } from "@/styles/Proposal.styles";
import { useTheme } from "@react-navigation/native";
import { Link } from "expo-router";
import { useState } from "react";
import { FlatList, TouchableOpacity } from "react-native";

const ProposalScreen = () => {
  const [selectedTab, setSelectedTab] = useState<"proposals" | "forYou">(
    "proposals"
  );
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCollabId, setSelectedCollabId] = useState<string | null>(null);
  const openBottomSheet = (id: string) => {
    setIsVisible(true);
    setSelectedCollabId(id);
  };
  const closeBottomSheet = () => setIsVisible(false);
  const theme = useTheme();
  const styles = stylesFn(theme);

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
          {/* <Text style={styles.title}>For You</Text> */}

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
        {selectedTab === "proposals" && (
          <FlatList
            data={DummyProposalData}
            renderItem={({ item }) => (
              <JobCard
                name={item.name}
                brandName={item.brandName}
                brandId={item.brandId}
                budget={{
                  min: Number(item.budget.min),
                  max: Number(item.budget.max),
                }}
                onOpenBottomSheet={openBottomSheet}
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
          cardId={selectedCollabId || ""} // Pass the selected collab id
          cardType="proposal"
          isVisible={isVisible}
          onClose={closeBottomSheet}
          key={selectedCollabId} // Ensure the BottomSheetActions re-renders with new id
        />
      )}
    </AppLayout>
  );
};

export default ProposalScreen;
