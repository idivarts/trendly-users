import React, { FC, useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Modal, Portal, TextInput, Button, Text } from "react-native-paper";

interface TextModalProps {
  isOpen: boolean;
  onClose: () => void;
  value: string;
  placeholder: string;
  title: string;
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
            style={styles.textInput}
            multiline
            numberOfLines={20}
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
