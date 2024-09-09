import { FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "@/components/theme/Themed";
import JobCard from "@/components/CollaborationCard";
import SearchComponent from "@/components/SearchComponent";
import { useState } from "react";
import AppLayout from "@/App-Layout";
import { Link } from "expo-router";
import ContractCard from "@/components/ContractCard";
import { createStyles } from "@/styles/Contracts.styles";
import { useTheme } from "@react-navigation/native";
import { DummyProposalData } from "@/constants/Contracts";

const ContractScreen = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <AppLayout>
      <View style={styles.container}>
        <FlatList
          data={DummyProposalData}
          renderItem={({ item }) => <ContractCard {...item} />}
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
              <Text
                style={[
                  styles.title,
                  {
                    marginBottom: 10,
                    color: colors.text,
                  },
                ]}
              >
                Looking for past contracts
              </Text>
              <View style={styles.card}>
                <Link href={"/collaboration-details"} style={{}}>
                  <Text>View Past Contracts</Text>
                </Link>
              </View>
            </View>
          }
        />
      </View>
    </AppLayout>
  );
};

export default ContractScreen;
