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
    orderBy,
    query,
    where
} from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, RefreshControl } from "react-native";
import CollaborationHeader from "../collaboration/card-components/CollaborationHeader";
import ContractDetails from "../contract-card/ContractDetails";
import EmptyState from "../ui/empty-state";
;

interface ICollaborationCard extends IContracts {
    brandData: IBrands;
    applications: IApplications[];
    collaborationData: ICollaboration;
}

const ActiveContracts = () => {
    const [proposals, setProposals] = useState<ICollaborationCard[]>([]);
    const { user } = useAuthContext();

    const theme = useTheme();
    const styles = stylesFn(theme);

    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const router = useMyNavigation()

    const { xl } = useBreakpoints();

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
            const querySnap = query(contractsCol, where("userId", "==", user.id), orderBy("contractTimestamp.startedOn", "desc"));
            const contractsSnapshot = await getDocs(querySnap);

            const contracts = await Promise.all(
                contractsSnapshot.docs.map(async (document) => {
                    const contract = document.data() as IContracts;
                    const collaborationId = contract.collaborationId;

                    const applicationDoc = await getDoc(doc(collection(FirestoreDB, "collaborations", collaborationId, "applications"), user.id));
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
    }, [user]);

    const filteredProposals = useMemo(() => {
        return proposals.filter((proposal) => {
            return proposal.status !== 0 && proposal.status !== 3;
        });
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
                                    flex: 1,
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
                                        timePosted: item.contractTimestamp.startedOn,
                                    }}
                                    onOpenBottomSheet={() => { }}
                                />
                                <ContractDetails
                                    application={
                                        item.applications[0] || {
                                            message: "No message",
                                            quotation: "No quotation",
                                            // timeline: new Date().toISOString(),
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
