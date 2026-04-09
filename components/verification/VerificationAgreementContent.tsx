import { View } from "@/components/theme/Themed";
import { useAuthContext, useKYCFlowContext } from "@/contexts";
import { createRazorpayRouteAccount } from "@/shared-libs/utils/kyc-api";
import { useMyNavigation } from "@/shared-libs/utils/router";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import Colors from "@/shared-uis/constants/Colors";
import { useTheme } from "@react-navigation/native";
import { useMemo, useState } from "react";
import {
    NativeScrollEvent,
    NativeSyntheticEvent,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
} from "react-native";

import { createVerificationFormStyles } from "./verificationFormStyles";

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

function createAgreementAreaStyles(colors: ReturnType<typeof Colors>) {
    return StyleSheet.create({
        agreementContainer: {
            margin: 16,
            backgroundColor: colors.tag,
            borderRadius: 12,
            padding: 12,
            height: 300,
        },
        agreementText: {
            fontSize: 14,
            lineHeight: 20,
            color: colors.text,
        },
    });
}

const VerificationAgreementContent = () => {
    const router = useMyNavigation();
    const theme = useTheme();
    const colors = Colors(theme);
    const styles = useMemo(
        () => createVerificationFormStyles(colors),
        [colors]
    );
    const agreementStyles = useMemo(
        () => createAgreementAreaStyles(colors),
        [colors]
    );

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
            throw new Error(
                "Please complete address details before proceeding."
            );
        }
        if (
            !draft.bankDetails.accountNumber.trim() ||
            !draft.bankDetails.ifsc.trim() ||
            !draft.bankDetails.beneficiaryName.trim()
        ) {
            throw new Error(
                "Please complete bank details before proceeding."
            );
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

            await createRazorpayRouteAccount({
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

            await reset();
            router.replace("/profile");
        } catch (error) {
            console.error("Failed to submit verification", error);
            Toaster.error(
                (error as Error)?.message || "Failed to submit verification."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <View style={agreementStyles.agreementContainer}>
                <ScrollView
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    showsVerticalScrollIndicator
                >
                    <Text style={agreementStyles.agreementText}>
                        {AGREEMENT_TEXT}
                    </Text>
                </ScrollView>
            </View>

            <View style={styles.bottomContainerGap}>
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
                        styles.buttonWithTopMargin,
                        !canProceed && styles.buttonDisabled,
                    ]}
                    onPress={handleSubmit}
                >
                    <Text style={styles.buttonText}>
                        {submitting ? "Submitting..." : "Proceed"}
                    </Text>
                </TouchableOpacity>
            </View>
        </>
    );
};

export default VerificationAgreementContent;
