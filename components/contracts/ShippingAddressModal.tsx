import { Text, View } from "@/components/theme/Themed";
import { useAuthContext } from "@/contexts/auth-context.provider";
import { Console } from "@/shared-libs/utils/console";
import { FirestoreDB } from "@/shared-libs/utils/firebase/firestore";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import Colors from "@/shared-uis/constants/Colors";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useTheme } from "@react-navigation/native";
import { doc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
} from "react-native";
import { Modal, Portal } from "react-native-paper";
import Button from "../ui/button";
import TextInput from "../ui/text-input";

interface ShippingAddressModalProps {
    visible: boolean;
    setVisibility: (visible: boolean) => void;
    refreshData: () => void;
    currentAddress?: {
        street?: string;
        city?: string;
        state?: string;
        zip?: string;
        country?: string;
    };
}

const ShippingAddressModal: React.FC<ShippingAddressModalProps> = ({
    visible,
    setVisibility,
    refreshData,
    currentAddress,
}) => {
    const theme = useTheme();
    const { user } = useAuthContext();
    const [loading, setLoading] = useState(false);

    const [street, setStreet] = useState(currentAddress?.street || "");
    const [city, setCity] = useState(currentAddress?.city || "");
    const [state, setState] = useState(currentAddress?.state || "");
    const [zip, setZip] = useState(currentAddress?.zip || "");
    const [country, setCountry] = useState(currentAddress?.country || "");

    const handleUpdateAddress = async () => {
        try {
            if (!street || !city || !state || !zip || !country) {
                Toaster.error("Please fill in all address fields");
                return;
            }

            if (!user?.id) {
                Toaster.error("User not found");
                return;
            }

            setLoading(true);
            const userRef = doc(FirestoreDB, "users", user.id);

            await updateDoc(userRef, {
                "shippingAddress.street": street,
                "shippingAddress.city": city,
                "shippingAddress.state": state,
                "shippingAddress.zip": zip,
                "shippingAddress.country": country,
            });

            Toaster.success("Shipping address updated successfully");
            setVisibility(false);
            refreshData();
        } catch (error) {
            Console.error("Error updating address:", String(error));
            Toaster.error("Failed to update address");
        } finally {
            setLoading(false);
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
                    marginHorizontal: 20,
                    maxWidth: 600,
                    width: "100%",
                    alignSelf: "center",
                }}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.keyboardAvoidingView}
                >
                    <Pressable
                        style={styles.modal}
                        onPress={() => Platform.OS !== "web" && Keyboard.dismiss()}
                    >
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Update Shipping Address</Text>
                            <Pressable onPress={() => setVisibility(false)}>
                                <FontAwesomeIcon
                                    icon={faClose}
                                    size={24}
                                    color={Colors(theme).text}
                                />
                            </Pressable>
                        </View>

                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.scrollContent}
                        >
                            <View style={styles.formContainer}>
                                <TextInput
                                    label="Street Address"
                                    value={street}
                                    onChangeText={setStreet}
                                    placeholder="Enter street address"
                                    style={styles.input}
                                />

                                <TextInput
                                    label="City"
                                    value={city}
                                    onChangeText={setCity}
                                    placeholder="Enter city"
                                    style={styles.input}
                                />

                                <TextInput
                                    label="State/Province"
                                    value={state}
                                    onChangeText={setState}
                                    placeholder="Enter state or province"
                                    style={styles.input}
                                />

                                <TextInput
                                    label="ZIP/Postal Code"
                                    value={zip}
                                    onChangeText={setZip}
                                    placeholder="Enter ZIP or postal code"
                                    style={styles.input}
                                />

                                <TextInput
                                    label="Country"
                                    value={country}
                                    onChangeText={setCountry}
                                    placeholder="Enter country"
                                    style={styles.input}
                                />
                            </View>
                        </ScrollView>

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
                                onPress={handleUpdateAddress}
                                style={styles.button}
                                loading={loading}
                                disabled={loading}
                            >
                                Update Address
                            </Button>
                        </View>
                    </Pressable>
                </KeyboardAvoidingView>
            </Modal>
        </Portal>
    );
};

const styles = StyleSheet.create({
    keyboardAvoidingView: {
        maxHeight: "90%",
    },
    modal: {
        gap: 20,
        width: "100%",
    },
    scrollContent: {
        flexGrow: 1,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
    },
    formContainer: {
        gap: 16,
        width: "100%",
    },
    input: {
        width: "100%",
    },
    buttonContainer: {
        flexDirection: "row",
        gap: 12,
        marginTop: 8,
    },
    button: {
        flex: 1,
    },
});

export default ShippingAddressModal;
