import React, { useEffect } from "react";
import { View, FlatList } from "react-native";
import { Appbar } from "react-native-paper";
import AppLayout from "@/layouts/app-layout";
import { useTheme } from "@react-navigation/native";
import { stylesFn } from "@/styles/CollaborationDetails.styles";
import BackButton from "@/components/ui/back-button/BackButton";
import JobCard from "@/components/collaboration/CollaborationCard";
import Colors from "@/constants/Colors";
import { CollaborationType } from "@/shared-libs/firestore/trendly-pro/constants/collaboration-type";
import { SocialPlatform } from "@/shared-libs/firestore/trendly-pro/constants/social-platform";
import { PromotionType } from "@/shared-libs/firestore/trendly-pro/constants/promotion-type";
import {
  collection,
  query,
  where,
  doc as firebaseDoc,
  getDoc,
  doc,
} from "firebase/firestore";
import { FirestoreDB } from "@/utils/firestore";
import { getDocs } from "firebase/firestore";
import { AuthApp } from "@/utils/auth";
import BottomSheetActions from "@/components/BottomSheetActions";
import ContractCard from "@/components/ContractCard";

const PastApplicationPage = (props: any) => {
  const theme = useTheme();
  const styles = stylesFn(theme);
  const [isVisible, setIsVisible] = React.useState(false);
  const [proposals, setProposals] = React.useState<any>();
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedCollabId, setSelectedCollabId] = React.useState<string | null>(
    null
  );
  const openBottomSheet = (id: string) => {
    setIsVisible(true);
    setSelectedCollabId(id);
  };
  const closeBottomSheet = () => setIsVisible(false);

  const user = AuthApp.currentUser;

  const fetchContracts = async () => {
    try {
      const contractCol = collection(FirestoreDB, "contracts");
      const contractSnapshot = await getDocs(contractCol);

      const contractData = contractSnapshot.docs.map((doc) => ({
        id: doc.id,
        userId: doc.data().userId,
        collaborationId: doc.data().collaborationId,
        status: {
          sent: doc.data().status === "sent",
          active: doc.data().status === "active",
          approvalPending: doc.data().status === "approvalPending",
          changesRequested: doc.data().status === "changesRequested",
          done: doc.data().status === "done",
          prematureEnd: doc.data().status === "prematureEnd",
          archived: doc.data().status === "archived",
        },
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

          if (contract.status.active) {
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

      const enhancedContractsFiltered = enhancedContracts.filter(
        (contract) => contract !== null
      );

      setProposals(enhancedContractsFiltered);
    } catch (error) {
      console.error("Error fetching contracts: ", error);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  return (
    <AppLayout>
      <Appbar.Header
        statusBarHeight={0}
        style={{
          backgroundColor: Colors(theme).background,
        }}
      >
        <BackButton />
        <Appbar.Content title="Past Contracts" color={Colors(theme).text} />
      </Appbar.Header>
      <View
        style={{
          flex: 1,
          backgroundColor: Colors(theme).background,
          padding: 10,
        }}
      >
        <FlatList
          data={proposals}
          renderItem={({ item, index }) => (
            <ContractCard
              key={index}
              id={item.id}
              brandName={item.brandName}
              collaborationName={item.collaborationName}
              cost="Cost"
              status={item.status}
              onOpenBottomSheet={openBottomSheet}
            />
          )}
          style={{ height: "100%", width: "100%" }}
          keyExtractor={(item) => item.id}
        />
      </View>
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
    </AppLayout>
  );
};

export default PastApplicationPage;