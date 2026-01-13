import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { View } from "@/components/theme/Themed";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import Colors from "@/shared-uis/constants/Colors";
import { useTheme } from "@react-navigation/native";

type KYCStatus = "not_started" | "in_progress" | "failed" | "approved";

interface VerificationCardProps {
  kycStatus?: KYCStatus;
  onStartVerification: () => void;
}

const VerificationCard = ({
  kycStatus = "not_started",
  onStartVerification,
}: VerificationCardProps) => {
  const theme = useTheme();
  const colors = Colors(theme);

  const isDisabled = kycStatus === "in_progress";
  const isFailed = kycStatus === "failed";

  const getButtonText = () => {
    if (kycStatus === "failed") return "Resubmit Verification";
    if (kycStatus === "in_progress") return "Verification in Progress";
    return "Start your Profile Verification";
  };

  const getSubtitle = () => {
    if (kycStatus === "failed")
      return "Your verification failed. Please resubmit your details.";
    if (kycStatus === "in_progress")
      return "Your profile verification is currently under review.";
    return "You can only start contract if you are verified.";
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.white }]}>
      <View style={styles.header}>
        <FontAwesomeIcon
          icon={faCheckCircle}
          size={28}
          color="#3B82F6"
        />
        <Text style={styles.title}>Get Verified Now!</Text>
      </View>

      <Text style={styles.subtitle}>{getSubtitle()}</Text>

      {kycStatus !== "approved" && (
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
      )}
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
    borderWidth:1,
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