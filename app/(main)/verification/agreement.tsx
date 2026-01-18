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

const AGREEMENT_TEXT = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Vestibulum euismod, nisi vel consectetur interdum, nisl nisi aliquet nunc, vitae egestas nunc nisl eu lectus.
Mauris non tempor quam, et lacinia sapien.
Mauris accumsan eros eget libero posuere vulputate.
Etiam elit elit, elementum sed varius at, adipiscing vitae est.

Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.
`;

const VerificationAgreementScreen = () => {
    const router = useMyNavigation();

    const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false);
    const [agreePan, setAgreePan] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const { user } = useAuthContext();

    const handleScroll = (
        event: NativeSyntheticEvent<NativeScrollEvent>
    ) => {
        const { layoutMeasurement, contentOffset, contentSize } =
            event.nativeEvent;

        const isBottomReached =
            layoutMeasurement.height + contentOffset.y >=
            contentSize.height - 20;

        if (isBottomReached) {
            setHasScrolledToEnd(true);
        }
    };



    const canProceed =
        hasScrolledToEnd && agreePan && agreeTerms;

    const handleSubmit = async () => {
        if (!canProceed || !user?.id) return;

        try {
            await updateDoc(doc(FirestoreDB, "users", user.id), {
                isKYCDone: false,
                kyc: {
                    status: "in_progress",
                    updatedAt: Date.now(),
                },
            });

            // Redirect to profile
            router.replace("/profile");
        } catch (error) {
            console.error("Failed to submit verification", error);
        }
    };

    return (
        <AppLayout>
            <ScreenHeader title="Agreement" />

            {/* AGREEMENT CONTENT */}
            <View style={styles.agreementContainer}>
                <ScrollView
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    showsVerticalScrollIndicator
                >
                    <Text style={styles.agreementText}>
                        {AGREEMENT_TEXT}
                    </Text>
                </ScrollView>
            </View>

            {/* CHECKBOXES + BUTTON */}
            <View style={styles.bottomContainer}>
                <TouchableOpacity
                    style={styles.checkboxRow}
                    onPress={() => setAgreePan(!agreePan)}
                >
                    <View
                        style={[
                            styles.checkbox,
                            agreePan && styles.checked,
                        ]}
                    />
                    <Text style={styles.checkboxText}>
                        I agree to use PAN for my verification
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.checkboxRow}
                    onPress={() => setAgreeTerms(!agreeTerms)}
                >
                    <View
                        style={[
                            styles.checkbox,
                            agreeTerms && styles.checked,
                        ]}
                    />
                    <Text style={styles.checkboxText}>
                        I agree to the Terms & Conditions
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    disabled={!canProceed}
                    style={[
                        styles.button,
                        !canProceed && styles.buttonDisabled,
                    ]}
                    onPress={handleSubmit}
                >
                    <Text style={styles.buttonText}>
                        Proceed
                    </Text>
                </TouchableOpacity>
            </View>
        </AppLayout>
    );
};

const styles = StyleSheet.create({
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