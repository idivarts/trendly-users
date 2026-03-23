import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { IconButton } from "react-native-paper";

import ContractDetailsContent, {
    Application,
} from "@/components/contracts/ContractDetailContent";
import { View } from "@/components/theme/Themed";
import ScreenHeader from "@/components/ui/screen-header";
import { useAuthContext } from "@/contexts";
import AppLayout from "@/layouts/app-layout";
import {
    ICollaboration
} from "@/shared-libs/firestore/trendly-pro/models/collaborations";
import { IContracts } from "@/shared-libs/firestore/trendly-pro/models/contracts";
import { IUsers } from "@/shared-libs/firestore/trendly-pro/models/users";
import { Console } from "@/shared-libs/utils/console";
import { FirestoreDB } from "@/shared-libs/utils/firebase/firestore";
import { useMyNavigation } from "@/shared-libs/utils/router";
import Colors from "@/shared-uis/constants/Colors";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useTheme } from "@react-navigation/native";
import {
    collection,
    doc,
    getDoc,
    onSnapshot,
} from "firebase/firestore";
import { ActivityIndicator } from "react-native";

interface ICollaborationCard extends IContracts {
    userData: IUsers;
    applications: Application[];
    collaborationData: ICollaboration;
}

const ContractDetailsScreen = () => {
    const theme = useTheme();
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const router = useMyNavigation()
    const { pageID } = useLocalSearchParams();
    const [contract, setContract] = useState<ICollaborationCard>();
    const { user } = useAuthContext();

    const fetchCollaborationAndUser = async (
        contractData: IContracts
    ): Promise<Omit<ICollaborationCard, keyof IContracts>> => {
        const collaborationRef = doc(
            FirestoreDB,
            "collaborations",
            contractData.collaborationId
        );
        const collaborationSnapshot = await getDoc(collaborationRef);
        const collaborationData = collaborationSnapshot.data() as ICollaboration;

        const userDataRef = doc(FirestoreDB, "users", contractData.userId);
        const userSnapshot = await getDoc(userDataRef);
        const userData = userSnapshot.data() as IUsers;

        const applicationDoc = await getDoc(
            doc(
                collection(FirestoreDB, "collaborations", contractData.collaborationId, "applications"),
                user!.id
            )
        );
        const application = applicationDoc.exists()
            ? (applicationDoc.data() as Application)
            : null;

        return {
            userData,
            applications: application ? [application] : [],
            collaborationData,
        };
    };

    useEffect(() => {
        if (!user?.id || !pageID || typeof pageID !== "string") return;

        const contractRef = doc(FirestoreDB, "contracts", pageID);
        const unsubscribe = onSnapshot(
            contractRef,
            async (snapshot) => {
                if (!snapshot.exists()) {
                    setContract(undefined);
                    return;
                }
                const contractData = snapshot.data() as IContracts;
                try {
                    const rest = await fetchCollaborationAndUser(contractData);
                    setContract({
                        ...contractData,
                        ...rest,
                    });
                } catch (error) {
                    Console.error(error);
                }
            },
            (error) => Console.error(error)
        );
        return () => unsubscribe();
    }, [user?.id, pageID]);

    const refreshData = useCallback(async () => {
        if (!user?.id || !pageID || typeof pageID !== "string") return;
        const contractRef = doc(FirestoreDB, "contracts", pageID);
        const snap = await getDoc(contractRef);
        if (!snap.exists()) return;
        const contractData = snap.data() as IContracts;
        try {
            const rest = await fetchCollaborationAndUser(contractData);
            setContract({ ...contractData, ...rest });
        } catch (error) {
            Console.error(error);
        }
    }, [user?.id, pageID]);

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
                        router.push("/contracts");
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
                refreshData={refreshData}
            />
        </AppLayout>
    );
};

export default ContractDetailsScreen;
