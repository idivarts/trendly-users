import { FlatList, TouchableOpacity } from "react-native";
import { Text, View } from "@/components/theme/Themed";
import JobCard from "@/components/collaboration/CollaborationCard";
import { useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { Link } from "expo-router";
import { useTheme } from "@react-navigation/native";
import { createStyles } from "@/styles/Proposal.styles";
import { DummyProposalData } from "@/constants/Proposal";
import { PromotionType } from "@/shared-libs/firestore/trendly-pro/constants/promotion-type";
import { CollaborationType } from "@/shared-libs/firestore/trendly-pro/constants/collaboration-type";
import { SocialPlatform } from "@/shared-libs/firestore/trendly-pro/constants/social-platform";

const ProposalScreen = () => {
  const [selectedTab, setSelectedTab] = useState<"proposals" | "forYou">(
    "proposals"
  );
  const { colors } = useTheme();
  const styles = createStyles(colors);

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
              Proposals
            </Text>
          </TouchableOpacity>
          {/* <Text style={styles.title}>For You</Text> */}

          <TouchableOpacity onPress={() => setSelectedTab("forYou")}>
            <Text
              style={
                selectedTab === "forYou" ? styles.titleActive : styles.title
              }
            >
              For You
            </Text>
          </TouchableOpacity>
        </View>
        {selectedTab === "proposals" && (
          <FlatList
            data={DummyProposalData}
            renderItem={({ item }) => (
              <JobCard
                name="Proposal"
                brandName={item.brandName}
                brandId="brandId"
                budget={{
                  min: Number(item.cost),
                  max: Number(item.cost),
                }}
                cardType="proposal"
                collaborationType={CollaborationType.PAID}
                id="1"
                location={{
                  latlong: {
                    latitude: 0,
                    longitude: 0,
                  },
                  name: "Location",
                  type: "physical",
                }}
                managerId="managerId"
                numberOfInfluencersNeeded={1}
                platform={SocialPlatform.INSTAGRAM}
                promotionType={PromotionType.ADD_REVIEWS}
                timeStamp={new Date().getTime()}
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
                    backgroundColor: colors.card,

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
                name="Proposal"
                brandName={item.brandName}
                brandId="brandId"
                budget={{
                  min: Number(item.cost),
                  max: Number(item.cost),
                }}
                cardType="proposal"
                collaborationType={CollaborationType.PAID}
                id="1"
                location={{
                  latlong: {
                    latitude: 0,
                    longitude: 0,
                  },
                  name: "Location",
                  type: "physical",
                }}
                managerId="managerId"
                numberOfInfluencersNeeded={1}
                platform={SocialPlatform.INSTAGRAM}
                promotionType={PromotionType.ADD_REVIEWS}
                timeStamp={new Date().getTime()}
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
                      color: colors.text,
                    },
                  ]}
                >
                  Looking for past proposals
                </Text>
                <View
                  style={{
                    backgroundColor: colors.card,
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
    </AppLayout>
  );
};

export default ProposalScreen;
