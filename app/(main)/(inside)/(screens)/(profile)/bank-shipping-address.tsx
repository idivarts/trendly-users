import { View } from "@/components/theme/Themed";
import ScreenHeader from "@/components/ui/screen-header";
import AppLayout from "@/layouts/app-layout";
import { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    Modal,
    TextInput,
} from "react-native";
import { useAuthContext } from "@/contexts";
import { doc, updateDoc } from "firebase/firestore";
import { FirestoreDB } from "@/shared-libs/utils/firebase/firestore";

const BankAndShippingScreen = () => {
    const { user } = useAuthContext();

    const [bankModal, setBankModal] = useState(false);
    const [addressModal, setAddressModal] = useState(false);

    const [bankForm, setBankForm] = useState(user?.bankDetails);
    const [addressForm, setAddressForm] = useState(user?.currentAddress);

    if (!user) return null;

    const maskAccount = (num?: string) =>
        num ? `XXXXXX${num.slice(-4)}` : "";

    const updateUser = async (data: any) => {
        if (!user.id) return;
        await updateDoc(doc(FirestoreDB, "users", user.id), data);
    };

    return (
        <AppLayout>
            <ScreenHeader title="Bank and Shipping Address" />

            <ScrollView contentContainerStyle={styles.container}>
                {/* Verification Details */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Verification Details</Text>
                    <Text style={styles.valueText}>
                        {user.panDetails?.nameAsPerPAN}
                    </Text>
                    <Text style={styles.subText}>
                        {user.panDetails?.panNumber}
                    </Text>

                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>★ Accepted</Text>
                    </View>
                </View>

                {/* Bank Account */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Bank Account</Text>
                    <Text style={styles.description}>
                        This account would be used for all the payouts.
                    </Text>

                    <Text style={styles.subText}>
                        Account - {maskAccount(user.bankDetails?.accountNumber)}
                    </Text>
                    <Text style={styles.subText}>
                        IFSC - {user.bankDetails?.ifsc}
                    </Text>
                    <Text style={styles.subText}>
                        Account Holder - {user.bankDetails?.accountHolderName}
                    </Text>

                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => setBankModal(true)}
                    >
                        <Text style={styles.editText}>Edit</Text>
                    </TouchableOpacity>
                </View>

                {/* Shipping Address */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Shipping Address</Text>
                    <Text style={styles.description}>
                        This Address would be shown to the brands who want to
                        send you the products
                    </Text>

                    <Text style={styles.subText}>
                        {user.currentAddress?.line1}
                    </Text>
                    <Text style={styles.subText}>
                        {user.currentAddress?.line2}
                    </Text>
                    <Text style={styles.subText}>
                        {user.currentAddress?.city}
                    </Text>
                    <Text style={styles.subText}>
                        {user.currentAddress?.postalCode}
                    </Text>

                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => setAddressModal(true)}
                    >
                        <Text style={styles.editText}>Edit</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* BANK MODAL */}
            <Modal visible={bankModal} animationType="slide">
                <View style={styles.modal}>
                    <ScreenHeader title="Edit Bank Details" />

                    <TextInput
                        style={styles.input}
                        placeholder="Account Number"
                        keyboardType="number-pad"
                        value={bankForm?.accountNumber}
                        onChangeText={(v) =>
                            setBankForm({ ...bankForm!, accountNumber: v })
                        }
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="IFSC"
                        value={bankForm?.ifsc}
                        onChangeText={(v) =>
                            setBankForm({ ...bankForm!, ifsc: v })
                        }
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Account Holder Name"
                        value={bankForm?.accountHolderName}
                        onChangeText={(v) =>
                            setBankForm({
                                ...bankForm!,
                                accountHolderName: v,
                            })
                        }
                    />

                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={async () => {
                            await updateUser({
                                bankDetails: {
                                    ...bankForm,
                                    isVerified: false,
                                    updatedAt: Date.now(),
                                },
                            });
                            setBankModal(false);
                        }}
                    >
                        <Text style={styles.saveText}>Save</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            {/* ADDRESS MODAL */}
            <Modal visible={addressModal} animationType="slide">
                <View style={styles.modal}>
                    <ScreenHeader title="Edit Shipping Address" />

                    <TextInput
                        style={styles.input}
                        placeholder="Address Line 1"
                        value={addressForm?.line1}
                        onChangeText={(v) =>
                            setAddressForm({ ...addressForm!, line1: v })
                        }
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Address Line 2"
                        value={addressForm?.line2}
                        onChangeText={(v) =>
                            setAddressForm({ ...addressForm!, line2: v })
                        }
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="City"
                        value={addressForm?.city}
                        onChangeText={(v) =>
                            setAddressForm({ ...addressForm!, city: v })
                        }
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="State"
                        value={addressForm?.state}
                        onChangeText={(v) =>
                            setAddressForm({ ...addressForm!, state: v })
                        }
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Postal Code"
                        keyboardType="number-pad"
                        value={addressForm?.postalCode}
                        onChangeText={(v) =>
                            setAddressForm({
                                ...addressForm!,
                                postalCode: v,
                            })
                        }
                    />

                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={async () => {
                            await updateUser({
                                currentAddress: {
                                    ...addressForm,
                                    updatedAt: Date.now(),
                                },
                            });
                            setAddressModal(false);
                        }}
                    >
                        <Text style={styles.saveText}>Save</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </AppLayout>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        gap: 16,
    },
    card: {
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 12,
        padding: 16,
        backgroundColor: "#fff",
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 8,
    },
    description: {
        color: "#6B7280",
        marginBottom: 12,
    },
    valueText: {
        fontSize: 16,
        fontWeight: "500",
    },
    subText: {
        color: "#4B5563",
        marginTop: 4,
    },
    badge: {
        marginTop: 12,
        alignSelf: "flex-start",
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    badgeText: {
        fontWeight: "500",
    },
    editButton: {
        marginTop: 16,
        backgroundColor: "#111827",
        alignSelf: "flex-start",
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 8,
    },
    editText: {
        color: "#fff",
    },
    modal: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fff",
    },
    input: {
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 10,
        padding: 12,
        marginBottom: 12,
    },
    saveButton: {
        marginTop: 16,
        backgroundColor: "#111827",
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
    },
    saveText: {
        color: "#fff",
        fontWeight: "600",
    },
});

export default BankAndShippingScreen;