import { View } from "@/components/theme/Themed";
import Colors from "@/shared-uis/constants/Colors";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from "@react-navigation/native";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { KYCStatus } from "../../shared-libs/firestore/trendly-pro/models/users";



interface VerificationCardProps {
    kycStatus?: KYCStatus;
    onStartVerification: () => void;
}

const VerificationCard = ({
    kycStatus,
    onStartVerification,
}: VerificationCardProps) => {
    const status: KYCStatus = kycStatus ?? KYCStatus.NotStarted;

    if (status === KYCStatus.Activated) {
        return null;
    }
    const theme = useTheme();
    const colors = Colors(theme);

    const isDisabled =
        status === KYCStatus.InProgress || status === KYCStatus.UnderReview;
    const needsResubmit =
        status === KYCStatus.Rejected || status === KYCStatus.NeedsClarification;

    const getButtonText = () => {
        if (needsResubmit) return "Resubmit Verification";
        if (status === KYCStatus.InProgress) return "Verification in Progress";
        if (status === KYCStatus.UnderReview) return "Verification Under Review";
        return "Start your Profile Verification";
    };

    const getSubtitle = () => {
        if (status === KYCStatus.Rejected)
            return "Your verification was rejected. Please resubmit your details.";
        if (status === KYCStatus.NeedsClarification)
            return "We need additional information. Please update your details.";
        if (status === KYCStatus.InProgress)
            return "Your profile verification is currently in progress.";
        if (status === KYCStatus.UnderReview)
            return "Your profile verification is under review.";
        return "You can only start contract if you are verified.";
    };

    return (
        <View style={[styles.card, { backgroundColor: colors.white }]}>
            <View style={styles.header}>
                <MaterialIcons name="verified" size={28} color="#3B82F6" />
                <Text style={styles.title}>Get Verified Now!</Text>
            </View>

            <Text style={styles.subtitle}>{getSubtitle()}</Text>

            <TouchableOpacity
                disabled={isDisabled}
                onPress={onStartVerification}
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

const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        padding: 16,
        marginHorizontal: 16,
        marginTop: 12,
        elevation: 2,
        borderWidth: 1,
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
    },
    subtitle: {
        fontSize: 14,
        lineHeight: 20,
        color: "#6B7280",
        marginBottom: 16,
    },
    button: {
        backgroundColor: "#111827",
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "600",
    },
});

export default VerificationCard;