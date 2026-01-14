import { Modal, StyleSheet, Text } from "react-native";
import { View } from "@/components/theme/Themed";
import { Image } from "react-native";

interface Props {
  visible: boolean;
  onClose: () => void;
}

const ProfileVerifiedModal = ({ visible, onClose }: Props) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* <Image
            source={require("../../assets/icons/verfied.png")}
            style={styles.image}
            resizeMode="contain"
          /> */}
          <Text style={styles.title}>Profile Verified !!</Text>
        </View>
      </View>
    </Modal>
  );
};

export default ProfileVerifiedModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    width: "80%",
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
});