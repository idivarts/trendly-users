import axios from "axios";
import * as AuthSession from "expo-auth-session";
import {
  Auth,
  FacebookAuthProvider,
  getAdditionalUserInfo,
  signInWithCredential,
} from "firebase/auth";
import {
  collection,
  doc,
  Firestore,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect } from "react";

import { FB_APP_ID } from "@/constants/Facebook";
import { useAuthContext } from "@/contexts";
import { IUsers } from "@/shared-libs/firestore/trendly-pro/models/users";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import * as WebBrowser from "expo-web-browser";

interface useFacebookLoginType {
  facebookLogin: () => void;
  promptAsyncFacebook: (
    options?: AuthSession.AuthRequestPromptOptions
  ) => Promise<AuthSession.AuthSessionResult>;
  requestFacebook: AuthSession.AuthRequest | null;
}

WebBrowser.maybeCompleteAuthSession();

const useFacebookLogin = (
  auth: Auth,
  firestore: Firestore,
  initialUserData: Partial<IUsers>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
): useFacebookLoginType => {
  const { firebaseSignIn, firebaseSignUp } = useAuthContext();

  const redirectUri = AuthSession.makeRedirectUri({
    native: `fb${FB_APP_ID}://authorize`,
    path: "pre-signin",
  });

  const [requestFacebook, responseFacebook, promptAsyncFacebook] =
    AuthSession.useAuthRequest(
      {
        clientId: FB_APP_ID,
        redirectUri,
        responseType: AuthSession.ResponseType.Token,
        scopes: [
          "public_profile",
          "email",
          "pages_show_list",
          "pages_read_engagement",
          "business_management",
          "instagram_basic",
          "instagram_manage_insights",
          "read_insights"
        ],
      },
      { authorizationEndpoint: "https://www.facebook.com/v10.0/dialog/oauth" }
    );

  const facebookLogin = async () => {
    await promptAsyncFacebook();
  };

  const handleFirebaseSignIn = async (accessToken: string) => {
    try {
      setLoading(true);
      const credential = FacebookAuthProvider.credential(accessToken);
      const result = await signInWithCredential(auth, credential);
      if (result.user) {
        const userCollection = collection(firestore, "users");
        const userDocRef = doc(userCollection, result.user.uid);
        const fbid = result.user.providerData[0].uid;

        const findUser = await getDoc(userDocRef);
        if (findUser.exists()) {
          firebaseSignIn(result.user.uid);
          return;
        }

        const user = getAdditionalUserInfo(result);

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

        const userData = {
          ...initialUserData,
          accessToken,
          name: result.user.displayName,
          email: result.user.email || "",
          // @ts-ignore
          profileImage: user?.profile?.picture?.data?.url || "",
          fbid,
        };

        await setDoc(userDocRef, userData);

        const userToken = await auth.currentUser?.getIdToken();

        const responseFacebook = await axios.post(
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
              Authorization: `Bearer ${userToken}`,
            },
          }
        );

        if (
          !graphAPIResponse.data.accounts ||
          graphAPIResponse.data.accounts.length === 0
        ) {
          firebaseSignUp(result.user.uid, false);
        }

        if (
          graphAPIResponse.data.accounts &&
          graphAPIResponse.data.accounts.data.length === 1
        ) {
          //update and make this as the primary social
          const userDocRef = doc(firestore, "users", result.user.uid);
          const userDoc = await getDoc(userDocRef);
          const userData = userDoc.data() as IUsers;

          userData.primarySocial = graphAPIResponse.data.accounts.data[0].id;

          await updateDoc(userDocRef, {
            primarySocial: userData.primarySocial,
          })
            .then(() => {
              Toaster.success("Social marked as primary");
            })
            .catch((error) => {
              Toaster.error("Error marking social as primary");
            });
        }

        firebaseSignUp(result.user.uid);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (responseFacebook?.type === "success") {
      const { access_token } = responseFacebook.params;
      handleFirebaseSignIn(access_token);
    } else if (responseFacebook?.type === "error") {
      setError("Facebook login failed. Please try again.");
    }
  }, [responseFacebook]);

  return {
    facebookLogin,
    promptAsyncFacebook,
    requestFacebook,
  };
};

export default useFacebookLogin;
