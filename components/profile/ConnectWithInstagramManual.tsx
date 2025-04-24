import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import { View } from "react-native";
import Button from "../ui/button";

WebBrowser.maybeCompleteAuthSession();

const InstagramLoginButton: React.FC = () => {
  const handleAddAccount = async () => {
    router.push("/add-instagram-manual");
  };

  return (
    <View>
      <Button
        mode="contained"
        style={{ marginVertical: 10, paddingVertical: 5 }}
        onPress={handleAddAccount}
        icon={"instagram"}
        labelStyle={{ color: "white", fontSize: 16 }}
      >
        Add Instagram Account
      </Button>
    </View>
  );
};

export default InstagramLoginButton;
