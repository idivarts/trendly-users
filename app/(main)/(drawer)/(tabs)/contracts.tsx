import { FlatList } from "react-native";
import { Text, View } from "@/components/theme/Themed";
import AppLayout from "@/layouts/app-layout";
import { Link } from "expo-router";
import ContractCard from "@/components/ContractCard";
import { stylesFn } from "@/styles/Contracts.styles";
import { useTheme } from "@react-navigation/native";
import { DummyProposalData } from "@/constants/Contracts";
import Colors from "@/constants/Colors";
import { useState } from "react";
import BottomSheetActions from "@/components/BottomSheetActions";

const ContractScreen = () => {
  const theme = useTheme();
  const styles = stylesFn(theme);

  const [isVisible, setIsVisible] = useState(false);
  const [selectedCollabId, setSelectedCollabId] = useState<string | null>(null);

  const openBottomSheet = (id: string) => {
    setIsVisible(true);
    setSelectedCollabId(id);
  };
  const closeBottomSheet = () => setIsVisible(false);

  return (
    <AppLayout>
      <View style={styles.container}>
        <FlatList
          data={DummyProposalData}
          renderItem={({ item, index }) => (
            <ContractCard
              {...item}
              onOpenBottomSheet={openBottomSheet}
              brandName="Brand Name"
              cost="Cost"
              status={{
                sent: true,
                active: true,
                approvalPending: true,
                changesRequested: true,
                done: true,
                prematureEnd: true,
                archived: true,
              }}
              collaborationName="Collaboration Name"
              id={index.toString()}
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

export default ContractScreen;
