import { useChatContext } from "@/contexts";
import { ContractStatus, normalizeStatus } from "@/shared-constants/contract-status";
import { useAWSContext } from "@/shared-libs/contexts/aws-context.provider";
import type { ICollaboration } from "@/shared-libs/firestore/trendly-pro/models/collaborations";
import type { IContracts } from "@/shared-libs/firestore/trendly-pro/models/contracts";
import type { IUsers } from "@/shared-libs/firestore/trendly-pro/models/users";
import { useMyNavigation } from "@/shared-libs/utils/router";
import {
    ContractActionsWithMessage,
    type ContractActionButton,
    type ContractActionsMessage,
} from "@/shared-uis/components/contract-actions-with-message";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import { useCallback, useEffect, useMemo, useRef, useState, type FC } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Text } from "../theme/Themed";
import {
    state0AskToStartContract,
    state2AskRetryPayment,
    state3NudgeForShipment,
} from "./api/ShipmentPending_api";
import { state6RequestApproval } from "./api/ReviewPending_api";
import MarkVideoPostedModal, { useMarkVideoPostedModal } from "./MarkVideoPostedModal";
import ProductReceivedModal, { useProductReceivedModal } from "./ProductReceivedModal";
import RequestRescheduleModal, { useRequestRescheduleModal } from "./RequestRescheduleModal";
import SubmitVideoModal, { useSubmitVideoModal } from "./SubmitVideoModal";

interface ActionContainerProps {
    contract: IContracts;
    refreshData: () => void | Promise<void>;
    feedbackModalVisible: () => void;
    showQuotationModal: () => void;
    userData: IUsers;
    collaborationData: ICollaboration;
}

