import React, { useRef, useState } from "react";
import { useTheme } from "@react-navigation/native";
import { Text, View } from "@/components/theme/Themed";
import { Appbar, Button } from "react-native-paper";
import { CreateCampaignstylesFn } from "@/styles/profile/TextBox.styles";
import { useLocalSearchParams, useRouter } from "expo-router";
import AppLayout from "@/layouts/app-layout";
import Colors from "@/constants/Colors";
import { RichEditor, RichToolbar } from "react-native-pell-rich-editor";
import Component from "@/components/textbox-rtf/TextBox";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import Toast from "react-native-toast-message";
import { Pressable } from "react-native";

const EditTextArea: React.FC = () => {
  const theme = useTheme();
  const styles = CreateCampaignstylesFn(theme);
  const navigation = useRouter();
  const richText = useRef<RichEditor>(null);

  const {
    title,
    value: initialValue,
    path,
    placeholder,
  } = useLocalSearchParams();

  const [value, setValue] = useState(initialValue || "");

  const handleSubmit = () => {
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
