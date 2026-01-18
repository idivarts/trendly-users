import { View } from "@/components/theme/Themed";
import ScreenHeader from "@/components/ui/screen-header";
import TextInput from "@/components/ui/text-input";
import AppLayout from "@/layouts/app-layout";
import { useMyNavigation } from "@/shared-libs/utils/router";
import { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
} from "react-native";

const ACCOUNT_REGEX = /^[0-9]{9,18}$/;
const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;
const NAME_REGEX = /^[A-Za-z\s]{2,}$/;

const VerificationBankScreen = () => {
    const router = useMyNavigation();

    const [form, setForm] = useState({
        accountNumber: "",
        confirmAccountNumber: "",
        ifsc: "",
        accountHolderName: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (key: string, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!form.accountNumber.trim()) {
            newErrors.accountNumber = "Account number is required";
        } else if (!ACCOUNT_REGEX.test(form.accountNumber)) {
            newErrors.accountNumber =
                "Enter a valid account number (9–18 digits)";
        }

        if (!form.confirmAccountNumber.trim()) {
            newErrors.confirmAccountNumber =
                "Please re-enter account number";
        } else if (
            form.accountNumber !== form.confirmAccountNumber
        ) {
            newErrors.confirmAccountNumber =
                "Account numbers do not match";
        }

        if (!form.ifsc.trim()) {
            newErrors.ifsc = "IFSC code is required";
        } else if (!IFSC_REGEX.test(form.ifsc)) {
            newErrors.ifsc = "Enter a valid IFSC code";
        }

        if (!form.accountHolderName.trim()) {
            newErrors.accountHolderName =
                "Account holder name is required";
        } else if (!NAME_REGEX.test(form.accountHolderName)) {
            newErrors.accountHolderName =
                "Enter a valid name";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;

        // Later: save bank details to backend
        router.push("/verification/agreement");
    };

    const isDisabled =
        !form.accountNumber ||
        !form.confirmAccountNumber ||
        !form.ifsc ||
        !form.accountHolderName;

    return (
        <AppLayout>
            <ScreenHeader title="Bank Details" />

            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.field}>
                    <TextInput
                        label="Account Number"
                        placeholder="14 digit Account Number"
                        keyboardType="number-pad"
                        value={form.accountNumber}
                        onChangeText={(v) =>
                            handleChange(
                                "accountNumber",
                                v.replace(/[^0-9]/g, "")
                            )
                        }
                        error={!!errors.accountNumber}
                    />
                    {errors.accountNumber && (
                        <Text style={styles.error}>
                            {errors.accountNumber}
                        </Text>
                    )}
                    <Text style={styles.helper}>
                        Enter your bank’s Account number
                    </Text>
                </View>

                <View style={styles.field}>
                    <TextInput
                        label="Re-enter Account Number"
                        placeholder="Same Account Number here"
                        keyboardType="number-pad"
                        value={form.confirmAccountNumber}
                        onChangeText={(v) =>
                            handleChange(
                                "confirmAccountNumber",
                                v.replace(/[^0-9]/g, "")
                            )
                        }
                        error={!!errors.confirmAccountNumber}
                    />
                    {errors.confirmAccountNumber && (
                        <Text style={styles.error}>
                            {errors.confirmAccountNumber}
                        </Text>
                    )}
                    <Text style={styles.helper}>
                        Re-enter your bank’s Account number
                    </Text>
                </View>

                <View style={styles.field}>
                    <TextInput
                        label="IFSC Code"
                        placeholder="IFSC Code here"
                        value={form.ifsc}
                        autoCapitalize="characters"
                        onChangeText={(v) =>
                            handleChange("ifsc", v.toUpperCase())
                        }
                        error={!!errors.ifsc}
                    />
                    {errors.ifsc && (
                        <Text style={styles.error}>{errors.ifsc}</Text>
                    )}
                    <Text style={styles.helper}>
                        Enter your bank’s IFSC Code
                    </Text>
                </View>

                <View style={styles.field}>
                    <TextInput
                        label="Account Holder Name"
                        placeholder="Your Name..."
                        value={form.accountHolderName}
                        onChangeText={(v) =>
                            handleChange("accountHolderName", v)
                        }
                        error={!!errors.accountHolderName}
                    />
                    {errors.accountHolderName && (
                        <Text style={styles.error}>
                            {errors.accountHolderName}
                        </Text>
                    )}
                    <Text style={styles.helper}>
                        Enter the Account Holder’s name
                        (should match as per your PAN)
                    </Text>
                </View>
            </ScrollView>

            <View style={styles.bottomContainer}>
                <TouchableOpacity
                    disabled={isDisabled}
                    style={[
                        styles.button,
                        isDisabled && styles.buttonDisabled,
                    ]}
                    onPress={handleSubmit}
                >
                    <Text style={styles.buttonText}>
                        Add Bank Details
                    </Text>
                </TouchableOpacity>
            </View>
        </AppLayout>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingBottom: 120,
        gap: 24,
    },
    field: {
        gap: 6,
    },
    helper: {
        fontSize: 12,
        color: "#6B7280",
    },
    error: {
        fontSize: 12,
        color: "#DC2626",
    },
    bottomContainer: {
        padding: 16,
        borderTopWidth: 1,
        borderColor: "#E5E7EB",
        backgroundColor: "#fff",
    },
    button: {
        backgroundColor: "#111827",
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: "center",
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "600",
    },
});

export default VerificationBankScreen;