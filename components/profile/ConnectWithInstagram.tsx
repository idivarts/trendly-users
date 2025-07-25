import { IS_BETA_ENABLED } from "@/constants/App";
import { FB_APP_ID as fbid } from "@/constants/Facebook";
import { useInitialUserData } from "@/constants/User";
import { useInstagramLogin } from "@/hooks/requests";
import { Console } from "@/shared-libs/utils/console";
import { AuthApp } from "@/shared-libs/utils/firebase/auth";
import { FirestoreDB } from "@/shared-libs/utils/firebase/firestore";
import { HttpWrapper } from "@/shared-libs/utils/http-wrapper";
import * as WebBrowser from "expo-web-browser";
import React, { useState } from "react";
import { Platform, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import Button from "../ui/button";
;
;
;
;

WebBrowser.maybeCompleteAuthSession();

const InstagramLoginButton: React.FC = () => {
  const FB_APP_ID = fbid;
  const [isLoading, setIsLoading] = useState(false);
  const user = AuthApp.currentUser;
  const INITIAL_DATA = useInitialUserData();

  const { instagramLogin } = useInstagramLogin(AuthApp, FirestoreDB, INITIAL_DATA, () => { }, () => { }, (code) => {
    handleAddAccount(code);
  });


  const handleAddAccount = async (accessToken: string) => {
    setIsLoading(true);
    try {
      const token = await user?.getIdToken();
      await HttpWrapper.fetch("/api/v2/socials/instagram", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: accessToken,
          redirect_type: Platform.OS === "web" ? "2" : "3",
        }),
      })
      setIsLoading(false);
    } catch (error) {
      Console.error(error, "Error adding Instagram account");
      setIsLoading(false);
    }
  };

  if (!IS_BETA_ENABLED)
    return null;

  return (
    <View>
      {isLoading ? (
        <ActivityIndicator
          animating={true}
          size="large"
          style={{ marginVertical: 10 }}
        />
      ) : (
        <Button
          mode="contained"
          style={{ marginVertical: 10, paddingVertical: 5 }}
          onPress={instagramLogin}
          icon={"instagram"}
          labelStyle={{ color: "white", fontSize: 16 }}
        >
          Add Instagram Account
        </Button>
      )}
    </View>
  );
};

export default InstagramLoginButton;
