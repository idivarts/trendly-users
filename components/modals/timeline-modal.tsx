import Colors from "@/constants/Colors";
import { Theme, useTheme } from "@react-navigation/native";
import { Modal, Pressable, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

import { Text, View } from "../theme/Themed";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import Button from "../ui/button";
import Toaster from "@/shared-uis/components/toaster/Toaster";

interface TimelineModalProps {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setTimeline: React.Dispatch<React.SetStateAction<Date | null>>;
  timeline: Date | null;
}

const TimelineModal: React.FC<TimelineModalProps> = ({
  isVisible,
  setIsVisible,
  setTimeline,
  timeline,
}) => {
  const theme = useTheme();
  const styles = stylesFn(theme);

  const onDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setTimeline(selectedDate);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleSubmit = () => {
    if (!timeline) {
      Toaster.error('Please select a date');
      return;
    }
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
            <Text style={styles.title}>Your Timeline</Text>
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
          <DateTimePicker
            display="spinner"
            mode="date"
            onChange={onDateChange}
            value={timeline || new Date()}
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

export default TimelineModal;

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
