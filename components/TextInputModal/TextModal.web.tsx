import Colors from "@/shared-uis/constants/Colors";
import { Theme, useTheme } from "@react-navigation/native";
import React, { FC, useEffect, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { Modal, Portal, Text } from "react-native-paper";
import Button from "../ui/button";
import TextInput from "../ui/text-input";

interface TextModalProps {
  isOpen: boolean;
  onClose: () => void;
  value: string;
  placeholder: string;
  title: string;
  type?: string;
  onSubmit: (value: string) => void;
}

export const TextModal: FC<TextModalProps> = ({ ...props }) => {
  const [text, setText] = useState(props.value);
  const theme = useTheme();
  const styles = stylesFn(theme);

  const handleClose = () => {
    setText(props.value);
    props.onClose();
  };

  const handleSave = () => {
    props.onSubmit(text);
    setText("");
    props.onClose();
  };

  useEffect(() => {
    setText(props.value);
  }, [props.value]);

  return (
    <Portal>
      <Modal
        visible={props.isOpen}
        onDismiss={props.onClose}
        style={styles.modal}
        contentContainerStyle={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{props.title}</Text>
          <TextInput
            mode="outlined"
            placeholder={props.placeholder}
            value={text}
            onChangeText={setText}
            keyboardType={props.type == "text" ? "default" : "numeric"}
            inputMode={props.type == "text" ? "text" : "numeric"}
            style={styles.textInput}
            multiline={props.type == "text" ? true : false}
            numberOfLines={props.type == "text" ? 20 : 1}
          />
          <View style={styles.buttonContainer}>
            <Button mode="contained" onPress={handleSave} style={styles.button}>
              Save
            </Button>
            <Button mode="outlined" onPress={handleClose} style={styles.button}>
              Cancel
            </Button>
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

const stylesFn = (theme: Theme) => StyleSheet.create({
  modal: {
    backgroundColor: Colors(theme).backdrop, // Semi-transparent background
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: Colors(theme).modalBackground,
    borderRadius: 12,
    padding: 16,
    alignSelf: "center",
    width: "95%",
    ...(Platform.OS === "web" && {
      maxWidth: 600, // Limit width on web
    })
  },
  modalContent: {
    flexDirection: "column"
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "left",
    color: Colors(theme).text,
  },
  textInput: {
    // backgroundColor: "#f9f9f9",
    // padding: 10,
    borderRadius: 8,
    fontSize: 16,
    textAlignVertical: "top",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    marginHorizontal: 5,
    flex: 1,
  },
});
