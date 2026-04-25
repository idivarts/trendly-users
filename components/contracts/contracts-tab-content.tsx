import { View } from "@/components/theme/Themed";
import { useAuthContext } from "@/contexts";
import { useBreakpoints } from "@/hooks";
import AppLayout from "@/layouts/app-layout";
import { IBrands } from "@/shared-libs/firestore/trendly-pro/models/brands";
import {
    IApplications,
    ICollaboration,
} from "@/shared-libs/firestore/trendly-pro/models/collaborations";
import { IContracts } from "@/shared-libs/firestore/trendly-pro/models/contracts";
import { Console } from "@/shared-libs/utils/console";
import { FirestoreDB } from "@/shared-libs/utils/firebase/firestore";
import { useMyNavigation } from "@/shared-libs/utils/router";
import Colors from "@/shared-uis/constants/Colors";
import { stylesFn } from "@/styles/Proposal.styles";
import { useTheme } from "@react-navigation/native";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where
} from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
} from "react-native";
import EmptyState from "../ui/empty-state";
import ContractCardRow, { type ICollaborationCard } from "./contract-card";

export type ContractsTabScope = "active" | "past";

const EMPTY_STATE = {
    image: require("@/assets/images/illustration6.png"),
    subtitle: "Start Applying today and get exclusive collabs",
    actionLabel: "Explore Collaborations",
} as const;

const SCOPE_CONFIG: Record<ContractsTabScope, { emptyTitle: string }> = {
    active: {
        emptyTitle: "No Contracts yet",
    },
    past: {
        emptyTitle: "No Contracts yet",
    },
};

export interface ContractsTabContentProps {
    scope: ContractsTabScope;
}

const ContractsTabContent = ({ scope }: ContractsTabContentProps) => {
    const [proposals, setProposals] = useState<ICollaborationCard[]>([]);
    const { user } = useAuthContext();
    const theme = useTheme();
    const colors = Colors(theme);
    const styles = stylesFn(theme);
    const { xl } = useBreakpoints();
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const router = useMyNavigation();

    const listStyles = useMemo(() => createContractListStyles(xl), [xl]);

    const { emptyTitle } = SCOPE_CONFIG[scope];

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchProposals();
        setRefreshing(false);
    };

    const fetchProposals = async () => {
        try {
            setIsLoading(true);

            if (!user?.id) {
                throw new Error("User not authenticated");
            }

            const contractsCol = collection(FirestoreDB, "contracts");
            const querySnap = query(
                contractsCol,
                where("userId", "==", user.id),
                scope === "active" ? where("status", "<=", 9) : where("status", ">=", 10),
                // removing orderBy to avoid pagination issues
                // orderBy("contractTimestamp.startedOn", "desc")
            );
            const contractsSnapshot = await getDocs(querySnap);

            const contracts = await Promise.all(
                contractsSnapshot.docs.map(async (document) => {
                    const contract = document.data() as IContracts;
                    const collaborationId = contract.collaborationId;

                    const applicationDoc = await getDoc(
                        doc(
                            collection(
                                FirestoreDB,
                                "collaborations",
                                collaborationId,
                                "applications"
                            ),
                            user.id
                        )
                    );
                    const application = applicationDoc.data() as IApplications;

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
                        applications: [application],
                        collaborationData,
                        brandData,
                    };
                })
            );

            console.log("Contracts:", contracts);

            setProposals(contracts);
            setIsLoading(false);
        } catch (error) {
            Console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProposals();
    }, [user?.id, scope]);

    if (isLoading) {
        return (
            <AppLayout>
                <View style={styles.container}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            </AppLayout>
        );
    }

    return (
        <View style={layoutStyles.outer}>
            {proposals.length === 0 ? (
                <EmptyState
                    image={EMPTY_STATE.image}
                    subtitle={EMPTY_STATE.subtitle}
                    title={emptyTitle}
                    action={() => router.push("/collaborations")}
                    actionLabel={EMPTY_STATE.actionLabel}
                />
            ) : (
                <View style={layoutStyles.listWrap}>
                    <FlatList
                        data={proposals}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <ContractCardRow item={item} />
                        )}
                        keyExtractor={(item, index) =>
                            item.streamChannelId != null
                                ? String(item.streamChannelId)
                                : String(index)
                        }
                        style={listStyles.list}
                        contentContainerStyle={listStyles.listContent}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={handleRefresh}
                                colors={[colors.primary]}
                            />
                        }
                        horizontal={false}
                        numColumns={xl ? 2 : 1}
                        {...(xl && {
                            columnWrapperStyle: listStyles.columnWrapper,
                        })}
                    />
                </View>
            )}
        </View>
    );
};

const layoutStyles = StyleSheet.create({
    outer: {
        width: "100%",
        flex: 1,
    },
    listWrap: {
        flex: 1,
    },
});

function createContractListStyles(xl: boolean) {
    return StyleSheet.create({
        list: {
            flexGrow: 1,
            paddingBottom: 16,
            paddingHorizontal: 16,
            paddingTop: 8,
        },
        listContent: {
            gap: 16,
            paddingBottom: 24,
            alignItems: xl ? "center" : "stretch",
        },
        columnWrapper: {
            gap: 16,
        },
    });
}

export default ContractsTabContent;
