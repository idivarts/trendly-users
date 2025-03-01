import { FB_APP_ID as fbid } from "@/constants/Facebook";
import { INITIAL_USER_DATA } from "@/constants/User";
import { useInstagramLogin } from "@/hooks/requests";
import { AuthApp } from "@/utils/auth";
import { FirestoreDB } from "@/utils/firestore";
import axios from "axios";
import * as WebBrowser from "expo-web-browser";
import React, { useState } from "react";
import { Platform, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import Button from "../ui/button";

interface FacebookLoginButtonProps {
  onFacebookLogin: (userId: string | null) => void;
  isConnected?: boolean;
}

WebBrowser.maybeCompleteAuthSession();

const InstagramLoginButton: React.FC<FacebookLoginButtonProps> = () => {
  const FB_APP_ID = fbid;
  const [isLoading, setIsLoading] = useState(false);
  const user = AuthApp.currentUser;

  const { instagramLogin } = useInstagramLogin(AuthApp, FirestoreDB, INITIAL_USER_DATA, () => { }, () => { }, (code) => {
    handleAddAccount(code);
  });


  const handleAddAccount = async (accessToken: string) => {
    setIsLoading(true);
    try {
      const token = await user?.getIdToken();
      await axios
        .post(
          "https://be.trendly.pro/api/v1/socials/instagram",
          {
            code: accessToken,
            redirect_type: Platform.OS === "web" ? "2" : "3",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(async (response) => { });
      setIsLoading(false);
    } catch (error) {
      console.log("Error adding Instagram account: ", error);
      setIsLoading(false);
    }
  };

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
