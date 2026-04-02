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

// VERIFICATION_FLOW_DISABLED
/*
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
*/

const VerificationPANScreen = () => {
    const router = useMyNavigation();

    // VERIFICATION_FLOW_DISABLED
    /*
    const [panName, setPanName] = useState("");
    const [panNumber, setPanNumber] = useState("");
    const [agreed, setAgreed] = useState(false);
    const [errors, setErrors] = useState<{
        panName?: string;
        panNumber?: string;
    }>({});

    const validate = () => {
        const newErrors: typeof errors = {};
        if (!panName.trim()) {
            newErrors.panName = "Name is required";
        }
        if (!panNumber.trim()) {
            newErrors.panNumber = "PAN number is required";
        } else if (!PAN_REGEX.test(panNumber)) {
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
        !agreed || !panName.trim() || !panNumber.trim();
    */

    return (
        <AppLayout>
            <ScreenHeader title="Influencer Verification" />
            {/* VERIFICATION_FLOW_DISABLED - placeholder when flow is disabled */}
            <View style={styles.placeholder}>
                <Text style={styles.placeholderText}>
                    Verification is temporarily unavailable.
                </Text>
            </View>
            {/* END VERIFICATION_FLOW_DISABLED */}

            {/* VERIFICATION_FLOW_DISABLED - original PAN form
            <ScrollView contentContainerStyle={styles.container}>
                ...
            </ScrollView>
            <View style={styles.bottomContainer}>
                ...
            </View>
            END VERIFICATION_FLOW_DISABLED */}
        </AppLayout>
    );
};

const styles = StyleSheet.create({
    // VERIFICATION_FLOW_DISABLED - placeholder when flow disabled
    placeholder: {
        padding: 16,
        paddingBottom: 120,
    },
    placeholderText: {
        fontSize: 16,
        color: "#6B7280",
    },
    // END VERIFICATION_FLOW_DISABLED
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