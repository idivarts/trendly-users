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
import { Menu } from "react-native-paper";

// VERIFICATION_FLOW_DISABLED
/*
const CITY_STATE_REGEX = /^[A-Za-z\s]{2,}$/;
const PINCODE_REGEX = /^[1-9][0-9]{5}$/;
const INDIAN_STATES = [
    "Andhra Pradesh",
    ...
];
*/

const VerificationAddressScreen = () => {
    const router = useMyNavigation();

    // VERIFICATION_FLOW_DISABLED - form state and handlers commented; placeholder shown
    /*
    const [stateMenuVisible, setStateMenuVisible] = useState(false);
    const [form, setForm] = useState({ address1: "", address2: "", city: "", state: "", pincode: "" });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const handleChange = (key: string, value: string) => { ... };
    const validate = () => { ... };
    const handleSubmit = () => { router.push("/verification/bank"); };
    const isDisabled = !form.address1 || !form.city || !form.state || !form.pincode;
    */

    return (
        <AppLayout>
            <ScreenHeader title="Current Address" />
            {/* VERIFICATION_FLOW_DISABLED - placeholder when flow is disabled */}
            <View style={styles.placeholder}>
                <Text style={styles.placeholderText}>
                    Verification is temporarily unavailable.
                </Text>
            </View>
            {/* END VERIFICATION_FLOW_DISABLED */}

            {/* VERIFICATION_FLOW_DISABLED - original address form UI (ScrollView + fields + bottom button) */}
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

export default VerificationAddressScreen;