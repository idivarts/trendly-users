import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, ActivityIndicator } from "react-native-paper";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { Platform, View } from "react-native";
import { FB_APP_ID as fbid } from "@/constants/Facebook";
import { AuthApp } from "@/utils/auth";

interface FacebookLoginButtonProps {
  onFacebookLogin: (userId: string | null) => void;
  isConnected?: boolean;
}

WebBrowser.maybeCompleteAuthSession();

const InstagramLoginButton: React.FC<FacebookLoginButtonProps> = () => {
  const FB_APP_ID = fbid;
  const [isLoading, setIsLoading] = useState(false);
  const user = AuthApp.currentUser;

  const authUrl = `https://be.trendly.pro/instagram`;

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: FB_APP_ID,
      redirectUri: AuthSession.makeRedirectUri({
        native: `fb${FB_APP_ID}://authorize`,
      }),
    },
    {
      authorizationEndpoint: `${authUrl}?redirect_type=${
        Platform.OS === "web" ? 1 : 3
      }&`,
    }
  );

  const handleInstagramSignIn = async () => {
    await promptAsync();
  };

  useEffect(() => {
    if (response?.type === "success" || response?.type === "error") {
      const { code } = response.params;
      if (code) {
        handleAddAccount(code);
      } else {
        console.log("Instagram login failed. Please try again.");
      }
    }
  }, [response]);

  const handleAddAccount = async (accessToken: string) => {
    setIsLoading(true);
    try {
      const token = await user?.getIdToken();
      await axios
        .post(
          "https://be.trendly.pro/api/v1/socials/instagram",
          {
            code: accessToken,
            redirect_type: Platform.OS === "web" ? "1" : "3",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(async (response) => {});
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
          onPress={handleInstagramSignIn}
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
