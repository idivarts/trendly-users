import { useChatContext } from "@/contexts";
import { ContractStatus, normalizeStatus } from "@/shared-constants/contract-status";
import { useAWSContext } from "@/shared-libs/contexts/aws-context.provider";
import type { ICollaboration } from "@/shared-libs/firestore/trendly-pro/models/collaborations";
import type { IContracts } from "@/shared-libs/firestore/trendly-pro/models/contracts";
import type { IUsers } from "@/shared-libs/firestore/trendly-pro/models/users";
import type { AssetItem } from "@/shared-libs/types/Asset";
import { useMyNavigation } from "@/shared-libs/utils/router";
import * as ImagePicker from "expo-image-picker";
import {
    ContractActionsWithMessage,
    type ContractActionButton,
    type ContractActionsMessage,
} from "@/shared-uis/components/contract-actions-with-message";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import { useEffect, useMemo, useRef, useState, type FC } from "react";
import { ActivityIndicator, Platform, StyleSheet, View } from "react-native";
import { Text } from "../theme/Themed";
import {
    state0AskToStartContract,
    state2AskRetryPayment,
    state3NudgeForShipment,
} from "./api/State_3_api";
import { state4MarkProductReceived } from "./api/State_4_api";
import { state5SubmitDeliverable } from "./api/State_5_api";
import { state6MarkVideoReuploaded, state6RequestApproval } from "./api/State_6_api";
import { state8RequestReschedule, state8SubmitPosting } from "./api/State_8_api";
import MarkVideoPostedModal from "./MarkVideoPostedModal";
import ProductReceivedModal from "./ProductReceivedModal";
import RequestRescheduleModal from "./RequestRescheduleModal";
import SubmitVideoModal from "./SubmitVideoModal";

interface ActionContainerProps {
    contract: IContracts;
    refreshData: () => void | Promise<void>;
    feedbackModalVisible: () => void;
    showQuotationModal: () => void;
    userData: IUsers;
    collaborationData: ICollaboration;
}

