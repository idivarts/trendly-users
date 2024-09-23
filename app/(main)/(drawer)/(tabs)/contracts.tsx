import { FlatList } from "react-native";
import { Text, View } from "@/components/theme/Themed";
import AppLayout from "@/layouts/app-layout";
import { Link } from "expo-router";
import ContractCard from "@/components/ContractCard";
import { stylesFn } from "@/styles/Contracts.styles";
import { useTheme } from "@react-navigation/native";
import { DummyProposalData } from "@/constants/Contracts";
import Colors from "@/constants/Colors";

const ContractScreen = () => {
  const theme = useTheme();
  const styles = stylesFn(theme);

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
                    color: Colors(theme).text,
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
