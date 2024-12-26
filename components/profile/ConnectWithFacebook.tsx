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
            access_token: "EAAID6icQOs4BO1IqPsUd5cFHgSc70MusysKDyZCXAUMA5t2MlUthyr1QQniSeyAWTusZCnMUo8vIZAZAhkJQ5NZAXZAJnXb0g0gyuUTu9I8OBkGI8HZCN1AvOPGk3ZBS0dGyP0AFNjAwdJNQZBAcrmvDASZAL93p6mmd9GYVbNHGeGAyZCKOZA8ztLtvkFZA43QZDZD",
          },
        }
      );

      const user = await AuthApp.currentUser?.getIdToken();

      const responseFacebook = await axios
        .post(
          "https://be.trendly.pro/api/v1/socials/facebook",
          {
            accounts: graphAPIResponse.data.accounts,
            name: graphAPIResponse.data.name,
            id: graphAPIResponse.data.id,
            expiresIn: Number(graphAPIResponse.data.expires_in),
            accessToken: graphAPIResponse.data.access_token,
            signedRequest: graphAPIResponse.data.signedRequest,
            graphDomain: graphAPIResponse.data.graphDomain,
            data_access_expiration_time: Number(
              graphAPIResponse.data.data_access_expiration_time
            ),
          },
          {
            headers: {
              Authorization: `Bearer ${user}`,
            },
          }
        )
        .then((res) => { });
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
          icon={"facebook"}
          labelStyle={{ color: "white", fontSize: 16 }}
        >
          Add Facebook Account
        </Button>
      )}
    </View>
  );
};

export default FacebookLoginButton;