const ActionContainer: FC<ActionContainerProps> = ({
    contract,
    refreshData,
    feedbackModalVisible,
    showQuotationModal,
    userData,
    collaborationData,
}) => {
    const { fetchChannelCid } = useChatContext();
    const { uploadFile, uploadFileUri } = useAWSContext();
    const router = useMyNavigation();
    const [loading, setLoading] = useState(false);
    const shipmentDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const shipmentInFlightRef = useRef(false);
    const approvalDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const approvalInFlightRef = useRef(false);

    const normalizedStatus = normalizeStatus(contract.status);
    const isProductCollaboration =
        collaborationData?.promotionSubject === "physical-product";
    const isKycBlocked = !userData?.isKYCDone;
    const hasRevisionRequest =
        (contract.deliverable?.revisionCount || 0) > 0 ||
        (contract.deliverable?.revisionNotes?.length || 0) > 0;
    const scheduledReleaseAt =
        // Support both typed posting and currently used releasePlan shape.
        contract.posting?.scheduledDate ||
        (contract as IContracts & { releasePlan?: { scheduledReleaseAt?: number } }).releasePlan?.scheduledReleaseAt;

    const getShippingDetailsMessage = () => {
        const provider = contract.shipment?.shipmentProvider || "N/A";
        const trackingId = contract.shipment?.trackingId || "N/A";
        const expectedDate = contract.shipment?.expectedDate
            ? new Date(contract.shipment.expectedDate).toLocaleDateString()
            : "N/A";
        return `Courier: ${provider}\nTracking ID: ${trackingId}\nExpected Date: ${expectedDate}`;
    };

    const getPostScheduledMessage = () => {
        if (!scheduledReleaseAt) {
            return "The customer wanted the video to be posted on the scheduled release date.";
        }
        const formattedDate = new Date(scheduledReleaseAt).toLocaleDateString(undefined, {
            day: "numeric",
            month: "long",
        });
        return `The customer wanted the video to be posted on ${formattedDate}.`;
    };

    useEffect(() => {
        return () => {
            if (shipmentDebounceRef.current) {
                clearTimeout(shipmentDebounceRef.current);
            }
            if (approvalDebounceRef.current) {
                clearTimeout(approvalDebounceRef.current);
            }
        };
    }, []);

    const runWithRefresh = useCallback(
        async (fn: () => Promise<void>, success: string) => {
            setLoading(true);
            try {
                await fn();
                await refreshData();
                Toaster.success(success);
            } catch (error: unknown) {
                const message = error instanceof Error ? error.message : "Something went wrong";
                Toaster.error(message);
            } finally {
                setLoading(false);
            }
        },
        [refreshData]
    );

    const productReceivedModal = useProductReceivedModal({
        contractId: contract.streamChannelId,
        uploadFileUri,
        runWithRefresh,
    });

    const submitVideoModal = useSubmitVideoModal({
        contractId: contract.streamChannelId,
        uploadFile,
        uploadFileUri,
        runWithRefresh,
    });

    const markVideoPostedModal = useMarkVideoPostedModal({
        contractId: contract.streamChannelId,
        uploadFile,
        uploadFileUri,
        runWithRefresh,
        setActionLoading: setLoading,
    });

    const requestRescheduleModal = useRequestRescheduleModal({
        contractId: contract.streamChannelId,
        runWithRefresh,
    });

    const requestShipmentWithDebounce = async () => {
        if (shipmentInFlightRef.current || shipmentDebounceRef.current) {
            return;
        }
        shipmentInFlightRef.current = true;
        shipmentDebounceRef.current = setTimeout(() => {
            shipmentDebounceRef.current = null;
        }, 1500);

        try {
            await runWithRefresh(
                () => state3NudgeForShipment({ streamChannelId: contract.streamChannelId }),
                "Shipment request sent."
            );
        } finally {
            shipmentInFlightRef.current = false;
        }
    };

    const requestApprovalWithDebounce = async () => {
        if (approvalInFlightRef.current || approvalDebounceRef.current) {
            return;
        }
        approvalInFlightRef.current = true;
        approvalDebounceRef.current = setTimeout(() => {
            approvalDebounceRef.current = null;
        }, 1500);

        try {
            await runWithRefresh(
                () => state6RequestApproval({ contractId: contract.streamChannelId }),
                "Approval request sent."
            );
        } finally {
            approvalInFlightRef.current = false;
        }
    };

    const openMessages = useCallback(async () => {
        const channelCid = await fetchChannelCid(contract.streamChannelId);
        router.push(`/channel/${channelCid}`);
    }, [fetchChannelCid, contract.streamChannelId, router]);

    const actionsConfig = useMemo((): {
        buttons: ContractActionButton[] | [ContractActionButton] | [ContractActionButton, ContractActionButton];
        message: ContractActionsMessage;
    } => {
        if (isKycBlocked) {
            return {
                buttons: [
                    {
                        label: "Complete Profile Verification",
                        onPress: () => router.push("/verification"),
                        variant: "contained",
                        disabled: loading,
                    },
                ],
                message: {
                    variant: "warning",
                    text: "You need to complete profile verification in order to get into a contract as an influencer.",
                },
            };
        }

        switch (normalizedStatus) {
            case ContractStatus.Pending:
                return {
                    buttons: [
                        {
                            label: "Revise Quotation",
                            onPress: showQuotationModal,
                            variant: "outlined",
                            disabled: loading,
                        },
                        {
                            label: "Ask to Start Contract",
                            onPress: () =>
                                runWithRefresh(
                                    () => state0AskToStartContract({ streamChannelId: contract.streamChannelId }),
                                    "Start contract request sent."
                                ),
                            variant: "contained",
                            disabled: loading,
                        },
                    ],
                    message: {
                        variant: "warning",
                        text: "The contract is still not funded. Don’t start working on the requirement till the contract is funded",
                    },
                };
            case ContractStatus.Started:
                return {
                    buttons: [
                        {
                            label: "Go to Messages",
                            onPress: openMessages,
                            variant: "contained",
                            disabled: loading,
                        },
                    ],
                    message: {
                        variant: "info",
                        text: "Contract is active. Please wait for the next operational step from the brand.",
                    },
                };
            case ContractStatus.PaymentFailed:
                return {
                    buttons: [
                        {
                            label: "Ask to retry Payment",
                            onPress: () =>
                                runWithRefresh(
                                    () => state2AskRetryPayment({ streamChannelId: contract.streamChannelId }),
                                    "Payment retry request sent."
                                ),
                            variant: "contained",
                            disabled: loading,
                        },
                    ],
                    message: {
                        variant: "warning",
                        text: "Payment could not be completed. Ask the brand to retry payment so the contract can proceed.",
                    },
                };
            case ContractStatus.ShipmentPending:
                return {
                    buttons: [
                        {
                            label: "Go to Messages",
                            onPress: openMessages,
                            variant: "outlined",
                            disabled: loading,
                        },
                        {
                            label: "Request for shipment",
                            onPress: requestShipmentWithDebounce,
                            variant: "contained",
                            disabled: loading,
                        },
                    ],
                    message: {
                        variant: "info",
                        text: "Congratulations! Your contract is funded. The brand would now be shipping the product to you",
                    },
                };
            case ContractStatus.DeliveryPending:
                if (!isProductCollaboration) {
                    return {
                        buttons: [
                            {
                                label: "Go to Messages",
                                onPress: openMessages,
                                variant: "contained",
                                disabled: loading,
                            },
                        ],
                        message: {
                            variant: "info",
                            text: "Contract is active. Please wait for the next step from the brand.",
                        },
                    };
                }
                return {
                    buttons: [
                        {
                            label: "View Shipping Details",
                            onPress: () => Toaster.info(getShippingDetailsMessage()),
                            variant: "outlined",
                            disabled: loading,
                        },
                        {
                            label: "Go to Messages",
                            onPress: openMessages,
                            variant: "contained",
                            disabled: loading,
                        },
                    ],
                    message: {
                        variant: "info",
                        text: "Your shipment is on the way. View tracking details above; you can confirm receipt once the product arrives.",
                    },
                };
            case ContractStatus.DeliveryAcknowledgementPending:
                if (!isProductCollaboration) {
                    return {
                        buttons: [
                            {
                                label: "Go to Messages",
                                onPress: openMessages,
                                variant: "contained",
                                disabled: loading,
                            },
                        ],
                        message: {
                            variant: "info",
                            text: "Contract is active. Please wait for the next operational step.",
                        },
                    };
                }
                return {
                    buttons: [
                        {
                            label: "View Shipping Details",
                            onPress: () => Toaster.info(getShippingDetailsMessage()),
                            variant: "outlined",
                            disabled: loading,
                        },
                        {
                            label: "Product Received",
                            onPress: () => productReceivedModal.open(),
                            variant: "contained",
                            disabled: loading,
                        },
                    ],
                    message: {
                        variant: "info",
                        text: "Congratulations! Shipping has been done. Please mark above once you receive the product",
                    },
                };
            case ContractStatus.VideoPending:
                return {
                    buttons: [
                        {
                            label: "Go to Message",
                            onPress: openMessages,
                            variant: "outlined",
                            disabled: loading,
                        },
                        {
                            label: "Submit the Video",
                            onPress: () => submitVideoModal.open(),
                            variant: "contained",
                            disabled: loading,
                        },
                    ],
                    message: {
                        variant: "warning",
                        text: "Contract is in progress! Please deliver the video at your earliest given time",
                    },
                };
            case ContractStatus.ReviewPending:
                return {
                    buttons: [
                        {
                            label: "Go to Message",
                            onPress: openMessages,
                            variant: "outlined",
                            disabled: loading,
                        },
                        {
                            label: hasRevisionRequest ? "Submit the Video" : "Request for approval",
                            onPress:
                                hasRevisionRequest
                                    ? () => submitVideoModal.open()
                                    : () => void requestApprovalWithDebounce(),
                            variant: "contained",
                            disabled: loading,
                        },
                    ],
                    message: {
                        variant: "info",
                        text: hasRevisionRequest
                            ? "The brand requested changes in your video. Please update and submit the video again."
                            : "The brand is reviewing your video. Please wait before they approve it. You can request for approval to again notify the brand",
                    },
                };
            case ContractStatus.PostingPending:
                return {
                    buttons: [
                        {
                            label: "Ask for Reschedule",
                            onPress: () => requestRescheduleModal.open(),
                            variant: "outlined",
                            disabled: loading,
                        },
                        {
                            label: "Mark Video as Posted",
                            onPress: () => markVideoPostedModal.open(),
                            variant: "contained",
                            disabled: loading,
                        },
                    ],
                    message: {
                        variant: "info",
                        text: scheduledReleaseAt
                            ? getPostScheduledMessage()
                            : "Release may still be planned by the brand. Mark the video as posted when it is live, or ask for a reschedule.",
                    },
                };
            case ContractStatus.SettlementPending:
                return {
                    buttons: [
                        {
                            label: "Give Feedback",
                            onPress: feedbackModalVisible,
                            variant: "contained",
                            disabled: loading,
                        },
                    ],
                    message: {
                        variant: "success",
                        text: "Video is posted. Please complete your feedback to close the collaboration loop.",
                    },
                };
            case ContractStatus.Settled:
            default:
                return {
                    buttons: [],
                    message: {
                        variant: "success",
                        text: "Settlement completed. This contract is now read-only.",
                    },
                };
        }
    }, [
        isKycBlocked,
        isProductCollaboration,
        normalizedStatus,
        scheduledReleaseAt,
        loading,
        contract.streamChannelId,
        contract.status,
        contract.deliverable?.revisionCount,
        contract.deliverable?.revisionNotes?.length,
        contract.posting?.scheduledDate,
        contract.shipment?.expectedDate,
        contract.shipment?.shipmentProvider,
        contract.shipment?.trackingId,
        feedbackModalVisible,
        router,
        showQuotationModal,
        runWithRefresh,
        requestShipmentWithDebounce,
        requestApprovalWithDebounce,
        openMessages,
        productReceivedModal.open,
        submitVideoModal.open,
        markVideoPostedModal.open,
        requestRescheduleModal.open,
    ]);

    return (
        <View style={styles.container}>
            <ContractActionsWithMessage
                buttons={actionsConfig.buttons as any}
                message={actionsConfig.message}
            />
            {loading ? (
                <View style={styles.loadingRow}>
                    <ActivityIndicator size="small" />
                    <Text style={styles.loadingText}>Processing action...</Text>
                </View>
            ) : null}
            <ProductReceivedModal {...productReceivedModal.productReceivedModalProps} loading={loading} />
            <SubmitVideoModal {...submitVideoModal.submitVideoModalProps} loading={loading} />
            <MarkVideoPostedModal {...markVideoPostedModal.markVideoPostedModalProps} loading={loading} />
            <RequestRescheduleModal {...requestRescheduleModal.requestRescheduleModalProps} loading={loading} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        backgroundColor: "transparent",
        gap: 12,
    },
    loadingRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    loadingText: {
        fontSize: 13,
    },
});

export default ActionContainer;
