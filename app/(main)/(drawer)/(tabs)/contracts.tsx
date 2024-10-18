import { ActivityIndicator, FlatList, Image } from "react-native";
import { Text, View } from "@/components/theme/Themed";
import AppLayout from "@/layouts/app-layout";
import { Link, router } from "expo-router";
import ContractCard from "@/components/ContractCard";
import { stylesFn } from "@/styles/Contracts.styles";
import { useTheme } from "@react-navigation/native";
import Colors from "@/constants/Colors";
import { useEffect, useState } from "react";
import BottomSheetActions from "@/components/BottomSheetActions";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { FirestoreDB } from "@/utils/firestore";
import { AuthApp } from "@/utils/auth";
import { Button } from "react-native-paper";

const ContractScreen = () => {
  const theme = useTheme();
  const styles = stylesFn(theme);

  const user = AuthApp.currentUser;

  const [isVisible, setIsVisible] = useState(false);
  const [selectedCollabId, setSelectedCollabId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  const [contracts, setContracts] = useState<any[]>([]);

  const fetchContracts = async () => {
    try {
      const contractCol = collection(FirestoreDB, "contracts");
      const contractSnapshot = await getDocs(contractCol);

      const contractData = contractSnapshot.docs.map((doc) => ({
        id: doc.id,
        userId: doc.data().userId,
        collaborationId: doc.data().collaborationId,
        ...doc.data(),
      }));

      const userApplications = contractData.filter(
        (contract) => contract.userId === user?.uid
      );

      const enhancedContracts = await Promise.all(
        userApplications.map(async (contract) => {
          const collabFetch = doc(
            collection(FirestoreDB, "collaborations"),
            contract.collaborationId
          );
          const collabData = await getDoc(collabFetch);
          if (!collabData.exists()) {
            return null;
          }
          const brandData = await getDoc(
            doc(collection(FirestoreDB, "brands"), collabData.data().brandId)
          );
          if (!brandData.exists()) {
            return null;
          }

          return {
            ...contract,
            collaborationName: collabData.data().name,
            collaborationId: collabData.id,
            brandName: brandData.data().name,
            cost: "Cost",
            status: {
              sent: true,
              active: true,
              approvalPending: true,
              changesRequested: true,
              done: true,
              prematureEnd: true,
              archived: true,
            },
          };
        })
      );

      setContracts(enhancedContracts);
    } catch (error) {
      console.error("Error fetching contracts: ", error);
    } finally {
      setLoading(false);
    }
  };

  const openBottomSheet = (id: string) => {
    setIsVisible(true);
    setSelectedCollabId(id);
  };

  const closeBottomSheet = () => setIsVisible(false);

  useEffect(() => {
    fetchContracts();
  }, []);

  if (loading) {
    return (
      <AppLayout>
        <View style={styles.container}>
          <ActivityIndicator size="large" color={Colors(theme).primary} />
        </View>
      </AppLayout>
    );
  }

  const renderFooter = () => (
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
        <Link href={"/past/contracts"}>
          <Text>View Past Contracts</Text>
        </Link>
      </View>
    </View>
  );

  return (
    <AppLayout>
      <View style={styles.container}>
        {contracts.length === 0 ? (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              gap: 50,
            }}
          >
            <Image
              source={{ uri: "https://via.placeholder.com/150" }}
              width={150}
              height={150}
              style={{
                borderRadius: 10,
              }}
            />
            <View
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Text style={styles.title}>No Contracts found</Text>
            </View>
            <Button
              onPress={() => router.push("/collaborations")}
              style={{
                backgroundColor: Colors(theme).platinum,
                padding: 5,
                borderRadius: 5,
              }}
              textColor={Colors(theme).text}
            >
              New Collaborations
            </Button>
          </View>
        ) : (
          <FlatList
            data={contracts}
            renderItem={({ item, index }) => (
              <ContractCard
                {...item}
                onOpenBottomSheet={openBottomSheet}
                id={item.collaborationId}
              />
            )}
            keyExtractor={(item, index) => index.toString()}
            style={{ height: "100%", width: "100%" }}
            ListFooterComponent={renderFooter}
          />
        )}
      </View>
      {isVisible && (
        <BottomSheetActions
          cardId={selectedCollabId || ""}
          cardType="proposal"
          isVisible={isVisible}
          onClose={closeBottomSheet}
          snapPointsRange={["20%", "50%"]}
          key={selectedCollabId} // Ensure the BottomSheetActions re-renders with new id
        />
      )}
    </AppLayout>
  );
};

export default ContractScreen;
