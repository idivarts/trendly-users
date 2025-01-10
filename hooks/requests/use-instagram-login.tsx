import { useEffect } from "react";
import { Platform } from "react-native";
import axios from "axios";
import * as AuthSession from "expo-auth-session";
import { collection, doc, Firestore, updateDoc } from "firebase/firestore";
import { Auth, signInWithCustomToken } from "firebase/auth";

import { useAuthContext } from "@/contexts";
import { FB_APP_ID } from "@/constants/Facebook";
import { IUsers } from "@/shared-libs/firestore/trendly-pro/models/users";

interface useInstagramLoginType {
  instagramLogin: () => void;
  promptAsyncInstagram: (
    options?: AuthSession.AuthRequestPromptOptions,
  ) => Promise<AuthSession.AuthSessionResult>;
  requestInstagram: AuthSession.AuthRequest | null
};

const useInstagramLogin = (
  auth: Auth,
  firestore: Firestore,
  initialUserData: Partial<IUsers>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
): useInstagramLoginType => {
  const {
    firebaseSignIn,
    firebaseSignUp
  } = useAuthContext();

  const redirectUri = AuthSession.makeRedirectUri({
    native: `fb${FB_APP_ID}://authorize`,
  });

  const authUrl = `https://be.trendly.pro/instagram`;

  const [requestInstagram, responseInstagram, promptAsyncInstagram] =
    AuthSession.useAuthRequest(
      {
        clientId: FB_APP_ID,
        redirectUri,
      },
      {
        authorizationEndpoint: `${authUrl}?redirect_type=${Platform.OS === "web" ? 2 : 3
          }&`,
      }
    );

  const instagramLogin = async () => {
    await promptAsyncInstagram();
  }

  const handleInstagramSignIn = async (
    accessToken: string,
  ) => {
    await axios
      .post("https://be.trendly.pro/instagram/auth", {
        code: accessToken,
        redirect_type: Platform.OS === "web" ? "2" : "3",
      })
      .then(async (response) => {
        const user = await signInWithCustomToken(
          auth,
          response.data.data.firebaseCustomToken
        );
        if (response.data.data.isExistingUser) {
          firebaseSignIn(user.user.uid);
        } else {
          const userCollection = collection(firestore, "users");
          const userDocRef = doc(userCollection, user.user.uid);
          const userData = {
            ...initialUserData,
          };

          await updateDoc(userDocRef, userData);
          firebaseSignUp(user.user.uid, true);
        }
      })
      .catch((error: Error) => {
        console.error("Error signing in with Instagram: ", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (
      responseInstagram?.type === "success" ||
      responseInstagram?.type === "error"
    ) {
      const { code } = responseInstagram.params;
      if (code) {
        handleInstagramSignIn(code);
      } else {
        console.log("Instagram login failed. Please try again.");
      }
    }
  }, [responseInstagram]);

  return {
    instagramLogin,
    promptAsyncInstagram,
    requestInstagram,
  }
};

export default useInstagramLogin;
