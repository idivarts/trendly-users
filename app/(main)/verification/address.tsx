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

const CITY_STATE_REGEX = /^[A-Za-z\s]{2,}$/;
const PINCODE_REGEX = /^[1-9][0-9]{5}$/;
const INDIAN_STATES = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Delhi",
];

const VerificationAddressScreen = () => {
    const router = useMyNavigation();
    const [stateMenuVisible, setStateMenuVisible] = useState(false);
    const [form, setForm] = useState({
        address1: "",
        address2: "",
        city: "",
        state: "",
        pincode: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (key: string, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!form.address1.trim()) {
            newErrors.address1 = "Address Line 1 is required";
        } else if (form.address1.trim().length < 5) {
            newErrors.address1 = "Address is too short";
        }

        if (!form.city.trim()) {
            newErrors.city = "City is required";
        } else if (!CITY_STATE_REGEX.test(form.city)) {
            newErrors.city = "Enter a valid city name";
        }

        if (!form.state.trim()) {
            newErrors.state = "State is required";
        } else if (!CITY_STATE_REGEX.test(form.state)) {
            newErrors.state = "Enter a valid state name";
        }

        if (!form.pincode.trim()) {
            newErrors.pincode = "Postal Code is required";
        } else if (!PINCODE_REGEX.test(form.pincode)) {
            newErrors.pincode = "Enter a valid 6-digit postal code";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;

        // Later: save address to backend
        router.push("/verification/bank");
    };

    const isDisabled =
        !form.address1 ||
        !form.city ||
        !form.state ||
        !form.pincode;

    return (
        <AppLayout>
            <ScreenHeader title="Current Address" />

            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.field}>
                    <TextInput
                        label="Address Line 1"
                        placeholder="Flat No., Street Name, Locality"
                        value={form.address1}
                        onChangeText={(v) => handleChange("address1", v)}
                        error={!!errors.address1}
                    />
                    {errors.address1 && (
                        <Text style={styles.error}>{errors.address1}</Text>
                    )}
                    <Text style={styles.helper}>Enter your Address Line 1</Text>
                </View>

                <View style={styles.field}>
                    <TextInput
                        label="Address Line 2 (Optional)"
                        placeholder="Locality or Landmark"
                        value={form.address2}
                        onChangeText={(v) => handleChange("address2", v)}
                    />
                    <Text style={styles.helper}>Enter your Address Line 2</Text>
                </View>

                <View style={styles.field}>
                    <TextInput
                        label="City"
                        placeholder="Your City name here..."
                        value={form.city}
                        onChangeText={(v) => handleChange("city", v)}
                        error={!!errors.city}
                    />
                    {errors.city && (
                        <Text style={styles.error}>{errors.city}</Text>
                    )}
                    <Text style={styles.helper}>Enter your City</Text>
                </View>

                <View style={styles.field}>
                    <Menu
                        visible={stateMenuVisible}
                        onDismiss={() => setStateMenuVisible(false)}
                        style={{ width: '100%', paddingLeft:32, paddingVertical:56 }}
                        anchor={
                            <TextInput
                                label="State"
                                placeholder="Select your State"
                                value={form.state}
                                mode="outlined"
                                editable={false}
                                error={!!errors.state}
                                // right={<TextInput.Icon icon="chevron-down" />}
                                onPressIn={() => setStateMenuVisible(true)}
                            />
                        }

                    >

                        {INDIAN_STATES.map((state) => (
                            <Menu.Item
                                key={state}
                                title={state}
                                onPress={() => {
                                    handleChange("state", state);
                                    setStateMenuVisible(false);
                                }}
                            />
                        ))}
                    </Menu>

                    {errors.state && (
                        <Text style={styles.error}>{errors.state}</Text>
                    )}
                    <Text style={styles.helper}>Select your State</Text>
                </View>

                <View style={styles.field}>
                    <TextInput
                        label="Postal Code"
                        placeholder="Postal Code here..."
                        keyboardType="number-pad"
                        value={form.pincode}
                        onChangeText={(v) =>
                            handleChange("pincode", v.replace(/[^0-9]/g, ""))
                        }
                        error={!!errors.pincode}
                    />
                    {errors.pincode && (
                        <Text style={styles.error}>{errors.pincode}</Text>
                    )}
                    <Text style={styles.helper}>Enter your Postal Code</Text>
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
                        Add Current Address
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

export default VerificationAddressScreen;