import { Text, View } from "@/components/theme/Themed";
import { IContracts } from "@/shared-libs/firestore/trendly-pro/models/contracts";
import { Console } from "@/shared-libs/utils/console";
import { FirestoreDB } from "@/shared-libs/utils/firebase/firestore";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import Colors from "@/shared-uis/constants/Colors";
import { faCheck, faClose, faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useTheme } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { doc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
} from "react-native";
import { Modal, Portal } from "react-native-paper";
import Button from "../ui/button";
import TextInput from "../ui/text-input";

interface ConfirmDeliveryModalProps {
    visible: boolean;
    setVisibility: (visible: boolean) => void;
    contract: IContracts;
    refreshData: () => void;
}

const ConfirmDeliveryModal: React.FC<ConfirmDeliveryModalProps> = ({
    visible,
    setVisibility,
    contract,
    refreshData,
}) => {
    const theme = useTheme();
    const [loading, setLoading] = useState(false);
    const [confirmed, setConfirmed] = useState(false);
    const [notes, setNotes] = useState("");
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (!visible) {
            setConfirmed(false);
            setNotes("");
            setImageUri(null);
            setLoading(false);
            setUploading(false);
        }
    }, [visible]);

    const pickImage = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== "granted") {
                Toaster.error("Camera roll permissions required");
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 0.8,
            });

            if (!result.canceled) {
                setImageUri(result.assets[0].uri);
            }
        } catch (error) {
            Console.error("Error picking image:", String(error));
            Toaster.error("Failed to pick image");
        }
    };

    const handleConfirmDelivery = async () => {
        try {
            if (!confirmed) {
                Toaster.error("Please confirm that you have received the product");
                return;
            }

            setLoading(true);

            // Update contract status to 6 (Delivery Confirmed)
            const contractRef = doc(FirestoreDB, "contracts", contract.streamChannelId);
            await updateDoc(contractRef, {
                status: 6,
                deliveryConfirmedAt: Date.now(),
                deliveryNotes: notes || null,
            });

            Toaster.success("Delivery confirmed successfully");
            setVisibility(false);
            refreshData();
        } catch (error) {
            Console.error("Error confirming delivery:", String(error));
            Toaster.error("Failed to confirm delivery");
        } finally {
            setLoading(false);
            setUploading(false);
        }
    };

    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={() => setVisibility(false)}
                contentContainerStyle={{
                    backgroundColor: Colors(theme).background,
                    borderRadius: 10,
                    padding: 20,
                    paddingBottom: 32,
                    // marginHorizontal: 20,
                    maxWidth: 600,
                    alignSelf: "center",
                    width: Platform.OS === "web" ? "90%" : "100%",
                }}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.keyboardAvoidingView}
                >
                    <View style={styles.modal}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: Colors(theme).text }]}>
                                Confirm Delivery
                            </Text>
                            <Pressable onPress={() => setVisibility(false)}>
                                <FontAwesomeIcon
                                    icon={faClose}
                                    size={24}
                                    color={Colors(theme).text}
                                />
                            </Pressable>
                        </View>

                        <View style={styles.formContainer}>
                            <View style={styles.uploadSection}>
                                <Text style={[styles.label, { color: Colors(theme).text }]}>
                                    Delivery Proof (Optional)
                                </Text>
                                {imageUri ? (
                                    <View style={styles.imageContainer}>
                                        <Image source={{ uri: imageUri }} style={styles.image} />
                                        <Pressable
                                            style={styles.removeButton}
                                            onPress={() => setImageUri(null)}
                                        >
                                            <FontAwesomeIcon icon={faClose} size={16} color="#fff" />
                                        </Pressable>
                                    </View>
                                ) : (
                                    <Pressable
                                        style={[
                                            styles.uploadButton,
                                            { borderColor: Colors(theme).primary },
                                        ]}
                                        onPress={pickImage}
                                    >
                                        <FontAwesomeIcon
                                            icon={faImage}
                                            size={32}
                                            color={Colors(theme).primary}
                                        />
                                        <Text
                                            style={[
                                                styles.uploadText,
                                                { color: Colors(theme).text },
                                            ]}
                                        >
                                            Upload delivery photo
                                        </Text>
                                    </Pressable>
                                )}
                            </View>

                            <TextInput
                                label="Notes (Optional)"
                                value={notes}
                                onChangeText={setNotes}
                                placeholder="Add any notes about the delivery"
                                multiline
                                numberOfLines={4}
                                style={styles.textArea}
                            />

                            <Pressable
                                style={styles.checkboxContainer}
                                onPress={() => setConfirmed(!confirmed)}
                            >
                                <View
                                    style={[
                                        styles.checkbox,
                                        {
                                            borderColor: Colors(theme).text,
                                            backgroundColor: confirmed
                                                ? Colors(theme).primary
                                                : "transparent",
                                        },
                                    ]}
                                >
                                    {confirmed && (
                                        <FontAwesomeIcon icon={faCheck} size={12} color="#fff" />
                                    )}
                                </View>
                                <Text
                                    style={[styles.checkboxLabel, { color: Colors(theme).text }]}
                                >
                                    I confirm that I have received the product
                                </Text>
                            </Pressable>
                        </View>

                        <View style={styles.buttonContainer}>
                            <Button
                                mode="outlined"
                                onPress={() => setVisibility(false)}
                                style={styles.button}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button
                                mode="contained"
                                onPress={handleConfirmDelivery}
                                style={styles.button}
                                loading={loading || uploading}
                                disabled={loading || uploading || !confirmed}
                            >
                                Confirm Delivery
                            </Button>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </Portal>
    );
};

const styles = StyleSheet.create({
    keyboardAvoidingView: {
        maxHeight: "90%",
    },
    scrollContent: {
        flexGrow: 1,
    },
    modal: {
        gap: 20,
        width: "100%",
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingBottom: 12,
        // borderBottomWidth: 1,
        // borderBottomColor: "rgba(0, 0, 0, 0.1)",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
    },
    formContainer: {
        gap: 20,
        width: "100%",
    },
    uploadSection: {
        gap: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
    },
    uploadButton: {
        borderWidth: 2,
        borderStyle: "dashed",
        borderRadius: 8,
        padding: 32,
        alignItems: "center",
        gap: 8,
    },
    uploadText: {
        fontSize: 14,
    },
    imageContainer: {
        position: "relative",
        width: "100%",
        height: 200,
        borderRadius: 8,
        overflow: "hidden",
    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    removeButton: {
        position: "absolute",
        top: 8,
        right: 8,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        borderRadius: 16,
        width: 32,
        height: 32,
        alignItems: "center",
        justifyContent: "center",
    },
    textArea: {
        minHeight: 100,
        textAlignVertical: "top",
        width: "100%",
    },
    checkboxContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    checkbox: {
        width: 18,
        height: 18,
        borderRadius: 4,
        borderWidth: 1.5,
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
    },
    checkboxLabel: {
        fontSize: 14,
        flex: 1,
    },
    buttonContainer: {
        flexDirection: "row",
        gap: 12,
        marginTop: 24,
    },
    button: {
        flex: 1,
    },
});

export default ConfirmDeliveryModal;