const toParityState = (rawStatus: number): number => {
    const normalized = normalizeStatus(rawStatus);
    if (normalized >= 0 && normalized <= 10) return normalized;
    return 0;
};

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
    const [showProductReceivedModal, setShowProductReceivedModal] = useState(false);
    const [showSubmitVideoModal, setShowSubmitVideoModal] = useState(false);
    const [showMarkPostedModal, setShowMarkPostedModal] = useState(false);
    const [showRescheduleModal, setShowRescheduleModal] = useState(false);
    const [receivedImageUri, setReceivedImageUri] = useState("");
    const [receivedNote, setReceivedNote] = useState("");
    const [receivedConfirmed, setReceivedConfirmed] = useState(false);
    const [submitVideoNote, setSubmitVideoNote] = useState("");
    const [selectedVideoName, setSelectedVideoName] = useState("");
    const [selectedVideoUri, setSelectedVideoUri] = useState("");
    const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
    const [postedVideoLink, setPostedVideoLink] = useState("");
    // Uploaded URL (sent to backend)
    const [postedProofScreenshot, setPostedProofScreenshot] = useState("");
    // Local preview (native uri / web object url)
    const [postedProofScreenshotPreviewUri, setPostedProofScreenshotPreviewUri] = useState("");
    const [postedProofScreenshotName, setPostedProofScreenshotName] = useState("");
    const [postedNotes, setPostedNotes] = useState("");
    const [rescheduleNote, setRescheduleNote] = useState("");
    const shipmentDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const shipmentInFlightRef = useRef(false);
    const approvalDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const approvalInFlightRef = useRef(false);
    const postingDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const postingInFlightRef = useRef(false);
    const rescheduleDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const rescheduleInFlightRef = useRef(false);

    const normalizedStatus = normalizeStatus(contract.status);
    const parityState = toParityState(contract.status);
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

    const pickReceivedProductImage = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permission.status !== "granted") {
            Toaster.error("Please allow media permissions to upload image.");
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.8,
            allowsEditing: true,
        });
        if (!result.canceled && result.assets[0]?.uri) {
            setReceivedImageUri(result.assets[0].uri);
        }
    };

    const pickSubmitVideo = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permission.status !== "granted") {
            Toaster.error("Please allow media permissions to upload video.");
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            quality: 1,
            allowsEditing: false,
        });
        if (!result.canceled && result.assets[0]) {
            const pickedName = result.assets[0].fileName || "Video selected";
            setSelectedVideoName(pickedName);
            setSelectedVideoUri(result.assets[0].uri || "");
        }
    };

    const closeProductReceivedModal = () => {
        setShowProductReceivedModal(false);
        setReceivedImageUri("");
        setReceivedNote("");
        setReceivedConfirmed(false);
    };

    const closeSubmitVideoModal = () => {
        setShowSubmitVideoModal(false);
        setSubmitVideoNote("");
        setSelectedVideoName("");
        setSelectedVideoUri("");
        setSelectedVideoFile(null);
    };

    const closeMarkPostedModal = () => {
        setShowMarkPostedModal(false);
        setPostedVideoLink("");
        setPostedProofScreenshot("");
        setPostedProofScreenshotPreviewUri("");
        setPostedProofScreenshotName("");
        setPostedNotes("");
    };

    const closeRescheduleModal = () => {
        setShowRescheduleModal(false);
        setRescheduleNote("");
    };

    const handleProductReceivedSubmit = () =>
        runWithRefresh(
            async () => {
                if (!receivedImageUri) {
                    throw new Error("Please attach a product image before confirming.");
                }
                if (!receivedConfirmed) {
                    throw new Error("Please confirm that the product is received.");
                }
                const uploadedImage = await uploadFileUri({
                    id: receivedImageUri,
                    localUri: receivedImageUri,
                    uri: receivedImageUri,
                    type: "image",
                } as AssetItem);
                const photoUrl = uploadedImage.imageUrl;
                if (!photoUrl) {
                    throw new Error("Image upload failed. Please try again.");
                }
                await state4MarkProductReceived({
                    contractId: contract.streamChannelId,
                    photoUrl,
                    notes: receivedNote.trim() || undefined,
                });
                closeProductReceivedModal();
            },
            "Marked as product received."
        );

    const handleSubmitVideoModalSubmit = () =>
        runWithRefresh(
            async () => {
                const isWeb = Platform.OS === "web";
                if (isWeb) {
                    if (!selectedVideoFile) {
                        throw new Error("Please select a video before submitting.");
                    }
                } else {
                    if (!selectedVideoUri) {
                        throw new Error("Please select a video before submitting.");
                    }
                }

                const uploadedVideo = isWeb
                    ? await uploadFile(selectedVideoFile as File)
                    : await uploadFileUri({
                          id: selectedVideoUri,
                          localUri: selectedVideoUri,
                          uri: selectedVideoUri,
                          type: "video",
                      } as AssetItem);
                const videoUrl = uploadedVideo.playUrl || uploadedVideo.appleUrl;
                if (!videoUrl) {
                    throw new Error("Video upload failed. Please try again.");
                }
                await state5SubmitDeliverable({
                    contractId: contract.streamChannelId,
                    videoUrl,
                    note: submitVideoNote.trim() || undefined,
                });
                closeSubmitVideoModal();
            },
            "Video submitted for review."
        );

    const handleMarkPostedSubmit = () =>
        runWithRefresh(
            async () => {
                if (!postedVideoLink.trim()) throw new Error("Please add the posted video link.");
                if (!postedProofScreenshot.trim()) throw new Error("Please add the proof screenshot.");
                await state8SubmitPosting({
                    contractId: contract.streamChannelId,
                    proofScreenshot: postedProofScreenshot.trim(),
                    postUrl: postedVideoLink.trim(),
                    notes: postedNotes.trim() || undefined,
                });
                closeMarkPostedModal();
            },
            "Marked as posted."
        );

    const pickProofScreenshotImage = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permission.status !== "granted") {
            Toaster.error("Please allow media permissions to upload image.");
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.85,
            allowsEditing: false,
        });
        if (!result.canceled && result.assets[0]?.uri) {
            const localUri = result.assets[0].uri;
            setPostedProofScreenshotPreviewUri(localUri);
            setPostedProofScreenshotName(result.assets[0].fileName || "Screenshot selected");
            setLoading(true);
            try {
                const uploadedImage = await uploadFileUri({
                    id: localUri,
                    localUri,
                    uri: localUri,
                    type: "image",
                } as AssetItem);
                const imageUrl = uploadedImage.imageUrl;
                if (!imageUrl) {
                    throw new Error("Image upload failed. Please try again.");
                }
                setPostedProofScreenshot(imageUrl);
            } catch (error: any) {
                setPostedProofScreenshot("");
                setPostedProofScreenshotPreviewUri("");
                setPostedProofScreenshotName("");
                Toaster.error(error?.message || "Failed to upload proof screenshot.");
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        return () => {
            if (postedProofScreenshotPreviewUri && postedProofScreenshotPreviewUri.startsWith("blob:")) {
                URL.revokeObjectURL(postedProofScreenshotPreviewUri);
            }
        };
    }, [postedProofScreenshotPreviewUri]);

    useEffect(() => {
        return () => {
            if (shipmentDebounceRef.current) {
                clearTimeout(shipmentDebounceRef.current);
            }
            if (approvalDebounceRef.current) {
                clearTimeout(approvalDebounceRef.current);
            }
            if (postingDebounceRef.current) {
                clearTimeout(postingDebounceRef.current);
            }
            if (rescheduleDebounceRef.current) {
                clearTimeout(rescheduleDebounceRef.current);
            }
        };
    }, []);

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

    const submitPostingWithDebounce = async () => {
        if (postingInFlightRef.current || postingDebounceRef.current) return;
        postingInFlightRef.current = true;
        postingDebounceRef.current = setTimeout(() => {
            postingDebounceRef.current = null;
        }, 1500);
        try {
            await handleMarkPostedSubmit();
        } finally {
            postingInFlightRef.current = false;
        }
    };

    const requestRescheduleWithDebounce = async () => {
        if (rescheduleInFlightRef.current || rescheduleDebounceRef.current) return;
        rescheduleInFlightRef.current = true;
        rescheduleDebounceRef.current = setTimeout(() => {
            rescheduleDebounceRef.current = null;
        }, 1500);
        try {
            await runWithRefresh(
                async () => {
                    const trimmed = rescheduleNote.trim();
                    if (!trimmed) throw new Error("Please add a reason for reschedule.");
                    await state8RequestReschedule({
                        contractId: contract.streamChannelId,
                        note: trimmed,
                    });
                    closeRescheduleModal();
                },
                "Reschedule request sent."
            );
        } finally {
            rescheduleInFlightRef.current = false;
        }
    };

    const openMessages = async () => {
        const channelCid = await fetchChannelCid(contract.streamChannelId);
        router.push(`/channel/${channelCid}`);
    };

    const runWithRefresh = async (fn: () => Promise<void>, success: string) => {
        setLoading(true);
        try {
            await fn();
            await refreshData();
            Toaster.success(success);
        } catch (error: any) {
            Toaster.error(error?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

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

        switch (parityState) {
            case 0:
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
            case 1:
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
            case 2:
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
            case 3:
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
            case 4:
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
                            onPress: () => setShowProductReceivedModal(true),
                            variant: "contained",
                            disabled: loading,
                        },
                    ],
                    message: {
                        variant: "info",
                        text: "Congratulations! Shipping has been done. Please mark above once you receive the product",
                    },
                };
            case 5:
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
                            onPress: () => setShowSubmitVideoModal(true),
                            variant: "contained",
                            disabled: loading,
                        },
                    ],
                    message: {
                        variant: "warning",
                        text: "Contract is in progress! Please deliver the video at your earliest given time",
                    },
                };
            case 6:
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
                                    ? () => setShowSubmitVideoModal(true)
                                    : () =>
                                          runWithRefresh(
                                              requestApprovalWithDebounce,
                                              "Approval request sent."
                                          ),
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
            case 7:
                return {
                    buttons: [],
                    message: {
                        variant: "info",
                        text: "Release is being planned by the brand. You will be updated once scheduled.",
                    },
                };
            case 8:
                return {
                    buttons: [
                        {
                            label: "Ask for Reschedule",
                            onPress: () => setShowRescheduleModal(true),
                            variant: "outlined",
                            disabled: loading,
                        },
                        {
                            label: "Mark Video as Posted",
                            onPress: () => setShowMarkPostedModal(true),
                            variant: "contained",
                            disabled: loading,
                        },
                    ],
                    message: {
                        variant: "info",
                        text: getPostScheduledMessage(),
                    },
                };
            case 9:
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
            case 10:
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
        parityState,
        normalizedStatus,
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
            <ProductReceivedModal
                visible={showProductReceivedModal}
                loading={loading}
                imageUri={receivedImageUri}
                note={receivedNote}
                isConfirmed={receivedConfirmed}
                onClose={closeProductReceivedModal}
                onPickImage={pickReceivedProductImage}
                onChangeNote={setReceivedNote}
                onToggleConfirm={() => setReceivedConfirmed((prev) => !prev)}
                onSubmit={handleProductReceivedSubmit}
            />
            <SubmitVideoModal
                visible={showSubmitVideoModal}
                loading={loading}
                selectedVideoName={selectedVideoName}
                note={submitVideoNote}
                onClose={closeSubmitVideoModal}
                onPickVideo={pickSubmitVideo}
                onPickVideoWeb={(file) => {
                    setSelectedVideoFile(file);
                    setSelectedVideoName(file.name || "Video selected");
                    setSelectedVideoUri("");
                }}
                onChangeNote={setSubmitVideoNote}
                onSubmit={handleSubmitVideoModalSubmit}
            />
            <MarkVideoPostedModal
                visible={showMarkPostedModal}
                loading={loading}
                proofScreenshot={postedProofScreenshot}
                proofScreenshotPreviewUri={postedProofScreenshotPreviewUri}
                proofScreenshotName={postedProofScreenshotName}
                postUrl={postedVideoLink}
                notes={postedNotes}
                onClose={closeMarkPostedModal}
                onPickProofScreenshot={pickProofScreenshotImage}
                onPickProofScreenshotWeb={async (file) => {
                    const objectUrl = URL.createObjectURL(file);
                    if (postedProofScreenshotPreviewUri.startsWith("blob:")) {
                        URL.revokeObjectURL(postedProofScreenshotPreviewUri);
                    }
                    setPostedProofScreenshotPreviewUri(objectUrl);
                    setPostedProofScreenshotName(file.name || "Screenshot selected");
                    setPostedProofScreenshot("");
                    setLoading(true);
                    try {
                        const uploadedImage = await uploadFile(file);
                        const imageUrl = uploadedImage.imageUrl;
                        if (!imageUrl) {
                            throw new Error("Image upload failed. Please try again.");
                        }
                        setPostedProofScreenshot(imageUrl);
                    } catch (error: any) {
                        setPostedProofScreenshot("");
                        setPostedProofScreenshotPreviewUri("");
                        setPostedProofScreenshotName("");
                        Toaster.error(error?.message || "Failed to upload proof screenshot.");
                    } finally {
                        setLoading(false);
                    }
                }}
                onChangePostUrl={setPostedVideoLink}
                onChangeNotes={setPostedNotes}
                onSubmit={submitPostingWithDebounce}
            />
            <RequestRescheduleModal
                visible={showRescheduleModal}
                loading={loading}
                note={rescheduleNote}
                onClose={closeRescheduleModal}
                onChangeNote={setRescheduleNote}
                onSubmit={requestRescheduleWithDebounce}
            />
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
