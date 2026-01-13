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

const VerificationPANScreen = () => {
    const router = useMyNavigation();
    const [agreed, setAgreed] = useState(false);

    return (
        <AppLayout>
            <ScreenHeader title="Influencer Verification" />
            {/* FORM */}
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.field}>
                    <TextInput
                        label="Name (As per your PAN)"
                        placeholder="Eg. Rahul Sinha"
                        mode="outlined"
                    />
                    <Text style={styles.helper}>
                        Enter your name as per your PAN Card
                    </Text>
                </View>

                <View style={styles.field}>

                    <TextInput
                        label="PAN Number"
                        placeholder="Eg. INXXX0000X"
                        autoCapitalize="characters"
                        mode="outlined"
                    />
                    <Text style={styles.helper}>Your PAN number</Text>
                </View>
            </ScrollView>

            {/* FIXED BOTTOM */}
            <View style={styles.bottomContainer}>
                <TouchableOpacity
                    style={styles.checkboxRow}
                    onPress={() => setAgreed(!agreed)}
                >
                    <View style={[styles.checkbox, agreed && styles.checked]} />
                    <Text style={styles.checkboxText}>
                        I agree to use PAN for my verification
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    disabled={!agreed}
                    style={[
                        styles.button,
                        !agreed && styles.buttonDisabled,
                    ]}
                    onPress={() => router.push("/verification/address")}
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

    label: {
        fontSize: 14,
        fontWeight: "500",
    },

    helper: {
        fontSize: 12,
        color: "#6B7280",
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