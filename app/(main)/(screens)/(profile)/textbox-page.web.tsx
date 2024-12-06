import React, { useRef, useState } from "react";
import { useTheme } from "@react-navigation/native";
import { Text, View } from "@/components/theme/Themed";
import { Button } from "react-native-paper";
import { CreateCampaignstylesFn } from "@/styles/profile/TextBox.styles";
import { useLocalSearchParams, useRouter } from "expo-router";
import AppLayout from "@/layouts/app-layout";
import Colors from "@/constants/Colors";
import { RichEditor, RichToolbar } from "react-native-pell-rich-editor";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Platform } from "react-native";
import { useAuthContext } from "@/contexts";
import { User } from "@/types/User";
import Toaster from "@/shared-uis/components/toaster/Toaster";

const EditTextArea: React.FC = () => {
  const theme = useTheme();
  const styles = CreateCampaignstylesFn(theme);
  const navigation = useRouter();
  const richText = useRef<RichEditor>(null);

  const {
    userProfile,
    key,
    title,
    value: initialValue,
    path,
  } = useLocalSearchParams();

  const [value, setValue] = useState(initialValue || "");

  const handleNavigate = () => {
    navigation.navigate({
      //@ts-ignore
      pathname: path as string,
      params: { title, value: initialValue },
    });
  };

  const {
    user,
    updateUser,
  } = useAuthContext();

  const handleUpdateProfileContent = async () => {
    if (!user) return;

    const updatedContent: User = {
      ...user,
      profile: {
        ...user.profile,
        content: {
          ...user?.profile?.content,
          [key as string]: value,
        },
      },
    };

    await updateUser(user.id, updatedContent).then(() => {
      navigation.replace("/edit-profile");
      Toaster.success(`${title ? title : 'Profile'} updated successfully`);
    });
  }

  const handleSubmit = () => {
    if (userProfile === 'true') {
      handleUpdateProfileContent();
      return;
    }

    const valueToSubmit = {
      textbox: {
        title,
        value,
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
            <ReactQuill
              theme="snow"
              value={value as string}
              onChange={setValue}
              placeholder="Start writing here..."
              style={{
                flexGrow: 1,
                backgroundColor: Colors(theme).background,
                height: 200,
                marginTop: 10,
              }}
            />
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
