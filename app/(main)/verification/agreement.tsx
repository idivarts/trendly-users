import { View } from "@/components/theme/Themed";
import ScreenHeader from "@/components/ui/screen-header";
import { useAuthContext, useKYCFlowContext } from "@/contexts";
import AppLayout from "@/layouts/app-layout";
import { createRazorpayRouteAccount } from "@/shared-libs/utils/kyc-api";
import { useMyNavigation } from "@/shared-libs/utils/router";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    NativeScrollEvent,
    NativeSyntheticEvent,
} from "react-native";

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
    const [submitting, setSubmitting] = useState(false);
    const { user } = useAuthContext();
    const { draft, setAgreements, reset } = useKYCFlowContext();

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
        hasScrolledToEnd &&
        draft.agreements.panConsent &&
        draft.agreements.termsConsent &&
        !submitting;

    const validateDraft = () => {
        if (
            !draft.panDetails.nameAsPerPAN.trim() ||
            !draft.panDetails.panNumber.trim()
        ) {
            throw new Error("Please complete PAN details before proceeding.");
        }
        if (
            !draft.currentAddress.street.trim() ||
            !draft.currentAddress.city.trim() ||
            !draft.currentAddress.state.trim() ||
            !draft.currentAddress.postalCode.trim()
        ) {
            throw new Error("Please complete address details before proceeding.");
        }
        if (
            !draft.bankDetails.accountNumber.trim() ||
            !draft.bankDetails.ifsc.trim() ||
            !draft.bankDetails.beneficiaryName.trim()
        ) {
            throw new Error("Please complete bank details before proceeding.");
        }
    };

    const handleSubmit = async () => {
        if (!canProceed || !user?.id) return;

        try {
            setSubmitting(true);
            validateDraft();

            const streetCombined = [
                draft.currentAddress.street.trim(),
                draft.currentAddress.line2?.trim(),
            ]
                .filter(Boolean)
                .join(", ");

            const routeAccountResponse = await createRazorpayRouteAccount({
                name: draft.panDetails.nameAsPerPAN.trim(),
                pan: draft.panDetails.panNumber.trim(),
                address: {
                    street: streetCombined,
                    city: draft.currentAddress.city.trim(),
                    state: draft.currentAddress.state.trim(),
                    postal_code: draft.currentAddress.postalCode.trim(),
                },
                bank: {
                    account_number: draft.bankDetails.accountNumber.trim(),
                    ifsc: draft.bankDetails.ifsc.trim(),
                    beneficiary_name: draft.bankDetails.beneficiaryName.trim(),
                },
                reCreateAccount: user.kyc?.status === "failed",
            });

            const accountId = String(
                routeAccountResponse.accountId ?? user.kyc?.accountId ?? ""
            );
            const stakeHolderId = String(
                routeAccountResponse.stakeholderId ??
                    user.kyc?.stakeHolderId ??
                    ""
            );
            const productId = String(
                routeAccountResponse.productId ?? user.kyc?.productId ?? ""
            );

            // Firestore user document is now updated only by backend
            // after KYC account creation. Frontend no longer writes
            // any KYC data directly.

            await reset();
            router.replace("/profile");
        } catch (error) {
            console.error("Failed to submit verification", error);
            Toaster.error((error as Error)?.message || "Failed to submit verification.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AppLayout>
            <ScreenHeader title="Agreement" />

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
                    style={styles.checkboxRow}
                    onPress={() =>
                        setAgreements({
                            termsConsent: !draft.agreements.termsConsent,
                        })
                    }
                >
                    <View
                        style={[
                            styles.checkbox,
                            draft.agreements.termsConsent && styles.checked,
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
                        {submitting ? "Submitting..." : "Proceed"}
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
