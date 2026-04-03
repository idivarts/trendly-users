import { View } from "@/components/theme/Themed";
import ScreenHeader from "@/components/ui/screen-header";
import AppLayout from "@/layouts/app-layout";
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
import {
    updateRazorpayAddress,
    updateRazorpayBankDetails,
} from "@/shared-libs/utils/kyc-api";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import { useEffect, useState } from "react";

function splitStreetForForm(street?: string) {
    if (!street) return { line1: "", line2: "" };
    const i = street.indexOf(", ");
    if (i === -1) return { line1: street, line2: "" };
    return { line1: street.slice(0, i), line2: street.slice(i + 2) };
}

const BankAndShippingScreen = () => {
    const { user } = useAuthContext();

    const [bankModal, setBankModal] = useState(false);
    const [addressModal, setAddressModal] = useState(false);

    const [bankForm, setBankForm] = useState({
        accountNumber: "",
        ifsc: "",
        beneficiaryName: "",
    });
    const [addressForm, setAddressForm] = useState({
        line1: "",
        line2: "",
        city: "",
        state: "",
        postalCode: "",
    });

    useEffect(() => {
        if (!user) return;
        const b = user.kyc?.bankDetails;
        setBankForm({
            accountNumber: b?.accountNumber ?? "",
            ifsc: b?.ifsc ?? "",
            beneficiaryName: b?.beneficiaryName ?? "",
        });
        const ca = user.kyc?.currentAddress;
        const { line1, line2 } = splitStreetForForm(ca?.street);
        setAddressForm({
            line1,
            line2,
            city: ca?.city ?? "",
            state: ca?.state ?? "",
            postalCode: ca?.postalCode ?? "",
        });
    }, [user]);

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
                        {user.kyc?.panDetails?.nameAsPerPAN}
                    </Text>
                    <Text style={styles.subText}>
                        {user.kyc?.panDetails?.panNumber}
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
                        Account -{" "}
                        {maskAccount(user.kyc?.bankDetails?.accountNumber)}
                    </Text>
                    <Text style={styles.subText}>
                        IFSC - {user.kyc?.bankDetails?.ifsc}
                    </Text>
                    <Text style={styles.subText}>
                        Account Holder -{" "}
                        {user.kyc?.bankDetails?.beneficiaryName}
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
                        {
                            splitStreetForForm(user.kyc?.currentAddress?.street)
                                .line1
                        }
                    </Text>
                    <Text style={styles.subText}>
                        {
                            splitStreetForForm(user.kyc?.currentAddress?.street)
                                .line2
                        }
                    </Text>
                    <Text style={styles.subText}>
                        {user.kyc?.currentAddress?.city}
                    </Text>
                    <Text style={styles.subText}>
                        {user.kyc?.currentAddress?.postalCode}
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
                        value={bankForm.accountNumber}
                        onChangeText={(v) =>
                            setBankForm((prev) => ({
                                ...prev,
                                accountNumber: v,
                            }))
                        }
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="IFSC"
                        value={bankForm.ifsc}
                        onChangeText={(v) =>
                            setBankForm((prev) => ({ ...prev, ifsc: v }))
                        }
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Account Holder Name"
                        value={bankForm.beneficiaryName}
                        onChangeText={(v) =>
                            setBankForm((prev) => ({
                                ...prev,
                                beneficiaryName: v,
                            }))
                        }
                    />

                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={async () => {
                            try {
                                if (
                                    !bankForm.accountNumber ||
                                    !bankForm.ifsc ||
                                    !bankForm.beneficiaryName
                                ) {
                                    throw new Error("Please fill all bank fields.");
                                }

                                await updateRazorpayBankDetails({
                                    account_number: bankForm.accountNumber,
                                    ifsc: bankForm.ifsc,
                                    beneficiary_name: bankForm.beneficiaryName,
                                });

                                await updateUser({
                                    kyc: {
                                        ...user.kyc,
                                        bankDetails: {
                                            accountNumber: bankForm.accountNumber,
                                            ifsc: bankForm.ifsc,
                                            beneficiaryName:
                                                bankForm.beneficiaryName,
                                        },
                                        updatedAt: Date.now(),
                                    },
                                });
                                setBankModal(false);
                                Toaster.success("Bank details updated successfully.");
                            } catch (error: any) {
                                Toaster.error(
                                    error?.message ||
                                        "Failed to update bank details."
                                );
                            }
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
                        value={addressForm.line1}
                        onChangeText={(v) =>
                            setAddressForm((prev) => ({ ...prev, line1: v }))
                        }
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Address Line 2"
                        value={addressForm.line2}
                        onChangeText={(v) =>
                            setAddressForm((prev) => ({ ...prev, line2: v }))
                        }
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="City"
                        value={addressForm.city}
                        onChangeText={(v) =>
                            setAddressForm((prev) => ({ ...prev, city: v }))
                        }
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="State"
                        value={addressForm.state}
                        onChangeText={(v) =>
                            setAddressForm((prev) => ({ ...prev, state: v }))
                        }
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Postal Code"
                        keyboardType="number-pad"
                        value={addressForm.postalCode}
                        onChangeText={(v) =>
                            setAddressForm((prev) => ({
                                ...prev,
                                postalCode: v,
                            }))
                        }
                    />

                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={async () => {
                            try {
                                if (
                                    !addressForm.line1 ||
                                    !addressForm.city ||
                                    !addressForm.state ||
                                    !addressForm.postalCode
                                ) {
                                    throw new Error(
                                        "Please fill all required address fields."
                                    );
                                }

                                const streetMerged = [
                                    addressForm.line1,
                                    addressForm.line2,
                                ]
                                    .filter(Boolean)
                                    .join(", ");

                                await updateRazorpayAddress({
                                    street: streetMerged,
                                    city: addressForm.city,
                                    state: addressForm.state,
                                    postal_code: addressForm.postalCode,
                                });

                                await updateUser({
                                    kyc: {
                                        ...user.kyc,
                                        currentAddress: {
                                            street: streetMerged,
                                            city: addressForm.city,
                                            state: addressForm.state,
                                            postalCode: addressForm.postalCode,
                                        },
                                        updatedAt: Date.now(),
                                    },
                                });
                                setAddressModal(false);
                                Toaster.success(
                                    "Shipping address updated successfully."
                                );
                            } catch (error: any) {
                                Toaster.error(
                                    error?.message ||
                                        "Failed to update shipping address."
                                );
                            }
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