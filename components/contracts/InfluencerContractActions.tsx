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
import { useMyNavigation } from "@/shared-libs/utils/router";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import { useTheme } from "@react-navigation/native";
import React, { useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Text as ThemedText } from "../theme/Themed";
import Button from "../ui/button";
import Colors from "@/shared-uis/constants/Colors";
import { state4MarkProductReceived } from "./api/DeliveryPending_api";
import { state5SubmitDeliverable } from "./api/VideoPending_api";
import { state6MarkVideoReuploaded } from "./api/ReviewPending_api";

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
    userData,
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
        collaborationData?.promotionSubject === "physical-product";
    const hasRevisionRequest =
        (contract.deliverable?.revisionCount || 0) > 0 ||
        (contract.deliverable?.revisionNotes?.length || 0) > 0;
    const scheduledReleaseAt =
        contract.posting?.scheduledDate ??
        (
            contract as IContracts & {
                releasePlan?: { scheduledReleaseAt?: number };
            }
        ).releasePlan?.scheduledReleaseAt;

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
            const proofPhotoUrl = contract.shipment?.packageScreenshots?.[0];
            if (!proofPhotoUrl?.trim()) {
                throw new Error(
                    "No package photo on file for this shipment. Please confirm receipt from contract details with your photo."
                );
            }
            await state4MarkProductReceived({
                contractId: contract.streamChannelId,
                photoUrl: proofPhotoUrl,
                notes: MARKED_RECEIVED_MESSAGE,
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
            Toaster.error((e as Error)?.message || "Failed to update.");
        } finally {
            setUpdating(false);
        }
    };

    const handleUploadVideoComplete = async () => {
        setUpdating(true);
        try {
            const existingVideoUrl = contract.deliverable?.deliverableLinks?.[0];
            if (!existingVideoUrl?.trim()) {
                throw new Error("No uploaded video found. Please upload video from contract details flow.");
            }
            await state5SubmitDeliverable({
                contractId: contract.streamChannelId,
                videoUrl: existingVideoUrl,
            });
            Toaster.success("Video submitted for review.");
            await handleRefresh();
        } catch (e) {
            Console.error(e);
            Toaster.error((e as Error)?.message || "Failed to update.");
        } finally {
            setUpdating(false);
        }
    };

    const handleReuploadVideoComplete = async () => {
        setUpdating(true);
        try {
            const existingVideoUrl = contract.deliverable?.deliverableLinks?.[0];
            if (!existingVideoUrl?.trim()) {
                throw new Error("No uploaded video found. Please re-upload from contract details flow.");
            }
            await state6MarkVideoReuploaded({
                contractId: contract.streamChannelId,
                videoUrl: existingVideoUrl,
            });
            Toaster.success("Video re-submitted for review.");
            await handleRefresh();
        } catch (e) {
            Console.error(e);
            Toaster.error((e as Error)?.message || "Failed to update.");
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

    if (normalizedStatus === ContractStatus.PaymentFailed) {
        return null;
    }

    return (
        <View style={styles.container}>
            <ContractStatusView
                status={normalizedStatus}
                actor="influencer"
                scheduledReleaseAt={scheduledReleaseAt}
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
                {normalizedStatus === ContractStatus.Pending &&
                    !userData?.isKYCDone && (
                        <Button
                            mode="contained"
                            style={styles.button}
                            onPress={() => router.push("/verification")}
                            disabled={updating}
                        >
                            Complete KYC
                        </Button>
                    )}

                {normalizedStatus === ContractStatus.Pending &&
                    userData?.isKYCDone && (
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

                {normalizedStatus === ContractStatus.Started && (
                    <ThemedText style={styles.infoText}>
                        Contract is active. Payment or onboarding is complete;
                        next steps will follow from the brand.
                    </ThemedText>
                )}

                {normalizedStatus === ContractStatus.ShipmentPending && (
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

                {normalizedStatus === ContractStatus.DeliveryPending &&
                    isProductCollaboration && (
                        <ThemedText style={styles.infoText}>
                            Your shipment is on the way. You can confirm receipt
                            once the product arrives.
                        </ThemedText>
                    )}

                {normalizedStatus === ContractStatus.DeliveryPending &&
                    !isProductCollaboration && (
                        <ThemedText style={styles.infoText}>
                            Waiting for the next step from the brand.
                        </ThemedText>
                    )}

                {normalizedStatus === ContractStatus.DeliveryAcknowledgementPending &&
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

                {normalizedStatus === ContractStatus.DeliveryAcknowledgementPending &&
                    !isProductCollaboration && (
                        <ThemedText style={styles.infoText}>
                            Waiting for the next operational step.
                        </ThemedText>
                    )}

                {normalizedStatus === ContractStatus.VideoPending && (
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

                {normalizedStatus === ContractStatus.ReviewPending &&
                    hasRevisionRequest && (
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

                {normalizedStatus === ContractStatus.ReviewPending &&
                    !hasRevisionRequest && (
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

                {normalizedStatus === ContractStatus.PostingPending && (
                    <ThemedText style={styles.infoText}>
                        {scheduledReleaseAt
                            ? "Video scheduled for release. See date above."
                            : "Posting or release is in progress. Complete steps from contract details when the brand is ready."}
                    </ThemedText>
                )}

                {normalizedStatus === ContractStatus.SettlementPending && (
                    <>
                        <ThemedText style={styles.infoText}>
                            Video has been posted. Share feedback when ready.
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

                {normalizedStatus === ContractStatus.Settled && (
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
