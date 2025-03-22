import { useFacebookLogin } from "@/hooks/requests";
import { AuthApp } from "@/utils/auth";
import { FirestoreDB } from "@/utils/firestore";
import axios from "axios";
import * as WebBrowser from "expo-web-browser";
import { collection, doc } from "firebase/firestore";
import React, { useState } from "react";
import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import Button from "../ui/button";


WebBrowser.maybeCompleteAuthSession();

const FacebookLoginButton: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleFirebaseSignIn = async (accessToken: string) => {
    setIsLoading(true);
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
              "id,name,accounts{name,id,access_token,instagram_business_account}",
            access_token: accessToken,
          },
        }
      );

      const user = await AuthApp.currentUser?.getIdToken();

      const responseFacebook = await axios
        .post(
          "https://be.trendly.now/api/v1/socials/facebook",
          {
            accounts: graphAPIResponse.data.accounts,
            name: graphAPIResponse.data.name,
            id: graphAPIResponse.data.id,
            accessToken: accessToken,
            // expiresIn: Number(graphAPIResponse.data.expires_in),
            // signedRequest: graphAPIResponse.data.signedRequest,
            // graphDomain: graphAPIResponse.data.graphDomain,
            // data_access_expiration_time: Number(
            //   graphAPIResponse.data.data_access_expiration_time
            // ),
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
    } finally {
      setIsLoading(false);
    }
  };

  const { facebookLogin } = useFacebookLogin(AuthApp, FirestoreDB, {}, () => { }, () => { }, handleFirebaseSignIn);

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
          onPress={facebookLogin}
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
