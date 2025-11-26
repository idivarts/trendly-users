// import { RichText, Toolbar, useEditorBridge } from "@10play/tentap-editor";
import { useTheme } from "@react-navigation/native";
import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";

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
  // const editor = useEditorBridge({
  //   autofocus: true,
  //   avoidIosKeyboard: true,
  //   initialContent: value,
  //   onChange: () => {
  //     editor.getHTML().then((html: string) => {
  //       const textOnly = html.replace(/<[^>]*>/g, "").trim();
  //       const isEmpty = textOnly === "";

  //       if (isEmpty) {
  //         setValue("");
  //       } else {
  //         setValue(html);
  //       }
  //     });
  //   },
  // });

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{
        flexGrow: 1,
      }}
    >
      {/* <RichText editor={editor} /> */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "web" ? "padding" : "height"}
      >
        {/* <Toolbar editor={editor} /> */}
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export default EditTextAreaComponent;
