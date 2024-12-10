import React, { useEffect } from "react";
import { useTheme } from "@react-navigation/native";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { RichText, Toolbar, useEditorBridge } from "@10play/tentap-editor";

interface EditTextAreaProps {
  value: string;
  setValue: (value: string) => void;
  richText?: any;
  placeholder?: string;
}

const EditTextAreaComponent: React.FC<EditTextAreaProps> = ({
  value,
  setValue,
  richText,
  placeholder,
}) => {
  const theme = useTheme();

  // Initialize the editor
  const editor = useEditorBridge({
    autofocus: true,
    avoidIosKeyboard: true,
    initialContent: value,
    onChange: () => {
      editor.getHTML().then((html: string) => {
        setValue(html);
      });
    },
  });

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{
        flexGrow: 1,
      }}
    >
      <RichText editor={editor} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "web" ? "padding" : "height"}
      >
        <Toolbar editor={editor} />
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export default EditTextAreaComponent;
