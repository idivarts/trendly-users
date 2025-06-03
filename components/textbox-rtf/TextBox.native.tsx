import AppLayout from "@/layouts/app-layout";
import Colors from "@/shared-uis/constants/Colors";
import { useTheme } from "@react-navigation/native";
import React, { useEffect } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View
} from "react-native";
import { RichEditor, RichToolbar } from "react-native-pell-rich-editor";

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

  useEffect(() => {
    const timeout = setTimeout(() => {
      richText.current?.focusContentEditor();
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <AppLayout>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 180 : 0}
      >
        <View
          style={[
            styles.toolbarWrapper,
            { backgroundColor: Colors(theme).card },
          ]}
        ></View>
        <ScrollView
          contentContainerStyle={styles.scrollView}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.editorContainer}>
            <RichEditor
              ref={richText}
              initialContentHTML={(value as string) || ""}
              onChange={setValue}
              placeholder={placeholder}
              style={[
                styles.editor,
                { backgroundColor: Colors(theme).background },
              ]}
              editorStyle={{
                backgroundColor: Colors(theme).background,
              }}
              initialFocus={true}
            />
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={{ position: "absolute", width: "100%", bottom: 0 }}
            >
              <RichToolbar
                editor={richText}
                selectedIconTint={Colors(theme).primary}
                disabledIconTint={Colors(theme).gray100}
                style={styles.toolbar}
              />
            </KeyboardAvoidingView>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
  },
  editorContainer: {
    flex: 1,
  },
  editor: {
    flex: 1,
    borderWidth: 0.2,
  },
  toolbarWrapper: {
    width: "100%",
  },
  toolbar: {
    height: 44,
  },
});

export default EditTextAreaComponent;
