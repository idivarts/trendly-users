import { View } from "@/components/theme/Themed";
import TextInput from "@/components/ui/text-input";
import { useKYCFlowContext } from "@/contexts";
import { useMyNavigation } from "@/shared-libs/utils/router";
import Colors from "@/shared-uis/constants/Colors";
import { useTheme } from "@react-navigation/native";
import { useMemo, useState } from "react";
import { ScrollView, Text, TouchableOpacity } from "react-native";

import { createVerificationFormStyles } from "./verificationFormStyles";

const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

const VerificationPanContent = () => {
    const router = useMyNavigation();
    const theme = useTheme();
    const colors = Colors(theme);
    const styles = useMemo(
        () => createVerificationFormStyles(colors),
        [colors]
    );

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
        <>
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
                    style={[styles.checkboxRow, styles.checkboxRowSpaced]}
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
        </>
    );
};

export default VerificationPanContent;
