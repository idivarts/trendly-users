import { View } from "@/components/theme/Themed";
import ScreenHeader from "@/components/ui/screen-header";
import TextInput from "@/components/ui/text-input";
import { useKYCFlowContext } from "@/contexts";
import AppLayout from "@/layouts/app-layout";
import { useMyNavigation } from "@/shared-libs/utils/router";
import { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
} from "react-native";

const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

const VerificationPANScreen = () => {
    const router = useMyNavigation();
    const { draft, setPan, setAgreements } = useKYCFlowContext();

    const [errors, setErrors] = useState<{
        panName?: string;
        panNumber?: string;
    }>({});

    const validate = () => {
        const newErrors: typeof errors = {};
        if (!draft.panDetails.nameAsPerPAN.trim()) {
            newErrors.panName = "Name is required";
        }
        if (!draft.panDetails.panNumber.trim()) {
            newErrors.panNumber = "PAN number is required";
        } else if (!PAN_REGEX.test(draft.panDetails.panNumber)) {
            newErrors.panNumber = "Invalid PAN number";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;
        router.push("/verification/address");
    };

    const isButtonDisabled =
        !draft.agreements.panConsent ||
        !draft.panDetails.nameAsPerPAN.trim() ||
        !draft.panDetails.panNumber.trim();

    return (
        <AppLayout>
            <ScreenHeader title="Influencer Verification" />

            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.field}>
                    <TextInput
                        label="Name (As per your PAN)"
                        placeholder="Eg. Rahul Sinha"
                        value={draft.panDetails.nameAsPerPAN}
                        onChangeText={(value) =>
                            setPan({ nameAsPerPAN: value })
                        }
                        mode="outlined"
                        error={!!errors.panName}
                    />
                    {errors.panName && (
                        <Text style={styles.error}>{errors.panName}</Text>
                    )}
                    <Text style={styles.helper}>
                        Enter your name as per your PAN Card
                    </Text>
                </View>

                <View style={styles.field}>
                    <TextInput
                        label="PAN Number"
                        placeholder="Eg. INXXX0000X"
                        value={draft.panDetails.panNumber}
                        onChangeText={(text) =>
                            setPan({ panNumber: text.toUpperCase() })
                        }
                        autoCapitalize="characters"
                        mode="outlined"
                        error={!!errors.panNumber}
                    />
                    {errors.panNumber && (
                        <Text style={styles.error}>{errors.panNumber}</Text>
                    )}
                    <Text style={styles.helper}>
                        Your PAN number (ABCDE1234F)
                    </Text>
                </View>
            </ScrollView>

            <View style={styles.bottomContainer}>
                <TouchableOpacity
                    style={styles.checkboxRow}
                    onPress={() =>
                        setAgreements({
                            panConsent: !draft.agreements.panConsent,
                        })
                    }
                >
                    <View
                        style={[
                            styles.checkbox,
                            draft.agreements.panConsent && styles.checked,
                        ]}
                    />
                    <Text style={styles.checkboxText}>
                        I agree to use PAN for my verification
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    disabled={isButtonDisabled}
                    style={[
                        styles.button,
                        isButtonDisabled && styles.buttonDisabled,
                    ]}
                    onPress={handleSubmit}
                >
                    <Text style={styles.buttonText}>
                        Verify your Account
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

    checkboxRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
        gap: 10,
    },

    checkbox: {
        width: 18,
        height: 18,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: "#9CA3AF",
    },

    checked: {
        backgroundColor: "#111827",
    },

    checkboxText: {
        fontSize: 14,
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

export default VerificationPANScreen;