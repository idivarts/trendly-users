import { useChatContext } from "@/contexts";
import { IContracts } from "@/shared-libs/firestore/trendly-pro/models/contracts";
import { IManagers } from "@/shared-libs/firestore/trendly-pro/models/managers";
import { IUsers } from "@/shared-libs/firestore/trendly-pro/models/users";
import { Console } from "@/shared-libs/utils/console";
import { FirestoreDB } from "@/shared-libs/utils/firebase/firestore";
import { HttpWrapper } from "@/shared-libs/utils/http-wrapper";
import { useMyNavigation } from "@/shared-libs/utils/router";
import ImageComponent from "@/shared-uis/components/image-component";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import Colors from "@/shared-uis/constants/Colors";
import {
    faCheckCircle,
    faCircleInfo,
    faClock,
    faStar,
    faStarHalfStroke,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useTheme } from "@react-navigation/native";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { FC, useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet } from "react-native";
import { Portal } from "react-native-paper";
import { Text, View } from "../theme/Themed";
import Button from "../ui/button";
import ConfirmDeliveryModal from "./ConfirmDeliveryModal";
import ShippingAddressModal from "./ShippingAddressModal";
import VideoDownloadCard from "./VideoDownloadCard";
import VideoUploadModal from "./VideoUploadModal";

interface ActionContainerProps {
    contract: IContracts;
    refreshData: () => void;
    feedbackModalVisible: () => void;
    showQuotationModal: () => void;
    userData: IUsers;
}

