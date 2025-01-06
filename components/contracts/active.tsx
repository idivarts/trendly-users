import BottomSheetActions from "@/components/BottomSheetActions";
import JobCard from "@/components/collaboration/CollaborationCard";
import { Text, View } from "@/components/theme/Themed";
import Colors from "@/constants/Colors";
import AppLayout from "@/layouts/app-layout";
import { useTheme } from "@react-navigation/native";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  collectionGroup,
  doc,
  getDoc,
} from "firebase/firestore";
import { ActivityIndicator, FlatList, Pressable } from "react-native";
import { FirestoreDB } from "@/utils/firestore";
import { AuthApp } from "@/utils/auth";
import { RefreshControl } from "react-native";
import { stylesFn } from "@/styles/Proposal.styles";
import EmptyState from "../ui/empty-state";
import { useBreakpoints } from "@/hooks";
import { Card } from "react-native-paper";
import { IContracts } from "@/shared-libs/firestore/trendly-pro/models/contracts";
import { IUsers } from "@/shared-libs/firestore/trendly-pro/models/users";
import {
  IApplications,
  ICollaboration,
} from "@/shared-libs/firestore/trendly-pro/models/collaborations";
import ContractHeader from "../contract-card/ContractHeader";
import ContractDetails from "../contract-card/ContractDetails";
import { IBrands } from "@/shared-libs/firestore/trendly-pro/models/brands";
import CollaborationHeader from "../collaboration/card-components/CollaborationHeader";

interface ICollaborationCard extends IContracts {
  brandData: IBrands;
  applications: IApplications[];
  collaborationData: ICollaboration;
}

const ActiveContracts = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [proposals, setProposals] = useState<ICollaborationCard[]>([]);
  const [selectedCollabId, setSelectedCollabId] = useState<string | null>(null);

  const closeBottomSheet = () => setIsVisible(false);

  const theme = useTheme();
  const styles = stylesFn(theme);
  const user = AuthApp.currentUser;

  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { xl } = useBreakpoints();

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchProposals();
    setRefreshing(false);
  };

  const fetchProposals = async () => {
    try {
      setIsLoading(true);
      const user = AuthApp.currentUser;

      if (!user?.uid) {
        throw new Error("User not authenticated");
      }

      const contractsCol = collection(FirestoreDB, "contracts");
      const querySnap = query(contractsCol, where("userId", "==", user.uid));
      const contractsSnapshot = await getDocs(querySnap);

      const contracts = await Promise.all(
        contractsSnapshot.docs.map(async (document) => {
          const contract = document.data() as IContracts;
          const collaborationId = contract.collaborationId;

          const hasAppliedQuery = query(
            collectionGroup(FirestoreDB, "applications"),
            where("userId", "==", user.uid),
            where("collaborationId", "==", collaborationId)
          );

          const hasAppliedSnapshot = await getDocs(hasAppliedQuery);

          //@ts-ignore
          const applications = hasAppliedSnapshot.docs.map((appDoc) => ({
            id: appDoc.id,
            ...appDoc.data(),
          })) as IApplications[];

          const collaborationRef = doc(
            FirestoreDB,
            "collaborations",
            collaborationId
          );
          const collaborationSnapshot = await getDoc(collaborationRef);
          //@ts-ignore
          const collaborationData = {
            id: collaborationSnapshot.id,
            ...collaborationSnapshot.data(),
          } as ICollaboration;

          const brandRef = doc(
            FirestoreDB,
            "brands",
            collaborationData.brandId
          );
          const brandSnapshot = await getDoc(brandRef);
          const brandData = brandSnapshot.data() as IBrands;

          return {
            ...contract,
            applications,
            collaborationData,
            brandData,
          };
        })
      );

      setProposals(contracts);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching proposals: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, [user]);

  const filteredProposals = useMemo(() => {
    return proposals.filter((proposal) => proposal.status !== 3);
  }, [proposals]);

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
      {filteredProposals.length === 0 ? (
        <EmptyState
          image={require("@/assets/images/illustration6.png")}
          subtitle="Start Applying today and get exclusive collabs"
          title="No Contracts yet"
          action={() => router.push("/collaborations")}
          actionLabel="Explore Collaborations"
        />
      ) : (
        <View style={{ flex: 1 }}>
          <FlatList
            data={filteredProposals}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  router.push(`/contract-details/${item.streamChannelId}`);
                }}
                style={{
                  width: "100%",
                  borderWidth: 0.3,
                  borderColor: Colors(theme).gray300,
                  borderRadius: 5,
                  overflow: "hidden",
                }}
              >
                <CollaborationHeader
                  brand={{
                    image: item.brandData.image || "",
                    name: item.brandData.name,
                    paymentVerified:
                      item.brandData.paymentMethodVerified || false,
                  }}
                  cardId={item.streamChannelId}
                  cardType="contract"
                  collaboration={{
                    //@ts-ignore
                    collabId: item.collaborationData.id,
                    collabName: item.collaborationData.name,
                    timePosted: item.collaborationData.timeStamp,
                  }}
                  onOpenBottomSheet={() => {}}
                />
                <ContractDetails
                  application={
                    item.applications[0] || {
                      message: "No message",
                      quotation: "No quotation",
                      timeline: new Date().toISOString(),
                    }
                  }
                  collabDetails={item.collaborationData.description || ""}
                />
              </Pressable>
            )}
            keyExtractor={(item, index) => index.toString()}
            style={{
              flexGrow: 1,
              paddingBottom: 16,
              paddingHorizontal: 16,
              paddingTop: 8,
            }}
            contentContainerStyle={{
              gap: 16,
              paddingBottom: 24,
              alignItems: xl ? "center" : "stretch",
            }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={[Colors(theme).primary]}
              />
            }
            horizontal={false}
            numColumns={xl ? 2 : 1} // TODO: On fly can't be responsive
            {...(xl && {
              columnWrapperStyle: {
                gap: 16,
              },
            })}
          />
        </View>
      )}
    </View>
  );
};

export default ActiveContracts;
