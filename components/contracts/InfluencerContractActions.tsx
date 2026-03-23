import { useChatContext } from "@/contexts";
import {
    ContractStatus,
    normalizeStatus,
} from "@/shared-constants/contract-status";
import { ContractStatusView } from "@/shared-uis/components/contract-status";
import type { ICollaboration } from "@/shared-libs/firestore/trendly-pro/models/collaborations";
import type { IContracts } from "@/shared-libs/firestore/trendly-pro/models/contracts";
import type { IUsers } from "@/shared-libs/firestore/trendly-pro/models/users";
import { Console } from "@/shared-libs/utils/console";
import { FirestoreDB } from "@/shared-libs/utils/firebase/firestore";
import { useMyNavigation } from "@/shared-libs/utils/router";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import { useTheme } from "@react-navigation/native";
import { doc, updateDoc } from "firebase/firestore";
import React, { useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Text as ThemedText } from "../theme/Themed";
import Button from "../ui/button";
import Colors from "@/shared-uis/constants/Colors";

const NUDGE_PAYMENT_MESSAGE = "Hi! Just a friendly reminder to complete the payment for our collaboration. Thank you.";
const NUDGE_SHIPMENT_MESSAGE = "Hi! Could you please share the shipment details when the product is shipped? Thank you.";
const MARKED_RECEIVED_MESSAGE = "I have marked the product as received.";

export interface InfluencerContractActionsProps {
    contract: IContracts;
    collaborationData: ICollaboration;
    userData: IUsers;
    refreshData: () => void | Promise<void>;
    showQuotationModal?: () => void;
    feedbackModalVisible?: () => void;
}

