import { View } from "@/components/theme/Themed";
import ScreenHeader from "@/components/ui/screen-header";
import AppLayout from "@/layouts/app-layout";
import { useMyNavigation } from "@/shared-libs/utils/router";
import { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    NativeScrollEvent,
    NativeSyntheticEvent,
} from "react-native";
import { doc, updateDoc } from "firebase/firestore";
import { FirestoreDB } from "@/shared-libs/utils/firebase/firestore";
import { useAuthContext } from "@/contexts";

// VERIFICATION_FLOW_DISABLED
/*
const AGREEMENT_TEXT = `
Lorem ipsum dolor sit amet...
`;
*/

const VerificationAgreementScreen = () => {
    const router = useMyNavigation();

    // VERIFICATION_FLOW_DISABLED - agreement state, handleScroll, handleSubmit (Firestore write), and UI
    /*
    const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false);
    const [agreePan, setAgreePan] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const { user } = useAuthContext();
    const handleScroll = (event) => { ... };
    const canProceed = hasScrolledToEnd && agreePan && agreeTerms;
    const handleSubmit = async () => {
        await updateDoc(doc(FirestoreDB, "users", user.id), { isKYCDone: false, kyc: { status: "in_progress", updatedAt: Date.now() } });
        router.replace("/profile");
    };
    */

    return (
        <AppLayout>
            <ScreenHeader title="Agreement" />
            {/* VERIFICATION_FLOW_DISABLED - placeholder when flow is disabled */}
            <View style={styles.placeholder}>
                <Text style={styles.placeholderText}>
                    Verification is temporarily unavailable.
                </Text>
            </View>
            {/* END VERIFICATION_FLOW_DISABLED */}

            {/* VERIFICATION_FLOW_DISABLED - original agreement UI (ScrollView, checkboxes, Proceed button) */}
            {/* END VERIFICATION_FLOW_DISABLED */}
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
    agreementContainer: {
        margin: 16,
        backgroundColor: "#E5E7EB",
        borderRadius: 12,
        padding: 12,
        height: 300,
    },
    agreementText: {
        fontSize: 14,
        lineHeight: 20,
        color: "#111827",
    },
    bottomContainer: {
        padding: 16,
        borderTopWidth: 1,
        borderColor: "#E5E7EB",
        backgroundColor: "#fff",
        gap: 12,
    },
    checkboxRow: {
        flexDirection: "row",
        alignItems: "center",
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
        marginTop: 8,
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

export default VerificationAgreementScreen;