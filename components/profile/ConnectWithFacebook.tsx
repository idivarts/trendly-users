import { useFacebookLogin } from "@/hooks/requests";
import { Console } from "@/shared-libs/utils/console";
import { AuthApp } from "@/shared-libs/utils/firebase/auth";
import { FirestoreDB } from "@/shared-libs/utils/firebase/firestore";
import { HttpWrapper } from "@/shared-libs/utils/http-wrapper";
import axios from "axios";
import * as WebBrowser from "expo-web-browser";
import { collection, doc } from "firebase/firestore";
import React, { useState } from "react";
import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import Button from "../ui/button";
;
;
;
;


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

      let responseFacebook = await HttpWrapper.fetch("/api/v1/socials/facebook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          accounts: graphAPIResponse.data.accounts,
          name: graphAPIResponse.data.name,
          id: graphAPIResponse.data.id,
          accessToken: accessToken,
        })
      })

    } catch (error) {
      Console.error(error);
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
