import React, { useState } from "react";
import { TextInput } from "react-native-paper";
import { useTheme } from "@react-navigation/native";
import { Text, View } from "@/components/theme/Themed";
import { Button } from "react-native-paper";
import { CreateCampaignstylesFn } from "@/styles/profile/TextBox.styles";
import { useLocalSearchParams, useRouter } from "expo-router";
import AppLayout from "@/layouts/app-layout";
import Colors from "@/constants/Colors";

const EditTextArea: React.FC = () => {
  const theme = useTheme();
  const styles = CreateCampaignstylesFn(theme);
  const navigation = useRouter();

  const { title, value: initialValue, path } = useLocalSearchParams();

  const [value, setValue] = useState(initialValue || "");

  const handleNavigate = () => {
    navigation.navigate({
      //@ts-ignore
      pathname: path as string,
      params: { title, value: initialValue },
    });
  };

  const handleSubmit = () => {
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
        <View>
          <Text>{title}</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              position: "relative",
            }}
          >
            <TextInput
              style={{
                width: "100%",
                backgroundColor: Colors(theme).background,
              }}
              mode="outlined"
              value={value as string}
              onChangeText={setValue}
              multiline
              numberOfLines={6}
            />
          </View>
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
