import { View } from "@/components/theme/Themed";
import TextInput from "@/components/ui/text-input";
import { useKYCFlowContext } from "@/contexts";
import { useMyNavigation } from "@/shared-libs/utils/router";
import Colors from "@/shared-uis/constants/Colors";
import { useTheme } from "@react-navigation/native";
import { useEffect, useMemo, useState } from "react";
import {
    ScrollView,
    Text,
    TouchableOpacity,
} from "react-native";

import { createVerificationFormStyles } from "./verificationFormStyles";

const ACCOUNT_REGEX = /^[0-9]{9,18}$/;
const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;
const NAME_REGEX = /^[A-Za-z\s]{2,}$/;

const VerificationBankContent = () => {
    const router = useMyNavigation();
    const theme = useTheme();
    const colors = Colors(theme);
    const styles = useMemo(
        () => createVerificationFormStyles(colors),
        [colors]
    );

    const { draft, setBank } = useKYCFlowContext();

    const [confirmAccountNumber, setConfirmAccountNumber] = useState(
        draft.bankDetails.accountNumber
    );
    useEffect(() => {
        if (!confirmAccountNumber) {
            setConfirmAccountNumber(draft.bankDetails.accountNumber);
        }
    }, [draft.bankDetails.accountNumber, confirmAccountNumber]);

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!draft.bankDetails.accountNumber.trim()) {
            newErrors.accountNumber = "Account number is required";
        } else if (!ACCOUNT_REGEX.test(draft.bankDetails.accountNumber)) {
            newErrors.accountNumber =
                "Enter a valid account number (9–18 digits)";
        }

        if (!confirmAccountNumber.trim()) {
            newErrors.confirmAccountNumber =
                "Please re-enter account number";
        } else if (
            draft.bankDetails.accountNumber !== confirmAccountNumber
        ) {
            newErrors.confirmAccountNumber =
                "Account numbers do not match";
        }

        if (!draft.bankDetails.ifsc.trim()) {
            newErrors.ifsc = "IFSC code is required";
        } else if (!IFSC_REGEX.test(draft.bankDetails.ifsc)) {
            newErrors.ifsc = "Enter a valid IFSC code";
        }

        if (!draft.bankDetails.beneficiaryName.trim()) {
            newErrors.accountHolderName =
                "Account holder name is required";
        } else if (!NAME_REGEX.test(draft.bankDetails.beneficiaryName)) {
            newErrors.accountHolderName = "Enter a valid name";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;
        router.push("/verification/agreement");
    };

    const isDisabled =
        !draft.bankDetails.accountNumber ||
        !confirmAccountNumber ||
        !draft.bankDetails.ifsc ||
        !draft.bankDetails.beneficiaryName;

    return (
        <>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.field}>
                    <TextInput
                        label="Account Number"
                        placeholder="14 digit Account Number"
                        keyboardType="number-pad"
                        value={draft.bankDetails.accountNumber}
                        onChangeText={(v) =>
                            setBank({
                                accountNumber: v.replace(/[^0-9]/g, ""),
                            })
                        }
                        error={!!errors.accountNumber}
                    />
                    {errors.accountNumber && (
                        <Text style={styles.error}>
                            {errors.accountNumber}
                        </Text>
                    )}
                    <Text style={styles.helper}>
                        Enter your bank&apos;s Account number
                    </Text>
                </View>

                <View style={styles.field}>
                    <TextInput
                        label="Re-enter Account Number"
                        placeholder="Same Account Number here"
                        keyboardType="number-pad"
                        value={confirmAccountNumber}
                        onChangeText={(v) =>
                            setConfirmAccountNumber(
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
                        Re-enter your bank&apos;s Account number
                    </Text>
                </View>

                <View style={styles.field}>
                    <TextInput
                        label="IFSC Code"
                        placeholder="IFSC Code here"
                        value={draft.bankDetails.ifsc}
                        autoCapitalize="characters"
                        onChangeText={(v) =>
                            setBank({ ifsc: v.toUpperCase() })
                        }
                        error={!!errors.ifsc}
                    />
                    {errors.ifsc && (
                        <Text style={styles.error}>{errors.ifsc}</Text>
                    )}
                    <Text style={styles.helper}>
                        Enter your bank&apos;s IFSC Code
                    </Text>
                </View>

                <View style={styles.field}>
                    <TextInput
                        label="Account Holder Name"
                        placeholder="Your Name..."
                        value={draft.bankDetails.beneficiaryName}
                        onChangeText={(v) =>
                            setBank({ beneficiaryName: v })
                        }
                        error={!!errors.accountHolderName}
                    />
                    {errors.accountHolderName && (
                        <Text style={styles.error}>
                            {errors.accountHolderName}
                        </Text>
                    )}
                    <Text style={styles.helper}>
                        Enter the Account Holder&apos;s name
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
        </>
    );
};

export default VerificationBankContent;
