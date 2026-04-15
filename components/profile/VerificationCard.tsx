import { View } from "@/components/theme/Themed";
import Colors from "@/shared-uis/constants/Colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useTheme } from "@react-navigation/native";
import { useMemo } from "react";
import { Linking, StyleSheet, Text, TouchableOpacity } from "react-native";
import { KYCStatus } from "../../shared-libs/firestore/trendly-pro/models/users";

interface VerificationCardProps {
    kycStatus?: KYCStatus;
    onStartVerification: () => void;
    onCheckStatus?: () => Promise<void> | void;
    influencerEmail?: string | null;
    influencerKycAccountId?: string | null;
    influencerUserId?: string | null;
}

const VerificationCard = ({
    kycStatus,
    onStartVerification,
    onCheckStatus,
    influencerEmail,
    influencerKycAccountId,
    influencerUserId,
}: VerificationCardProps) => {
    const status: KYCStatus = kycStatus ?? KYCStatus.NotStarted;

    if (status === KYCStatus.Activated) {
        return null;
    }
    const theme = useTheme();
    const colors = Colors(theme);
    const styles = useMemo(() => createStyles(colors), [colors]);

    const isCheckingAllowed =
        status === KYCStatus.InProgress || status === KYCStatus.UnderReview;
    const isDisabled = false;
    const needsSupport =
        status === KYCStatus.Rejected || status === KYCStatus.NeedsClarification;

    const getButtonText = () => {
        if (needsSupport) return "Contact Support";
        if (isCheckingAllowed) return "Check Status Now";
        return "Start your Profile Verification";
    };

    const getSubtitle = () => {
        if (status === KYCStatus.Rejected)
            return "Your verification failed. Contact support to resolve this quickly.";
        if (status === KYCStatus.NeedsClarification)
            return "We need clarification on your details. Contact support and we’ll help you complete verification.";
        if (status === KYCStatus.InProgress)
            return "Your profile verification is currently being processed.";
        if (status === KYCStatus.UnderReview)
            return "Your profile verification is under review.";
        return "You can only start contract if you are verified.";
    };

    const handlePress = async () => {
        if (isCheckingAllowed) {
            await onCheckStatus?.();
            return;
        }
        if (!needsSupport) {
            onStartVerification();
            return;
        }

        const subject = "Trendly KYC Support Request";
        const body = [
            "Hi Trendly Support,",
            "",
            "I need help with my KYC verification.",
            "",
            "Influencer Email: " + (influencerEmail ?? ""),
            "Influencer KYC Account Id: " + (influencerKycAccountId ?? ""),
            "Influencer User Id: " + (influencerUserId ?? ""),
            "",
            "Issue description:",
            "- (Please describe what happened / what you need help with)",
            "",
            "Thanks,",
        ].join("\n");

        const url =
            "mailto:support@trendly.now" +
            "?subject=" +
            encodeURIComponent(subject) +
            "&body=" +
            encodeURIComponent(body);

        try {
            const ok = await Linking.canOpenURL(url);
            if (ok) {
                await Linking.openURL(url);
            }
        } catch {
            // Best-effort: if Linking fails, do nothing (avoids breaking navigation flows).
        }
    };

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <MaterialIcons name="verified" size={28} color={colors.primary} />
                <Text style={styles.title}>
                    {isCheckingAllowed ? "Verification in progress" : "Get Verified Now!"}
                </Text>
            </View>

            <Text style={styles.subtitle}>{getSubtitle()}</Text>

            <TouchableOpacity
                disabled={isDisabled}
                onPress={handlePress}
                style={[
                    styles.button,
                    isDisabled && styles.buttonDisabled,
                ]}
            >
                <Text style={styles.buttonText}>{getButtonText()}</Text>
            </TouchableOpacity>
        </View>
    );
};

function createStyles(colors: ReturnType<typeof Colors>) {
    return StyleSheet.create({
        card: {
            borderRadius: 16,
            padding: 16,
            marginHorizontal: 16,
            marginTop: 12,
            elevation: 2,
            borderWidth: 1,
            borderColor: colors.outline,
            backgroundColor: colors.card,
        },
        header: {
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            marginBottom: 8,
        },
        title: {
            fontSize: 18,
            fontWeight: "600",
            color: colors.text,
        },
        subtitle: {
            fontSize: 14,
            lineHeight: 20,
            color: colors.subtitleGray,
            marginBottom: 16,
        },
        button: {
            backgroundColor: colors.primary,
            paddingVertical: 14,
            borderRadius: 12,
            alignItems: "center",
        },
        buttonDisabled: {
            opacity: 0.6,
        },
        buttonText: {
            color: colors.onPrimary,
            fontSize: 15,
            fontWeight: "600",
        },
    });
}

export default VerificationCard;