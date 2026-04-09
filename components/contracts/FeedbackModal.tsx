import { Text, View } from "@/components/theme/Themed";
import { ContractStatus, normalizeStatus } from "@/shared-constants/contract-status";
import { IContracts } from "@/shared-libs/firestore/trendly-pro/models/contracts";
import { Console } from "@/shared-libs/utils/console";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import Colors from "@/shared-uis/constants/Colors";
import { faClose, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useTheme } from "@react-navigation/native";
import React, { useMemo, useState } from "react";
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
} from "react-native";
import TextInput from "../ui/text-input";
import { state9SubmitUserFeedback } from "./api/SettlementPending_api";
import ContractActionOverlay from "./ContractActionOverlay";

interface FeedbackModalProps {
    star: number;
    feedbackGiven: boolean;
    visible: boolean;
    setVisibility: (visible: boolean) => void;
    contract: IContracts;
    refreshData: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({
    star,
    feedbackGiven,
    visible,
    setVisibility,
    contract,
    refreshData,
}) => {
    const theme = useTheme();
    const colors = Colors(theme);
    const styles = useMemo(() => createStyles(colors), [colors]);
    const [selectedStar, setSelectedStar] = useState(star);
    const [textFeedback, setTextFeedback] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleClose = () => setVisibility(false);

    const provideFeedback = async () => {
        if (submitting) return;
        try {
            const normalizedStatus = normalizeStatus(contract.status);
            if (normalizedStatus !== ContractStatus.SettlementPending) {
                Toaster.error("The contract has still not ended. You can't rate it yet.");
                return;
            }
            if (textFeedback === "" || selectedStar === 0) {
                Toaster.error("Please provide feedback and rating before submitting");
                return;
            }
            setSubmitting(true);
            await state9SubmitUserFeedback({
                contractId: contract.streamChannelId,
                ratings: selectedStar,
                feedbackReview: textFeedback,
            });

            setVisibility(false);
            await Promise.resolve(refreshData());
            Toaster.success("Feedback submitted.");
        } catch (e: unknown) {
            Console.error(e);
            const message = e instanceof Error ? e.message : "Failed to submit feedback.";
            Toaster.error(message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <ContractActionOverlay
            visible={visible}
            onClose={handleClose}
            mode="auto"
            snapPointsRange={["50%", "88%"]}
            modalMaxWidth={600}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardAvoidingView}
            >
                <Pressable style={styles.inner} onPress={() => Platform.OS !== "web" && Keyboard.dismiss()}>
                    <View style={styles.contentShell}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Feedback</Text>
                            <Pressable onPress={handleClose} accessibilityRole="button">
                                <FontAwesomeIcon icon={faClose} color={colors.primary} size={30} />
                            </Pressable>
                        </View>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalText}>
                                {feedbackGiven
                                    ? "Thank you for your feedback!"
                                    : "Please provide your feedback"}
                            </Text>
                            {star === 0 && (
                                <View style={styles.modalRating}>
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <Pressable key={i} onPress={() => setSelectedStar(i)}>
                                            <FontAwesomeIcon
                                                icon={faStar}
                                                color={i <= selectedStar ? colors.yellow : colors.text}
                                                size={30}
                                            />
                                        </Pressable>
                                    ))}
                                </View>
                            )}
                            {!feedbackGiven && (
                                <TextInput
                                    style={styles.textInput}
                                    autoFocus
                                    placeholder="Write your feedback here"
                                    value={textFeedback}
                                    onChangeText={setTextFeedback}
                                    numberOfLines={5}
                                    multiline
                                />
                            )}
                            {!feedbackGiven && (
                                <Pressable
                                    style={styles.primaryButton}
                                    onPress={() => {
                                        void provideFeedback();
                                    }}
                                    disabled={submitting}
                                >
                                    <Text style={styles.primaryButtonLabel}>
                                        {submitting ? "Submitting..." : "Submit Feedback"}
                                    </Text>
                                </Pressable>
                            )}
                            {feedbackGiven && (
                                <Pressable style={styles.primaryButton} onPress={handleClose}>
                                    <Text style={styles.primaryButtonLabel}>Close</Text>
                                </Pressable>
                            )}
                        </View>
                    </View>
                </Pressable>
            </KeyboardAvoidingView>
        </ContractActionOverlay>
    );
};

function createStyles(colors: ReturnType<typeof Colors>) {
    return StyleSheet.create({
        keyboardAvoidingView: {
            flex: 1,
            width: "100%",
        },
        inner: {
            flex: 1,
            width: "100%",
        },
        contentShell: {
            flex: 1,
            width: "100%",
            backgroundColor: colors.background,
            padding: 20,
        },
        modalHeader: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
        },
        modalTitle: {
            fontSize: 20,
            fontWeight: "bold",
            color: colors.text,
        },
        modalContent: {
            width: "100%",
            alignItems: "center",
        },
        modalText: {
            fontSize: 16,
            marginVertical: 10,
            color: colors.text,
        },
        modalRating: {
            flexDirection: "row",
            marginVertical: 10,
        },
        textInput: {
            width: "100%",
            height: 100,
            borderWidth: 1,
            borderRadius: 5,
            borderColor: colors.gray300,
            padding: 10,
            fontSize: 16,
            marginVertical: 10,
        },
        primaryButton: {
            backgroundColor: colors.primary,
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 5,
            marginVertical: 10,
        },
        primaryButtonLabel: {
            fontSize: 16,
            color: colors.white,
        },
    });
}

export default FeedbackModal;
