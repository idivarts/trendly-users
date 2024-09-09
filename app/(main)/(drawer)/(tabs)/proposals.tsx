import { FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "@/components/theme/Themed";
import JobCard from "@/components/CollaborationCard";
import SearchComponent from "@/components/SearchComponent";
import { useState } from "react";
import AppLayout from "@/App-Layout";
import { Link } from "expo-router";
import { useTheme } from "@react-navigation/native";
import { createStyles } from "@/styles/Proposal.styles";
import { DummyProposalData } from "@/constants/Proposal";

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
                collaborationName={item.collaborationName}
                brandName={item.brandName}
                postedDate={item.postedDateAndTime}
                cost={item.cost}
                promotionType={item.promotionType}
                collaborationType={item.collaborationType}
                coverLetter={item.coverLetter}
                cardType="proposal"
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
                collaborationName={item.collaborationName}
                brandName={item.brandName}
                postedDate={item.postedDateAndTime}
                cost={item.cost}
                promotionType={item.promotionType}
                collaborationType={item.collaborationType}
                coverLetter={item.coverLetter}
                cardType="invitation"
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
