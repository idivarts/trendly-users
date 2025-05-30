import Colors from "@/shared-uis/constants/Colors";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Theme, useTheme } from "@react-navigation/native";
import { Modal, Pressable, StyleSheet } from "react-native";
import { Text, View } from "../theme/Themed";
import Button from "../ui/button";
import TextInput from "../ui/text-input";

interface QuotationModalProps {
  isVisible: boolean;
  quotation: string;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setQuotation: React.Dispatch<React.SetStateAction<string>>;
}

const QuotationModal: React.FC<QuotationModalProps> = ({
  isVisible,
  quotation,
  setIsVisible,
  setQuotation,
}) => {
  const theme = useTheme();
  const styles = stylesFn(theme);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleSubmit = () => {
    setIsVisible(false);
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onDismiss={() => setIsVisible(false)}
      onRequestClose={() => setIsVisible(false)}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Your Quotation</Text>
            <Pressable
              onPress={() => {
                setIsVisible(false);
              }}
            >
              <FontAwesomeIcon
                icon={faClose}
                color={Colors(theme).primary}
                size={24}
              />
            </Pressable>
          </View>
          <TextInput
            activeOutlineColor={Colors(theme).primary}
            contentStyle={{
              color: Colors(theme).text,
            }}
            mode="outlined"
            onChangeText={setQuotation}
            outlineColor={Colors(theme).primary}
            placeholder="Quotation"
            style={styles.input}
            theme={theme}
            value={quotation}
          />
          <View style={styles.buttonContainer}>
            <Button
              mode="outlined"
              onPress={handleClose}
              style={{
                borderColor: Colors(theme).primary,
              }}
              textColor={Colors(theme).primary}
              theme={theme}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleSubmit}
              style={{
                backgroundColor: Colors(theme).primary,
              }}
              theme={theme}
            >
              Submit
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default QuotationModal;

const stylesFn = (theme: Theme) => StyleSheet.create({
  overlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'center',
  },
  modal: {
    backgroundColor: Colors(theme).card,
    borderRadius: 12,
    gap: 16,
    maxWidth: 400,
    padding: 20,
    width: '90%',
  },
  header: {
    alignItems: 'center',
    backgroundColor: Colors(theme).card,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors(theme).card,
    borderColor: Colors(theme).primary,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    backgroundColor: Colors(theme).card,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  subtitle: {
    color: Colors(theme).gray100,
  },
});
