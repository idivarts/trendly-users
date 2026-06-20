import { View } from "@/components/theme/Themed";
import ScreenHeader from "@/components/ui/screen-header";
import { useAuthContext } from "@/contexts";
import {
    updateRazorpayAddress,
    updateRazorpayBankDetails,
} from "@/shared-libs/utils/kyc-api";
import Colors from "@/shared-uis/constants/Colors";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import { useTheme } from "@react-navigation/native";
import { useEffect, useMemo, useState } from "react";
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
} from "react-native";

function splitStreetForForm(street?: string) {
    if (!street) return { line1: "", line2: "" };
    const i = street.indexOf(", ");
    if (i === -1) return { line1: street, line2: "" };
    return { line1: street.slice(0, i), line2: street.slice(i + 2) };
}

function useBankShippingStyles(colors: ReturnType<typeof Colors>) {
    return useMemo(
        () =>
            StyleSheet.create({
                container: {
                    padding: 16,
                    gap: 16,
                },
                card: {
                    borderWidth: 1,
                    borderColor: colors.formBorder,
                    borderRadius: 12,
                    padding: 16,
                    backgroundColor: colors.card,
                },
                cardTitle: {
                    fontSize: 18,
                    fontWeight: "600",
                    marginBottom: 8,
                    color: colors.text,
                },
                description: {
                    color: colors.subtitleGray,
                    marginBottom: 12,
                },
                valueText: {
                    fontSize: 16,
                    fontWeight: "500",
                    color: colors.text,
                },
                subText: {
                    color: colors.textSecondary,
                    marginTop: 4,
                },
                badge: {
                    marginTop: 12,
                    alignSelf: "flex-start",
                    borderWidth: 1,
                    borderColor: colors.outline,
                    borderRadius: 20,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    backgroundColor: colors.tag,
                },
                badgeText: {
                    fontWeight: "500",
                    color: colors.tagForeground,
                },
                editButton: {
                    marginTop: 16,
                    backgroundColor: colors.primary,
                    alignSelf: "flex-start",
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderRadius: 8,
                },
                editText: {
                    color: colors.onPrimary,
                },
                modal: {
                    flex: 1,
                    padding: 16,
                    backgroundColor: colors.background,
                },
                input: {
                    borderWidth: 1,
                    borderColor: colors.formBorder,
                    borderRadius: 10,
                    padding: 12,
                    marginBottom: 12,
                    color: colors.text,
                },
                saveButton: {
                    marginTop: 16,
                    backgroundColor: colors.primary,
                    padding: 16,
                    borderRadius: 12,
                    alignItems: "center",
                },
                saveText: {
                    color: colors.onPrimary,
                    fontWeight: "600",
                },
            }),
        [colors]
    );
}

const BankShippingAddressContent = () => {
    const { user } = useAuthContext();
    const theme = useTheme();
    const colors = Colors(theme);
    const styles = useBankShippingStyles(colors);

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

    if (!user) {
        return null;
    }

    const maskAccount = (num?: string) =>
        num ? `XXXXXX${num.slice(-4)}` : "";

    return (
        <>
            <ScrollView contentContainerStyle={styles.container}>
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

            <Modal visible={bankModal} animationType="slide">
                <View style={styles.modal}>
                    <ScreenHeader
                        title="Edit Bank Details"
                        action={() => setBankModal(false)}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Account Number"
                        placeholderTextColor={colors.subtitleGray}
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
                        placeholderTextColor={colors.subtitleGray}
                        value={bankForm.ifsc}
                        onChangeText={(v) =>
                            setBankForm((prev) => ({ ...prev, ifsc: v }))
                        }
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Account Holder Name"
                        placeholderTextColor={colors.subtitleGray}
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
                                    throw new Error(
                                        "Please fill all bank fields."
                                    );
                                }

                                await updateRazorpayBankDetails({
                                    account_number: bankForm.accountNumber,
                                    ifsc: bankForm.ifsc,
                                    beneficiary_name: bankForm.beneficiaryName,
                                });

                                setBankModal(false);
                                Toaster.success(
                                    "Bank details updated successfully."
                                );
                            } catch (error: unknown) {
                                const message =
                                    error instanceof Error
                                        ? error.message
                                        : "Failed to update bank details.";
                                Toaster.error(message);
                            }
                        }}
                    >
                        <Text style={styles.saveText}>Save</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            <Modal visible={addressModal} animationType="slide">
                <View style={styles.modal}>
                    <ScreenHeader
                        title="Edit Shipping Address"
                        action={() => setAddressModal(false)}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Address Line 1"
                        placeholderTextColor={colors.subtitleGray}
                        value={addressForm.line1}
                        onChangeText={(v) =>
                            setAddressForm((prev) => ({ ...prev, line1: v }))
                        }
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Address Line 2"
                        placeholderTextColor={colors.subtitleGray}
                        value={addressForm.line2}
                        onChangeText={(v) =>
                            setAddressForm((prev) => ({ ...prev, line2: v }))
                        }
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="City"
                        placeholderTextColor={colors.subtitleGray}
                        value={addressForm.city}
                        onChangeText={(v) =>
                            setAddressForm((prev) => ({ ...prev, city: v }))
                        }
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="State"
                        placeholderTextColor={colors.subtitleGray}
                        value={addressForm.state}
                        onChangeText={(v) =>
                            setAddressForm((prev) => ({ ...prev, state: v }))
                        }
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Postal Code"
                        placeholderTextColor={colors.subtitleGray}
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

                                setAddressModal(false);
                                Toaster.success(
                                    "Shipping address updated successfully."
                                );
                            } catch (error: unknown) {
                                const message =
                                    error instanceof Error
                                        ? error.message
                                        : "Failed to update shipping address.";
                                Toaster.error(message);
                            }
                        }}
                    >
                        <Text style={styles.saveText}>Save</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </>
    );
};

export default BankShippingAddressContent;
