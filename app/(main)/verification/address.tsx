import { View } from "@/components/theme/Themed";
import ScreenHeader from "@/components/ui/screen-header";
import TextInput from "@/components/ui/text-input";
import { useKYCFlowContext } from "@/contexts";
import AppLayout from "@/layouts/app-layout";
import { useMyNavigation } from "@/shared-libs/utils/router";
import Colors from "@/shared-uis/constants/Colors";
import { useTheme } from "@react-navigation/native";
import { useMemo, useState } from "react";
import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
} from "react-native";

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
    const theme = useTheme();
    const colors = Colors(theme);
    const modalStyles = useMemo(() => createStateModalStyles(colors), [colors]);
    const { draft, setAddress } = useKYCFlowContext();
    const [stateMenuVisible, setStateMenuVisible] = useState(false);

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!draft.currentAddress.street.trim()) {
            newErrors.address1 = "Address Line 1 is required";
        } else if (draft.currentAddress.street.trim().length < 5) {
            newErrors.address1 = "Address is too short";
        }

        if (!draft.currentAddress.city.trim()) {
            newErrors.city = "City is required";
        } else if (!CITY_STATE_REGEX.test(draft.currentAddress.city)) {
            newErrors.city = "Enter a valid city name";
        }

        if (!draft.currentAddress.state.trim()) {
            newErrors.state = "State is required";
        } else if (!CITY_STATE_REGEX.test(draft.currentAddress.state)) {
            newErrors.state = "Enter a valid state name";
        }

        if (!draft.currentAddress.postalCode.trim()) {
            newErrors.pincode = "Postal Code is required";
        } else if (!PINCODE_REGEX.test(draft.currentAddress.postalCode)) {
            newErrors.pincode = "Enter a valid 6-digit postal code";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;

        router.push("/verification/bank");
    };

    const isDisabled =
        !draft.currentAddress.street ||
        !draft.currentAddress.city ||
        !draft.currentAddress.state ||
        !draft.currentAddress.postalCode;

    return (
        <AppLayout>
            <ScreenHeader title="Current Address" />

            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.field}>
                    <TextInput
                        label="Address Line 1"
                        placeholder="Flat No., Street Name, Locality"
                        value={draft.currentAddress.street}
                        onChangeText={(v) => setAddress({ street: v })}
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
                        value={draft.currentAddress.line2 || ""}
                        onChangeText={(v) => setAddress({ line2: v })}
                    />
                    <Text style={styles.helper}>Enter your Address Line 2</Text>
                </View>

                <View style={styles.field}>
                    <TextInput
                        label="City"
                        placeholder="Your City name here..."
                        value={draft.currentAddress.city}
                        onChangeText={(v) => setAddress({ city: v })}
                        error={!!errors.city}
                    />
                    {errors.city && (
                        <Text style={styles.error}>{errors.city}</Text>
                    )}
                    <Text style={styles.helper}>Enter your City</Text>
                </View>

                <View style={styles.field}>
                    <Pressable
                        onPress={() => setStateMenuVisible(true)}
                        accessibilityRole="button"
                        accessibilityLabel="Select state"
                        accessibilityHint="Opens a list of states"
                    >
                        <TextInput
                            label="State"
                            placeholder="Select your State"
                            value={draft.currentAddress.state}
                            editable={false}
                            error={!!errors.state}
                            pointerEvents="none"
                        />
                    </Pressable>

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
                        value={draft.currentAddress.postalCode}
                        onChangeText={(v) =>
                            setAddress({
                                postalCode: v.replace(/[^0-9]/g, ""),
                            })
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

            <Modal
                visible={stateMenuVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setStateMenuVisible(false)}
            >
                <View style={modalStyles.modalRoot}>
                    <Pressable
                        style={modalStyles.modalBackdrop}
                        onPress={() => setStateMenuVisible(false)}
                        accessibilityLabel="Dismiss state list"
                    />
                    <View style={modalStyles.modalCard}>
                        <Text style={modalStyles.modalTitle}>Select state</Text>
                        <ScrollView
                            style={modalStyles.stateScroll}
                            contentContainerStyle={modalStyles.stateScrollContent}
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator
                            nestedScrollEnabled
                        >
                            {INDIAN_STATES.map((stateName) => (
                                <Pressable
                                    key={stateName}
                                    style={({ pressed }) => [
                                        modalStyles.stateRow,
                                        pressed && modalStyles.stateRowPressed,
                                    ]}
                                    onPress={() => {
                                        setAddress({ state: stateName });
                                        setStateMenuVisible(false);
                                    }}
                                >
                                    <Text style={modalStyles.stateRowText}>
                                        {stateName}
                                    </Text>
                                </Pressable>
                            ))}
                        </ScrollView>
                        <Pressable
                            style={modalStyles.cancelButton}
                            onPress={() => setStateMenuVisible(false)}
                        >
                            <Text style={modalStyles.cancelButtonText}>
                                Cancel
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </AppLayout>
    );
};

function createStateModalStyles(colors: ReturnType<typeof Colors>) {
    return StyleSheet.create({
        modalRoot: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 24,
        },
        modalBackdrop: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: colors.backdrop,
        },
        modalCard: {
            width: "100%",
            maxWidth: 400,
            maxHeight: "75%",
            borderRadius: 16,
            backgroundColor: colors.modalBackground,
            overflow: "hidden",
            zIndex: 1,
            elevation: 12,
        },
        modalTitle: {
            fontSize: 18,
            fontWeight: "600",
            color: colors.text,
            paddingHorizontal: 20,
            paddingTop: 18,
            paddingBottom: 12,
        },
        stateScroll: {
            flexGrow: 0,
            maxHeight: 360,
        },
        stateScrollContent: {
            paddingBottom: 8,
        },
        stateRow: {
            paddingVertical: 14,
            paddingHorizontal: 20,
            borderTopWidth: StyleSheet.hairlineWidth,
            borderTopColor: colors.lightgray,
        },
        stateRowPressed: {
            backgroundColor: colors.tag,
        },
        stateRowText: {
            fontSize: 16,
            color: colors.text,
        },
        cancelButton: {
            paddingVertical: 14,
            alignItems: "center",
            borderTopWidth: StyleSheet.hairlineWidth,
            borderTopColor: colors.lightgray,
        },
        cancelButtonText: {
            fontSize: 16,
            fontWeight: "600",
            color: colors.primary,
        },
    });
}

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
