import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, ActivityIndicator } from "react-native-paper";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { View } from "react-native";
import { FB_APP_ID as fbid } from "@/constants/Facebook";
import { FirestoreDB } from "@/utils/firestore";
import { AuthApp } from "@/utils/auth";
import { collection, doc, setDoc } from "firebase/firestore";

interface FacebookLoginButtonProps {
  onFacebookLogin: (userId: string | null) => void;
  isConnected?: boolean;
}

WebBrowser.maybeCompleteAuthSession();

const FacebookLoginButton: React.FC<FacebookLoginButtonProps> = ({
  isConnected,
  onFacebookLogin,
}) => {
  const FB_APP_ID = fbid;
  const [isLoading, setIsLoading] = useState(false);

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: FB_APP_ID,
      redirectUri: AuthSession.makeRedirectUri({
        native: `fb${FB_APP_ID}://authorize`,
      }),
      responseType: AuthSession.ResponseType.Token,
      scopes: [
        "public_profile",
        "email",
        "pages_show_list",
        "pages_read_engagement",
        "instagram_basic",
        "instagram_manage_messages",
      ],
    },
    { authorizationEndpoint: "https://www.facebook.com/v10.0/dialog/oauth" }
  );

  const handleFacebookSignIn = async () => {
    await promptAsync();
  };

  useEffect(() => {
    if (response?.type === "success") {
      const { access_token } = response.params;
      handleFirebaseSignIn(access_token);
    } else if (response?.type === "error") {
    }
  }, [response]);

  const handleFirebaseSignIn = async (accessToken: string) => {
    try {
      const userCollection = collection(FirestoreDB, "users");
      const userID = AuthApp.currentUser?.uid;
      if (!userID) return;
      const userDocRef = doc(userCollection, userID);
      const socialsRef = collection(userDocRef, "socials");

      const graphAPIResponse = await axios.get(
        `https://graph.facebook.com/v21.0/me`,
        {
          params: {
            fields:
              "id,name,accounts{name,id,access_token,category_list,tasks,instagram_business_account,category}",
            access_token: accessToken,
          },
        }
      );

      graphAPIResponse.data.accounts &&
        graphAPIResponse.data.accounts.data.forEach(async (page: any) => {
          const pageData = {
            name: page.name || "",
            fbid: page.id || "",
            category: page.category || "",
            accessToken,
            category_list: page.category_list || [],
            tasks: page.tasks || [],
            instagram_business_account: page.instagram_business_account || "",
          };

          const pageDocRef = doc(socialsRef, page.id);

          await setDoc(pageDocRef, pageData);
        });
    } catch (error) {
      console.error(error);
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
          onPress={handleFacebookSignIn}
        >
          Connect New Social Accounts
        </Button>
      )}
    </View>
  );
};

export default FacebookLoginButton;