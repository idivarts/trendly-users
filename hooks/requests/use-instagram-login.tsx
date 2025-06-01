import * as AuthSession from "expo-auth-session";
import { Auth, signInWithCustomToken } from "firebase/auth";
import { collection, doc, Firestore, updateDoc } from "firebase/firestore";
import { useEffect } from "react";
import { Platform } from "react-native";

import { FB_APP_ID } from "@/constants/Facebook";
import { useAuthContext } from "@/contexts";
import { IUsers } from "@/shared-libs/firestore/trendly-pro/models/users";
import { Console } from "@/shared-libs/utils/console";
import { BACKEND_URL, HttpWrapper } from "@/shared-libs/utils/http-wrapper";
import * as WebBrowser from "expo-web-browser";
;
;

interface useInstagramLoginType {
  instagramLogin: () => void;
  requestInstagram: AuthSession.AuthRequest | null;
}

WebBrowser.maybeCompleteAuthSession();

const useInstagramLogin = (
  auth: Auth,
  firestore: Firestore,
  initialUserData: Partial<IUsers>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  customCodeHandler: ((code: string) => void) | null = null
): useInstagramLoginType => {
  const { firebaseSignIn, firebaseSignUp } = useAuthContext();

  const isLocalhost = Platform.OS == "web" ? (window.location.hostname.includes('localhost')) : false;

  const redirectUri = AuthSession.makeRedirectUri({
    native: `fb${FB_APP_ID}://authorize`,
    ...(Platform.OS == "web" ? { path: "insta-redirect" } : {})
  });

  const authUrl = `${BACKEND_URL}/instagram?redirect_type=${Platform.OS === "web" ? (isLocalhost ? 1 : 2) : 3}&`;

  const [requestInstagram, responseInstagram, promptAsyncInstagram] =
    AuthSession.useAuthRequest(
      {
        clientId: FB_APP_ID,
        redirectUri,
        responseType: "token",
      },
      {
        authorizationEndpoint: authUrl,
      }
    );

  const instagramLogin = async () => {
    if (Platform.OS === "web") {
      window.open(authUrl, "_blank", "width=500,height=600");
      window.addEventListener('storage', receiveMessage);
    } else {
      await promptAsyncInstagram();
    }
  };

  const handleInstagramSignIn = async (accessToken: string) => {
    if (customCodeHandler) {
      customCodeHandler(accessToken);
      return;
    }
    setLoading(true);
    await HttpWrapper.fetch("/api/v1/socials/instagram", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: accessToken,
        redirect_type: Platform.OS === "web" ? (isLocalhost ? 1 : 2) : 3,
      }),
    }).then(async (response) => {
      const data = await response.json();
      const user = await signInWithCustomToken(
        auth,
        data.data.firebaseCustomToken
      );
      if (data.data.isExistingUser) {
        firebaseSignIn(user.user.uid);
      } else {
        const userCollection = collection(firestore, "users");
        const userDocRef = doc(userCollection, user.user.uid);
        const userData = {
          ...initialUserData,
        };

        await updateDoc(userDocRef, userData);
        firebaseSignUp(user.user.uid, 1);
      }
    })
      .catch((error: Error) => {
        Console.errorT("Error signing in with Instagram: ", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const receiveMessage = (event: StorageEvent) => {
    if (event.key === 'insta_code') {
      Console.log('Received update:', event.newValue);
      handleInstagramSignIn("" + event.newValue);
      window.removeEventListener('storage', receiveMessage);
    }
  };

  useEffect(() => {
    if (!responseInstagram) return;
    Console.log("Auth Result Response: ", responseInstagram);
    if (
      responseInstagram.type === "success" ||
      responseInstagram.type === "error"
    ) {
      const { code } = responseInstagram.params;
      if (code) {
        handleInstagramSignIn(code);
      } else {
        Console.log("Instagram login failed. Please try again.");
      }
    }
  }, [responseInstagram]);

  return {
    instagramLogin,
    requestInstagram,
  };
};

export default useInstagramLogin;
