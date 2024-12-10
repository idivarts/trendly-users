import React from "react";
import { useTheme } from "@react-navigation/native";
import { Text, View } from "@/components/theme/Themed";
import { Button } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import AppLayout from "@/layouts/app-layout";
import { KeyboardAvoidingView, Platform } from "react-native";
import { useAuthContext } from "@/contexts";
import { User } from "@/types/User";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import { RichText, Toolbar, useEditorBridge } from "@10play/tentap-editor";

const EditTextArea: React.FC = () => {
  const theme = useTheme();
  const navigation = useRouter();

  const {
    userProfile,
    key,
    title,
    value: initialValue,
    path,
  } = useLocalSearchParams();

  const editor = useEditorBridge({
    autofocus: true,
    avoidIosKeyboard: true,
    initialContent: initialValue,
  });

  const { user, updateUser } = useAuthContext();

  const handleUpdateProfileContent = async () => {
    if (!user) return;

    const updatedValue = await editor.getHTML();

    const updatedContent: User = {
      ...user,
      profile: {
        ...user.profile,
        content: {
          ...user?.profile?.content,
          [key as string]: updatedValue,
        },
      },
    };

    await updateUser(user.id, updatedContent).then(() => {
      navigation.replace("/edit-profile");
      Toaster.success(`${title ? title : "Profile"} updated successfully`);
    });
  };

  const handleSubmit = async () => {
    if (userProfile === "true") {
      handleUpdateProfileContent();
      return;
    }

    const updatedValue = await editor.getHTML();

    const valueToSubmit = {
      textbox: {
        title,
        value: updatedValue,
      },
    };

    navigation.navigate({
      //@ts-ignore
      pathname: path as string,
      params: {
        value: JSON.stringify(valueToSubmit),
      },
    });
  };

  const handleGoBack = () => {
    navigation.back();
  };

  return (
    <AppLayout>
      <View
        style={{
          padding: 20,
          justifyContent: "space-between",
          flex: 1,
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "space-between",
          }}
        >
          <Text>{title}</Text>
          {Platform.OS === "web" && (
            <>
              <RichText editor={editor} />
              <KeyboardAvoidingView
                behavior={Platform.OS === "web" ? "padding" : "height"}
              >
                <Toolbar editor={editor} />
              </KeyboardAvoidingView>
            </>
          )}
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 20,
          }}
        >
          <Button mode="outlined" onPress={handleGoBack} style={{ flex: 0.45 }}>
            Go Back
          </Button>

          <Button
            mode="contained"
            onPress={handleSubmit}
            style={{ flex: 0.45 }}
          >
            Submit
          </Button>
        </View>
      </View>
    </AppLayout>
  );
};

export default EditTextArea;
