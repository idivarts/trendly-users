import { Text, View } from "@/components/theme/Themed";
import stylesFn from "@/styles/modal/ConfirmationModal.styles";
import { useTheme } from "@react-navigation/native";
import { Modal } from "react-native";
import Button from "../button";

interface ConfirmationModalProps {
  animationType?: "none" | "slide" | "fade";
  cancelAction: () => void;
  cancelText?: string;
  confirmAction: () => void;
  confirmText?: string;
  title?: string,
  description?: string;
  loading?: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  visible: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  animationType = "fade",
  cancelAction,
  cancelText = "Cancel",
  confirmAction,
  loading = false,
  confirmText = "Confirm",
  title,
  description = "Are you sure?",
  setVisible,
  visible,
}) => {
  const theme = useTheme();
  const styles = stylesFn(theme);

  const handleConfirm = () => {
    confirmAction();
  }

  const handleCancel = () => {
    cancelAction();
  }

  return (
    <Modal
      animationType={animationType}
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        setVisible(false);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {!!title &&
            <Text style={styles.modalTitle}>{title}</Text>}
          <Text style={styles.modalText}>{description}</Text>
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={handleConfirm}
              style={styles.button}
              loading={loading} // You can manage loading state if needed
            >
              {confirmText}
            </Button>
            <Button
              mode="contained"
              onPress={handleCancel}
              style={styles.buttonSecondary}
            >
              <Text style={styles.secondaryText}>{cancelText}</Text>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmationModal;
