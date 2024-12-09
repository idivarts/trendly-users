import React from "react";
import { useTheme } from "@react-navigation/native";
import Colors from "@/constants/Colors";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ScrollView } from "react-native";
import AppLayout from "@/layouts/app-layout";

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

  return (
    <ScrollView style={{ flex: 1 }}>
      <ReactQuill
        theme="snow"
        value={value as string}
        onChange={setValue}
        placeholder={placeholder}
        style={{
          flexGrow: 1,
          backgroundColor: Colors(theme).background,
          marginTop: 10,
        }}
      />
    </ScrollView>
  );
};
export default EditTextAreaComponent;