const InfluencerContractActions: React.FC<InfluencerContractActionsProps> = ({
    contract,
    collaborationData,
    refreshData,
    showQuotationModal,
    feedbackModalVisible,
}) => {
    const theme = useTheme();
    const colors = Colors(theme);
    const router = useMyNavigation();
    const { sendMessageToChannel, fetchChannelCid } = useChatContext();
    const [updating, setUpdating] = useState(false);
    const [nudging, setNudging] = useState(false);

    const normalizedStatus = useMemo(
        () => normalizeStatus(contract.status),
        [contract.status]
    );
    const isProductCollaboration =
        collaborationData?.promotionSubject === "physical_product";
    const contractRef = useMemo(
        () => doc(FirestoreDB, "contracts", contract.streamChannelId),
        [contract.streamChannelId]
    );

    const handleRefresh = async () => {
        try {
            await refreshData();
        } catch (e) {
            Console.error(e);
        }
    };

    const handleNudgePayment = async () => {
        setNudging(true);
        try {
            await sendMessageToChannel(
                contract.streamChannelId,
                NUDGE_PAYMENT_MESSAGE
            );
            Toaster.success("Message sent to the brand.");
        } catch (e) {
            Console.error(e);
            Toaster.error("Failed to send message.");
        } finally {
            setNudging(false);
        }
    };

    const handleNudgeShipment = async () => {
        setNudging(true);
        try {
            await sendMessageToChannel(
                contract.streamChannelId,
                NUDGE_SHIPMENT_MESSAGE
            );
            Toaster.success("Message sent to the brand.");
        } catch (e) {
            Console.error(e);
            Toaster.error("Failed to send message.");
        } finally {
            setNudging(false);
        }
    };

    const handleMarkAsReceived = async () => {
        setUpdating(true);
        try {
            await updateDoc(contractRef, {
                status: ContractStatus.VIDEO_PENDING,
            });
            try {
                await sendMessageToChannel(
                    contract.streamChannelId,
                    MARKED_RECEIVED_MESSAGE
                );
            } catch (_) {}
            Toaster.success("Marked as received.");
            await handleRefresh();
        } catch (e) {
            Console.error(e);
            Toaster.error("Failed to update.");
        } finally {
            setUpdating(false);
        }
    };

    const handleUploadVideoComplete = async () => {
        setUpdating(true);
        try {
            await updateDoc(contractRef, {
                status: ContractStatus.REVIEW_PENDING,
            });
            Toaster.success("Video submitted for review.");
            await handleRefresh();
        } catch (e) {
            Console.error(e);
            Toaster.error("Failed to update.");
        } finally {
            setUpdating(false);
        }
    };

    const handleReuploadVideoComplete = async () => {
        setUpdating(true);
        try {
            await updateDoc(contractRef, {
                status: ContractStatus.REVIEW_PENDING,
            });
            Toaster.success("Video re-submitted for review.");
            await handleRefresh();
        } catch (e) {
            Console.error(e);
            Toaster.error("Failed to update.");
        } finally {
            setUpdating(false);
        }
    };

    const handleGoToMessages = async () => {
        try {
            const cid = await fetchChannelCid(contract.streamChannelId);
            router.push(`/channel/${cid}`);
        } catch (e) {
            Toaster.error("Could not open messages.");
        }
    };

    const styles = useMemo(() => createStyles(colors), [colors]);

    if (normalizedStatus === ContractStatus.PAYMENT_FAILED) {
        return null;
    }

    return (
        <View style={styles.container}>
            <ContractStatusView
                status={normalizedStatus}
                actor="influencer"
                scheduledReleaseAt={contract.releasePlan?.scheduledReleaseAt}
                showDescription
            />

            {(updating || nudging) && (
                <View style={styles.loadingRow}>
                    <ActivityIndicator size="small" color={colors.primary} />
                    <ThemedText style={styles.loadingText}>
                        {updating ? "Updating…" : "Sending…"}
                    </ThemedText>
                </View>
            )}

            <View style={styles.actions}>
                {normalizedStatus === ContractStatus.KYC_VERIFICATION && (
                    <Button
                        mode="contained"
                        style={styles.button}
                        onPress={() => router.push("/verification")}
                        disabled={updating}
                    >
                        Complete KYC
                    </Button>
                )}

                {normalizedStatus === ContractStatus.CONTRACT_PENDING && (
                    <ThemedText style={styles.infoText}>
                        Waiting for brand to confirm.
                    </ThemedText>
                )}

                {normalizedStatus === ContractStatus.PAYMENT_PENDING && (
                    <>
                        <Button
                            mode="contained"
                            style={styles.button}
                            onPress={handleNudgePayment}
                            disabled={nudging}
                        >
                            Nudge Brand for Payment
                        </Button>
                        <Button
                            mode="outlined"
                            style={styles.button}
                            onPress={handleGoToMessages}
                        >
                            Go to Messages
                        </Button>
                    </>
                )}

                {normalizedStatus === ContractStatus.PAYMENT_SUCCESSFUL && (
                    <ThemedText style={styles.infoText}>
                        Payment received. Next steps will appear here.
                    </ThemedText>
                )}

                {normalizedStatus === ContractStatus.SHIPPING_PENDING && (
                    <>
                        <ThemedText style={styles.infoText}>
                            Shipment is pending from the brand.
                        </ThemedText>
                        <Button
                            mode="outlined"
                            style={styles.button}
                            onPress={handleNudgeShipment}
                            disabled={nudging}
                        >
                            Nudge for Shipment
                        </Button>
                    </>
                )}

                {normalizedStatus === ContractStatus.DELIVERY_PENDING &&
                    isProductCollaboration && (
                        <>
                            <Button
                                mode="contained"
                                style={styles.button}
                                onPress={handleMarkAsReceived}
                                disabled={updating}
                            >
                                Mark as Received
                            </Button>
                            <Button
                                mode="outlined"
                                style={styles.button}
                                onPress={handleGoToMessages}
                            >
                                Go to Messages
                            </Button>
                        </>
                    )}

                {normalizedStatus === ContractStatus.DELIVERY_PENDING &&
                    !isProductCollaboration && (
                        <ThemedText style={styles.infoText}>
                            Delivery pending. Complete the required steps.
                        </ThemedText>
                    )}

                {normalizedStatus === ContractStatus.VIDEO_PENDING && (
                    <>
                        <Button
                            mode="contained"
                            style={styles.button}
                            onPress={handleUploadVideoComplete}
                            disabled={updating}
                        >
                            Upload Video
                        </Button>
                        <ThemedText style={styles.helperText}>
                            After you upload your collaboration video, click
                            above to submit it for brand review.
                        </ThemedText>
                    </>
                )}

                {normalizedStatus === ContractStatus.REVIEW_PENDING && (
                    <>
                        <ThemedText style={styles.infoText}>
                            Video is under review.
                        </ThemedText>
                        {feedbackModalVisible && (
                            <Button
                                mode="outlined"
                                style={styles.button}
                                onPress={feedbackModalVisible}
                            >
                                Give Feedback
                            </Button>
                        )}
                    </>
                )}

                {normalizedStatus === ContractStatus.REVISION_PENDING && (
                    <>
                        <Button
                            mode="contained"
                            style={styles.button}
                            onPress={handleReuploadVideoComplete}
                            disabled={updating}
                        >
                            Re-upload Video
                        </Button>
                        <ThemedText style={styles.helperText}>
                            Re-upload with the requested changes, then click
                            above to submit for review.
                        </ThemedText>
                    </>
                )}

                {normalizedStatus === ContractStatus.RELEASE_PLANNING && (
                    <ThemedText style={styles.infoText}>
                        Release will be scheduled by the brand.
                    </ThemedText>
                )}

                {normalizedStatus === ContractStatus.RELEASE_SCHEDULED && (
                    <ThemedText style={styles.infoText}>
                        Video scheduled for release. See date above.
                    </ThemedText>
                )}

                {normalizedStatus === ContractStatus.VIDEO_POSTED && (
                    <ThemedText style={styles.infoText}>
                        Video has been posted.
                    </ThemedText>
                )}

                {normalizedStatus === ContractStatus.SETTLEMENT_DONE && (
                    <>
                        <ThemedText style={styles.infoText}>
                            Contract closed. Settlement complete.
                        </ThemedText>
                        {feedbackModalVisible && (
                            <Button
                                mode="outlined"
                                style={styles.button}
                                onPress={feedbackModalVisible}
                            >
                                Give Feedback
                            </Button>
                        )}
                    </>
                )}
            </View>
        </View>
    );
};

function createStyles(colors: ReturnType<typeof Colors>) {
    return StyleSheet.create({
        container: {
            width: "100%",
            backgroundColor: "transparent",
            gap: 16,
            marginTop: 16,
        },
        loadingRow: {
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
        },
        loadingText: {
            fontSize: 14,
            color: colors.gray300,
        },
        actions: {
            gap: 12,
        },
        button: {
            alignSelf: "flex-start",
        },
        infoText: {
            fontSize: 14,
            color: colors.gray300,
            lineHeight: 20,
        },
        helperText: {
            fontSize: 12,
            color: colors.gray300,
            lineHeight: 18,
        },
    });
}

export default InfluencerContractActions;
