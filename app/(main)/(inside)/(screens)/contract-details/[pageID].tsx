import BottomSheetActions from "@/components/BottomSheetActions";
import ContractDetailsContent, {
    Application,
} from "@/components/contracts/ContractDetailContent";
import DetailScreenCenteredLoader from "@/components/detail-screens/DetailScreenCenteredLoader";
import DetailScreenOverflowMenuButton from "@/components/detail-screens/DetailScreenOverflowMenuButton";
import ScreenHeader from "@/components/ui/screen-header";
import { useAuthContext } from "@/contexts";
import AppLayout from "@/layouts/app-layout";
import { ICollaboration } from "@/shared-libs/firestore/trendly-pro/models/collaborations";
import { IContracts } from "@/shared-libs/firestore/trendly-pro/models/contracts";
import { IUsers } from "@/shared-libs/firestore/trendly-pro/models/users";
import { Console } from "@/shared-libs/utils/console";
import { FirestoreDB } from "@/shared-libs/utils/firebase/firestore";
import { useMyNavigation } from "@/shared-libs/utils/router";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
    collection,
    doc,
    getDoc,
    onSnapshot,
} from "firebase/firestore";

interface ICollaborationCard extends IContracts {
    userData: IUsers;
    applications: Application[];
    collaborationData: ICollaboration;
}

const ContractDetailsScreen = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const router = useMyNavigation();
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
                collection(
                    FirestoreDB,
                    "collaborations",
                    contractData.collaborationId,
                    "applications"
                ),
                user!.id
            )
        );
        const application = applicationDoc.exists()
            ? ({
                  id: applicationDoc.id,
                  ...applicationDoc.data(),
              } as Application)
            : null;

        return {
            userData,
            applications: application ? [application] : [],
            collaborationData,
        };
    };

    useEffect(() => {
        if (!user?.id || !pageID || typeof pageID !== "string") return;

        setIsLoading(true);
        const contractRef = doc(FirestoreDB, "contracts", pageID);
        const unsubscribe = onSnapshot(
            contractRef,
            async (snapshot) => {
                if (!snapshot.exists()) {
                    setContract(undefined);
                    setIsLoading(false);
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
                } finally {
                    setIsLoading(false);
                }
            },
            (error) => {
                Console.error(error);
                setIsLoading(false);
            }
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
                <DetailScreenCenteredLoader />
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
                    <DetailScreenOverflowMenuButton
                        onPress={() => setIsVisible(true)}
                    />
                }
            />
            <ContractDetailsContent
                applicationData={contract.applications[0]}
                collaborationDetail={contract.collaborationData}
                userData={contract.userData}
                contractData={contract}
                refreshData={refreshData}
            />
            <BottomSheetActions
                cardId={contract.collaborationId}
                cardType="details"
                isVisible={isVisible}
                snapPointsRange={["30%", "50%"]}
                onClose={() => setIsVisible(false)}
            />
        </AppLayout>
    );
};

export default ContractDetailsScreen;
