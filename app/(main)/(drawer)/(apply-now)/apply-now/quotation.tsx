import React, { useState } from "react";
import { useTheme } from "@react-navigation/native";
import { Text, View } from "@/components/theme/Themed";
import { Appbar } from "react-native-paper";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import AppLayout from "@/layouts/app-layout";
import Colors from "@/constants/Colors";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import Toast from "react-native-toast-message";
import { Pressable } from "react-native";
import TextInput from "@/components/ui/text-input";

const Quotation: React.FC = () => {
  const theme = useTheme();
  const navigation = useRouter();

  const {
    title,
    value: initialValue,
    path,
    selectedFiles,
    profileAttachments,
    placeholder,
    timelineData,
    note,
    fileAttachments,
    originalAttachments,
    collaborationId,
    answers,
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

    router.push({
      //@ts-ignore
      pathname: path as string,
      params: {
        value: JSON.stringify(valueToSubmit),
        selectedFiles,
        profileAttachments,
        timelineData,
        originalAttachments,
        note,
        collaborationId,
        fileAttachments,
        answers,
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
          }}
        >
          <Text>{title}</Text>
          <TextInput
            value={value as string}
            onChangeText={setValue}
            autoFocus
            placeholder={placeholder as string}
            keyboardType="numeric"
          />
        </View>
      </View>
    </AppLayout>
  );
};

export default Quotation;