const ActionContainer: FC<ActionContainerProps> = ({
    contract,
    refreshData,
    showQuotationModal,
    feedbackModalVisible,
    userData,
}) => {
    const theme = useTheme();
    const [manager, setManager] = useState<IManagers>();
    const { fetchChannelCid } = useChatContext();
    const router = useMyNavigation();

    // Modal states
    const [showShippingAddressModal, setShowShippingAddressModal] = useState(false);
    const [showConfirmDeliveryModal, setShowConfirmDeliveryModal] = useState(false);
    const [showVideoUploadModal, setShowVideoUploadModal] = useState(false);
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [isReupload, setIsReupload] = useState(false);

    const renderStars = (rating: number) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        return (
            <>
                {Array.from({ length: fullStars }, (_, i) => (
                    <FontAwesomeIcon
                        key={i}
                        icon={faStar}
                        size={16}
                        color={Colors(theme).yellow}
                    />
                ))}
                {hasHalfStar && (
                    <FontAwesomeIcon
                        icon={faStarHalfStroke}
                        size={16}
                        color={Colors(theme).yellow}
                    />
                )}
            </>
        );
    };

    const fetchManager = async () => {
        if (!contract.feedbackFromBrand?.managerId) return;
        const managerRef = doc(
            FirestoreDB,
            "managers",
            contract.feedbackFromBrand?.managerId
        );
        const manager = await getDoc(managerRef);
        setManager(manager.data() as IManagers);
    };

    useEffect(() => {
        fetchManager();
    }, [contract.feedbackFromBrand?.managerId]);

    const goToMessages = async () => {
        const channelCid = await fetchChannelCid(contract.streamChannelId);
        router.push(`/channel/${channelCid}`);
    };

    const goToVerification = () => {
        router.push("/verification");
    };

    const resetContractForTesting = async (targetStatus: number) => {
        console.log("\n=== RESET CONTRACT FOR TESTING ===");
        console.log("Resetting from Status:", contract.status, "to Status:", targetStatus);
        try {
            const contractRef = doc(FirestoreDB, "contracts", contract.streamChannelId);
            await updateDoc(contractRef, { status: targetStatus });
            console.log("✅ Status updated to:", targetStatus);
            refreshData();
        } catch (error) {
            console.error("❌ Failed to reset status:", error);
        }
    };

    const formatReleaseDate = (timestamp: number): string => {
        const releaseDate = new Date(timestamp);
        return releaseDate.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    // Status configuration map
    const statusConfig: Record<number, any> = {
        0: {
            title: "Awaiting Contract Funding",
            message: "The brand is reviewing and funding the contract. You'll be notified once they proceed.",
            messageType: "warning",
            buttons: [
                {
                    label: "Ask to Start Contract",
                    mode: "outlined",
                    onPress: () => {
                        try {
                            Toaster.success("Successfully informed brand to start the collaboration");
                            HttpWrapper.fetch(`/api/collabs/contracts/${contract.streamChannelId}`, {
                                method: "POST",
                            }).catch(() => {
                                Toaster.error("Something went wrong!!");
                            });
                        } catch (e: any) {
                            Console.error(e);
                        }
                    },
                },
                {
                    label: "Revise Quotation",
                    mode: "contained",
                    onPress: showQuotationModal,
                },
            ],
        },
        1: {
            title: "Contract Funded - Awaiting Start",
            message: "The contract has been funded by the brand. Waiting for them to start the collaboration.",
            messageType: "success",
            buttons: [
                {
                    label: "Ask to End Contract",
                    mode: "contained-tonal",
                    onPress: () => {
                        try {
                            Toaster.success("Successfully informed brand to end the collaboration");
                            HttpWrapper.fetch(`/api/collabs/contracts/${contract.streamChannelId}/end`, {
                                method: "POST",
                            }).catch(() => {
                                Toaster.error("Something went wrong");
                            });
                        } catch (e: any) {
                            Console.log(e);
                        }
                    },
                },
                {
                    label: "Go to Messages",
                    mode: "contained",
                    onPress: goToMessages,
                },
            ],
        },
        2: {
            title: "Contract Active",
            message: "Your collaboration is active. Check messages for next steps from the brand.",
            messageType: "info",
            buttons: [
                {
                    label: "Give Feedback",
                    mode: "contained",
                    onPress: feedbackModalVisible,
                },
            ],
        },
        3: {
            title: "Payment Issue",
            message: "We've encountered an issue processing the payment for this contract. The brand has been notified and is working to resolve this. You'll be notified once the payment is processed successfully.",
            messageType: "warning",
            buttons: [
                {
                    label: "Contact Brand",
                    mode: "contained",
                    onPress: goToMessages,
                },
            ],
        },
        4: {
            title: "Product Shipment Pending",
            message: "The brand is preparing to ship the product. Make sure your shipping address is up to date.",
            messageType: "warning",
            warningAboveButtons: false,
            buttons: [
                {
                    label: "Update Shipping Address",
                    mode: "outlined",
                    onPress: () => setShowShippingAddressModal(true),
                },
                {
                    label: "Go to Messages",
                    mode: "contained",
                    onPress: goToMessages,
                },
            ],
        },
        5: {
            title: "Product in Transit",
            message: "The product has been shipped to your address. Please confirm once you receive it.",
            messageType: "warning",
            warningAboveButtons: false,
            buttons: [
                {
                    label: "Go to Messages",
                    mode: "outlined",
                    onPress: goToMessages,
                },
                {
                    label: "Confirm Delivery",
                    mode: "contained",
                    onPress: () => setShowConfirmDeliveryModal(true),
                },
            ],
        },
        6: {
            title: "Ready for Content Creation",
            message: "You can now start creating the content. Upload your video once ready.",
            messageType: "success",
            buttons: [
                {
                    label: "Go to Messages",
                    mode: "outlined",
                    onPress: goToMessages,
                },
                {
                    label: "Upload Video",
                    mode: "contained",
                    onPress: () => {
                        setIsReupload(false);
                        setShowVideoUploadModal(true);
                    },
                },
            ],
        },
        7: {
            title: "Video Under Review",
            message: "Your video has been submitted. Waiting for the brand to review it.",
            messageType: "info",
            videoCardAboveButtons: false,
            buttons: [
                {
                    label: "Go to Messages",
                    mode: "outlined",
                    onPress: goToMessages,
                },
                {
                    label: "Request for Approval",
                    mode: "contained",
                    onPress: async () => {
                        try {
                            const channelCid = await fetchChannelCid(contract.streamChannelId);
                            const { streamClient } = await import("@/contexts/streamClient");
                            const channel = streamClient.channel("messaging", contract.streamChannelId);
                            await channel.watch();

                            await channel.sendMessage({
                                text: "Hi! I've submitted the video for review. Could you please check it and let me know if any changes are needed? Looking forward to your feedback!",
                            });

                            Toaster.success("Approval request sent to brand");
                            goToMessages();
                        } catch (error) {
                            Console.error("Error sending message:", String(error));
                            Toaster.error("Failed to send message");
                        }
                    },
                },
            ],
        },
        8: {
            title: "Revision Requested",
            message: "The brand has requested some changes to your video. Please review their feedback below.",
            messageType: "warning",
            warningAboveButtons: false,
            showRevisionDetails: true,
            videoCardAboveButtons: false,
            buttons: [
                {
                    label: "Go to Messages",
                    mode: "outlined",
                    onPress: goToMessages,
                },
                {
                    label: "Upload Revised Video",
                    mode: "contained",
                    onPress: () => {
                        setIsReupload(true);
                        setShowVideoUploadModal(true);
                    },
                },
            ],
        },
        9: {
            title: "Release Scheduled",
            message: contract.releaseScheduledFor
                ? `Your video is scheduled for release on ${formatReleaseDate(contract.releaseScheduledFor)}. Get ready!`
                : "Your video release has been scheduled.",
            messageType: "success",
            warningAboveButtons: false,
            videoCardAboveButtons: false,
            buttons: [
                {
                    label: "Go to Messages",
                    mode: "outlined",
                    onPress: goToMessages,
                },
                {
                    label: "View Schedule",
                    mode: "contained",
                    onPress: () => setShowScheduleModal(true),
                },
            ],
        },
        10: {
            title: "Release Pending",
            message: "Great work! The brand is now planning the release strategy and will schedule the video release soon.",
            messageType: "info",
            buttons: [
                {
                    label: "Go to Messages",
                    mode: "outlined",
                    onPress: goToMessages,
                },
                {
                    label: "View Schedule",
                    mode: "contained",
                    onPress: () => setShowScheduleModal(true),
                },
            ],
        },
        11: {
            title: "Ready to Post",
            message: "Please post your video on the scheduled date and mark it as posted once done.",
            messageType: "warning",
            buttons: [
                {
                    label: "Go to Messages",
                    mode: "outlined",
                    onPress: goToMessages,
                },
                {
                    label: "Mark Video as Posted",
                    mode: "contained",
                    onPress: async () => {
                        try {
                            const contractRef = doc(FirestoreDB, "contracts", contract.streamChannelId);
                            await updateDoc(contractRef, {
                                status: 12,
                                videoPostedAt: Date.now(),
                            });
                            Toaster.success("Video marked as posted successfully");
                            refreshData();
                        } catch (error) {
                            Console.error("Error marking video as posted:", String(error));
                            Toaster.error("Failed to mark video as posted");
                        }
                    },
                },
            ],
        },
        12: {
            title: "Collaboration Complete",
            message: "This collaboration is complete. We hope you had a great experience!",
            messageType: "info",
            buttons: [
                {
                    label: "Give Feedback",
                    mode: "contained",
                    onPress: feedbackModalVisible,
                },
                {
                    label: "Go to Messages",
                    mode: "outlined",
                    onPress: goToMessages,
                },
            ],
        },
    };

    const currentStatus = statusConfig[contract.status] || statusConfig[0];
    const isKYCIncomplete = userData?.isKYCDone === false;
    const kycWarningMessage = {
        title: "KYC Incomplete",
        message: "You can't start the contract until your profile is verified.",
        messageType: "warning",
    };
    const effectiveButtons = isKYCIncomplete
        ? [
            {
                label: "KYC Incomplete",
                mode: "contained",
                onPress: goToVerification,
            },
        ]
        : currentStatus.buttons || [];

    const renderMessageBox = (config: any) => {
        const getMessageBoxStyle = () => {
            switch (config.messageType) {
                case "warning":
                    return {
                        backgroundColor: Colors(theme).gold || "#FFC107",
                        color: "#000",
                        icon: faClock,
                    };
                case "success":
                    return {
                        backgroundColor: "#C8E6C9",
                        color: "#1B5E20",
                        icon: faCheckCircle,
                    };
                default:
                    return {
                        backgroundColor: Colors(theme).gray200,
                        color: Colors(theme).text,
                        icon: faCircleInfo,
                    };
            }
        };

        const style = getMessageBoxStyle();

        return (
            <View
                style={{
                    backgroundColor: style.backgroundColor,
                    padding: 16,
                    borderRadius: 5,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                }}
            >
                <FontAwesomeIcon icon={style.icon} size={20} color={style.color} />
                <View style={{ flex: 1, backgroundColor: "transparent" }}>
                    <Text style={{ fontSize: 16, fontWeight: "bold", color: style.color }}>
                        {config.title}
                    </Text>
                    <Text style={{ fontSize: 14, marginTop: 4, color: style.color }}>
                        {config.message}
                    </Text>
                </View>
            </View>
        );
    };

    const renderRevisionDetails = () => {
        if (!contract.revisionRequest) return null;

        return (
            <View
                style={{
                    backgroundColor: Colors(theme).gray200,
                    borderWidth: 1,
                    borderColor: Colors(theme).gray300,
                    borderRadius: 16,
                    padding: 16,
                }}
            >
                <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 8 }}>
                    Revision Feedback
                </Text>
                <Text style={{ fontSize: 14, lineHeight: 20 }}>
                    {contract.revisionRequest.reason}
                </Text>
            </View>
        );
    };

    const renderButtons = (buttons: any[]) => {
        if (buttons.length === 0) return null;

        return (
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    gap: 16,
                    backgroundColor: "transparent",
                }}
            >
                {buttons.map((button, index) => (
                    <Button
                        key={index}
                        mode={button.mode}
                        style={{ flex: 1 }}
                        onPress={button.onPress}
                    >
                        {button.label}
                    </Button>
                ))}
            </View>
        );
    };

    return (
        <View
            style={{
                width: "100%",
                flex: 1,
                flexDirection: "column",
                gap: 16,
                backgroundColor: "transparent",
            }}
        >
            {/* Status 3 - Payment Issue */}
            {contract.status === 3 && (
                <>
                    {isKYCIncomplete && renderMessageBox(kycWarningMessage)}
                    {renderMessageBox(currentStatus)}
                    <View style={{ marginTop: 16 }}>
                        {renderButtons(effectiveButtons)}
                    </View>
                    {contract.feedbackFromBrand && (
                        <View
                            style={{
                                width: "100%",
                                borderWidth: 0.3,
                                padding: 10,
                                borderRadius: 10,
                                gap: 10,
                                borderColor: Colors(theme).gray300,
                            }}
                        >
                            <View style={{ flexDirection: "row" }}>
                                {renderStars(contract.feedbackFromBrand.ratings || 0)}
                            </View>
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 8,
                                    flexGrow: 1,
                                }}
                            >
                                <ImageComponent
                                    url={manager?.profileImage || ""}
                                    shape="circle"
                                    altText="Manager Image"
                                    initials={manager?.name}
                                    style={{ width: 40, height: 40, borderRadius: 20 }}
                                />
                                <View style={{ flex: 1 }}>
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            fontWeight: "bold",
                                            color: Colors(theme).text,
                                        }}
                                    >
                                        From Brand ({manager?.name})
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            flexWrap: "wrap",
                                            overflow: "hidden",
                                            lineHeight: 22,
                                            color: Colors(theme).text,
                                        }}
                                    >
                                        {contract.feedbackFromBrand.feedbackReview}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    )}
                    {contract.feedbackFromInfluencer && (
                        <View
                            style={{
                                borderWidth: 0.3,
                                padding: 10,
                                borderRadius: 10,
                                gap: 10,
                                borderColor: Colors(theme).gray300,
                            }}
                        >
                            <View style={{ flexDirection: "row" }}>
                                {renderStars(contract.feedbackFromInfluencer.ratings || 0)}
                            </View>
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 8,
                                    flexGrow: 1,
                                }}
                            >
                                <ImageComponent
                                    url={userData.profileImage || ""}
                                    shape="circle"
                                    altText="User Image"
                                    initials={userData.name}
                                    style={{ width: 40, height: 40, borderRadius: 20 }}
                                />
                                <View style={{ flex: 1 }}>
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            fontWeight: "bold",
                                            color: Colors(theme).text,
                                        }}
                                    >
                                        From Influencer ({userData.name})
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            flexWrap: "wrap",
                                            overflow: "hidden",
                                            lineHeight: 22,
                                            color: Colors(theme).text,
                                        }}
                                    >
                                        {contract.feedbackFromInfluencer?.feedbackReview}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    )}
                </>
            )}

            {/* DEBUG: Testing Controls (DEV ONLY) */}
            {__DEV__ && (
                <View
                    style={{
                        backgroundColor: "#FFF3CD",
                        padding: 12,
                        borderRadius: 8,
                        borderWidth: 2,
                        borderColor: "#FF9800",
                        marginBottom: 16,
                    }}
                >
                    <Text style={{ fontWeight: "bold", marginBottom: 8, color: "#000" }}>
                        🧪 TEST CONTROLS (Dev Only)
                    </Text>
                    <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((status) => (
                            <Button
                                key={status}
                                mode="outlined"
                                compact
                                onPress={() => resetContractForTesting(status)}
                                style={{
                                    borderColor: contract.status === status ? "#4CAF50" : "#FF9800",
                                    backgroundColor: contract.status === status ? "#E8F5E9" : "transparent",
                                }}
                            >
                                S{status}
                            </Button>
                        ))}
                    </View>
                    <Text style={{ fontSize: 12, marginTop: 4, color: "#666" }}>
                        Current: Status {contract.status}
                    </Text>
                </View>
            )}

            {/* Main status display for all other statuses */}
            {contract.status !== 3 && (
                <>
                    {isKYCIncomplete && renderMessageBox(kycWarningMessage)}
                    {/* Buttons first (if warningAboveButtons is false or not set) */}
                    {!currentStatus.warningAboveButtons && renderButtons(effectiveButtons)}

                    {/* Warning/Info message box */}
                    {!currentStatus.warningAboveButtons && renderMessageBox(currentStatus)}

                    {/* Buttons first (if warningAboveButtons is true) */}
                    {currentStatus.warningAboveButtons && renderButtons(effectiveButtons)}

                    {/* Warning/Info message box */}
                    {currentStatus.warningAboveButtons && renderMessageBox(currentStatus)}

                    {/* Revision details (Status 8) */}
                    {currentStatus.showRevisionDetails && renderRevisionDetails()}

                    {/* Video card (Status 7, 8, 9, 11) */}
                    {(contract.status === 7 || contract.status === 8 || contract.status === 9 || contract.status === 11) &&
                        contract.videoUrl && (
                            <VideoDownloadCard videoUrl={contract.videoUrl} />
                        )}
                </>
            )}

            {/* Modals */}
            <ShippingAddressModal
                visible={showShippingAddressModal}
                setVisibility={setShowShippingAddressModal}
                refreshData={refreshData}
                currentAddress={userData.shippingAddress}
            />

            <ConfirmDeliveryModal
                visible={showConfirmDeliveryModal}
                setVisibility={setShowConfirmDeliveryModal}
                contract={contract}
                refreshData={refreshData}
            />

            <VideoUploadModal
                visible={showVideoUploadModal}
                setVisibility={setShowVideoUploadModal}
                contract={contract}
                refreshData={refreshData}
                isReupload={isReupload}
            />

            {/* Release Schedule Modal */}
            <Portal>
                <Modal
                    visible={showScheduleModal}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setShowScheduleModal(false)}
                >
                    <Pressable
                        style={styles.overlay}
                        onPress={() => setShowScheduleModal(false)}
                    >
                        <Pressable
                            style={[styles.modalContent, { backgroundColor: Colors(theme).card }]}
                            onPress={(e) => e.stopPropagation()}
                        >
                            <Text style={styles.modalTitle}>Release Schedule</Text>

                            <View style={styles.dateContainer}>
                                <Text style={styles.dateLabel}>Scheduled Release Date</Text>
                                <Text style={styles.dateValue}>
                                    {contract.releaseScheduledFor
                                        ? formatReleaseDate(contract.releaseScheduledFor)
                                        : "To be announced"}
                                </Text>
                            </View>

                            <Text style={styles.smallText}>
                                Please ensure your video is posted on this date to maintain collaboration schedule
                            </Text>

                            <Button
                                mode="contained"
                                onPress={() => setShowScheduleModal(false)}
                                style={styles.closeButton}
                            >
                                Close
                            </Button>
                        </Pressable>
                    </Pressable>
                </Modal>
            </Portal>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        borderRadius: 12,
        padding: 24,
        width: "85%",
        maxWidth: 350,
        gap: 16,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "600",
        marginBottom: 8,
    },
    dateContainer: {
        gap: 8,
        paddingVertical: 12,
    },
    dateLabel: {
        fontSize: 12,
        fontWeight: "500",
        opacity: 0.6,
    },
    dateValue: {
        fontSize: 18,
        fontWeight: "600",
    },
    smallText: {
        fontSize: 12,
        opacity: 0.7,
        lineHeight: 16,
    },
    closeButton: {
        marginTop: 8,
    },
});

export default ActionContainer;
