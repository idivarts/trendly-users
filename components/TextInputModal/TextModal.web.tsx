import React, { FC, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
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
            <Button mode="text" onPress={handleClose} style={styles.button}>
              Cancel
            </Button>
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    alignSelf: "center",
    width: "80%",
  },
  modalContent: {
    flexDirection: "column",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#333",
  },
  textInput: {
    backgroundColor: "#f9f9f9",
    padding: 10,
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
