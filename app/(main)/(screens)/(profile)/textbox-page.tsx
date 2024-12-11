import React, { useRef, useState } from "react";
import { useTheme } from "@react-navigation/native";
import { Text, View } from "@/components/theme/Themed";
import { Appbar } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import AppLayout from "@/layouts/app-layout";
import Colors from "@/constants/Colors";
import { RichEditor, RichToolbar } from "react-native-pell-rich-editor";
import Component from "@/components/textbox-rtf/TextBox";
import { useAuthContext } from "@/contexts";
import { User } from "@/types/User";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import Toast from "react-native-toast-message";
import { Pressable } from "react-native";
import { calculateProfileCompletion } from "@/utils/profile";
import { Profile } from "@/types/Profile";

const EditTextArea: React.FC = () => {
  const theme = useTheme();
  const navigation = useRouter();
  const richText = useRef<RichEditor>(null);

  const {
    userProfile,
    key,
    title,
    value: initialValue,
    path,
    placeholder,
  } = useLocalSearchParams();

  const [value, setValue] = useState(initialValue || "");

  const handleNavigate = () => {
    navigation.navigate({
      //@ts-ignore
      pathname: path as string,
      params: { title, value: initialValue },
    });
  };

  const { user, updateUser } = useAuthContext();

  const handleUpdateProfileContent = async () => {
    if (!user || !user.profile) return;

    const content = {
      ...user.profile.content,
      [key as string]: value,
    };

    const percentage = calculateProfileCompletion({
      name: user.name,
      emailVerified: user.emailVerified,
      phoneVerified: user.phoneVerified,
      category: user.profile.category || [],
      content: content as Profile["content"],
      attachments: user.profile.attachments as Profile["attachments"],
    });

    const updatedContent: User = {
      ...user,
      profile: {
        ...user.profile,
        completionPercentage: percentage,
        content: {
          ...user?.profile?.content,
          [key as string]: value,
        },
      },
    };

    await updateUser(user.id, updatedContent).then(() => {
      navigation.navigate("/edit-profile");
      Toaster.success(`${title ? title : 'Profile'} updated successfully`);
    });
  };

  const handleSubmit = () => {
    if (userProfile === "true") {
      handleUpdateProfileContent();
      return;
    }

    if (!value) {
      Toaster.error("Please enter a value");
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
      <Appbar.Header
        style={{ backgroundColor: Colors(theme).background }}
        statusBarHeight={0}
      >
        <Appbar.BackAction onPress={handleGoBack} />
        <Appbar.Content title={title} />
        <Pressable
          onPress={handleSubmit}
          style={{
            paddingRight: 20,
          }}
        >
          <Text style={{ color: Colors(theme).primary, fontSize: 16 }}>
            Done
          </Text>
        </Pressable>
      </Appbar.Header>
      <Toast />
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
          <Component
            value={value as string}
            setValue={setValue}
            richText={richText}
            placeholder={placeholder}
          />
        </View>
      </View>
    </AppLayout>
  );
};

export default EditTextArea;
