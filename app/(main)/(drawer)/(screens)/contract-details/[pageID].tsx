import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { IconButton } from "react-native-paper";

import ContractDetailsContent, {
  Application,
} from "@/components/contracts/ContractDetailContent";
import { View } from "@/components/theme/Themed";
import ScreenHeader from "@/components/ui/screen-header";
import Colors from "@/constants/Colors";
import { useAuthContext } from "@/contexts";
import AppLayout from "@/layouts/app-layout";
import {
  ICollaboration
} from "@/shared-libs/firestore/trendly-pro/models/collaborations";
import { IContracts } from "@/shared-libs/firestore/trendly-pro/models/contracts";
import { IUsers } from "@/shared-libs/firestore/trendly-pro/models/users";
import { FirestoreDB } from "@/shared-libs/utils/firebase/firestore";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useTheme } from "@react-navigation/native";
import {
  collection,
  doc,
  getDoc
} from "firebase/firestore";
import { ActivityIndicator } from "react-native";
;

interface ICollaborationCard extends IContracts {
  userData: IUsers;
  applications: Application[];
  collaborationData: ICollaboration;
}

const ContractDetailsScreen = () => {
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { pageID } = useLocalSearchParams();
  const [contract, setContract] = useState<ICollaborationCard>();
  const { user } = useAuthContext();

  const fetchProposals = async () => {
    try {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      const contractsCol = doc(FirestoreDB, "contracts", pageID as string);
      const contractsSnapshot = await getDoc(contractsCol);

      const contract = contractsSnapshot.data() as IContracts;
      const collaborationId = contract.collaborationId;

      const userDataRef = doc(FirestoreDB, "users", contract.userId);
      const userSnapshot = await getDoc(userDataRef);
      const userData = userSnapshot.data() as IUsers;

      const applicationDoc = await getDoc(doc(collection(FirestoreDB, "collaborations", collaborationId, "applications"), user.id));
      const application = applicationDoc.exists() ? applicationDoc.data() as Application : null;

      // const hasAppliedQuery = query(
      //   collectionGroup(FirestoreDB, "applications"),
      //   where("userId", "==", user.id),
      //   where("collaborationId", "==", collaborationId)
      // );

      // const hasAppliedSnapshot = await getDocs(hasAppliedQuery);

      //@ts-ignore
      // const applications = hasAppliedSnapshot.docs.map((appDoc) => ({
      //   id: appDoc.id,
      //   ...appDoc.data(),
      // })) as Application[];

      const collaborationRef = doc(
        FirestoreDB,
        "collaborations",
        collaborationId
      );
      const collaborationSnapshot = await getDoc(collaborationRef);
      const collaborationData = collaborationSnapshot.data() as ICollaboration;

      setContract({
        ...contract,
        userData,
        applications: application ? [application] : [],
        collaborationData,
      });
    } catch (error) {
      console.error("Error fetching proposals: ", error);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  if (isLoading || !contract) {
    return (
      <AppLayout withWebPadding>
        <View style={{ flex: 1, alignItems: "center", padding: 20 }}>
          <ActivityIndicator size="large" color={Colors(theme).primary} />
        </View>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <ScreenHeader
        title="Contract"
        rightAction
        action={() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.navigate("/(tabs)/contracts");
          }
        }}
        rightActionButton={
          <IconButton
            icon={() => (
              <FontAwesomeIcon
                icon={faEllipsisV}
                size={20}
                color={Colors(theme).text}
              />
            )}
            onPress={() => {
              setIsVisible(true);
            }}
            iconColor={Colors(theme).text}
          />
        }
      />
      <ContractDetailsContent
        applicationData={contract?.applications[0]}
        collaborationDetail={contract?.collaborationData}
        userData={contract.userData}
        contractData={contract}
        refreshData={fetchProposals}
      />
    </AppLayout>
  );
};

export default ContractDetailsScreen;
