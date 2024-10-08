import React, { useEffect, useState, useRef } from "react";
import { View, Text, Image, TouchableOpacity, Platform } from "react-native";
import Swiper from "react-native-swiper";
import { Title, Paragraph } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import stylesFn from "@/styles/tab1.styles";
import { useTheme } from "@react-navigation/native";
import AppLayout from "@/layouts/app-layout";
import { slides } from "@/constants/Slides";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { FacebookAuthProvider, signInWithCredential } from "firebase/auth";
import { AuthApp as auth } from "@/utils/auth";
import { useRouter } from "expo-router";
import { useAuthContext } from "@/contexts";
import {
  DUMMY_USER_CREDENTIALS,
  DUMMY_USER_CREDENTIALS2,
} from "@/constants/User";
import Colors from "@/constants/Colors";
import { LoginManager, Settings } from "react-native-fbsdk-next";
import { FirestoreDB } from "@/utils/firestore";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { AccessToken } from "react-native-fbsdk-next";
import { requestTrackingPermissionsAsync } from "expo-tracking-transparency";
import BottomSheetActions from "@/components/BottomSheetActions";

WebBrowser.maybeCompleteAuthSession();

const FB_APP_ID = "2223620811324637";

const PreSignIn = () => {
  const theme = useTheme();
  const styles = stylesFn(theme);
  const [error, setError] = useState<string | null>(null);
  const { firebaseSignIn, firebaseSignUp, signIn, signUp } = useAuthContext();
  const swiperRef = useRef<Swiper>(null); // Use ref for Swiper
  const [visible, setVisible] = useState(false);

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: FB_APP_ID,
      redirectUri: AuthSession.makeRedirectUri({
        native: `fb${FB_APP_ID}://authorize`,
      }),
      responseType: AuthSession.ResponseType.Token,
      scopes: ["public_profile"],
    },
    { authorizationEndpoint: "https://www.facebook.com/v10.0/dialog/oauth" }
  );

  const router = useRouter();

  // Handle response from Facebook
  useEffect(() => {
    if (response?.type === "success") {
      const { access_token } = response.params;
      handleFirebaseSignIn(access_token);
    } else if (response?.type === "error") {
      setError("Facebook login failed. Please try again.");
    }
  }, [response]);

  const handleFirebaseSignIn = async (accessToken: string) => {
    try {
      // Create Facebook credential with access token
      const credential = FacebookAuthProvider.credential(accessToken);
      // Sign in with Firebase using the Facebook credential
      const result = await signInWithCredential(auth, credential);
      if (result.user) {
        const userCollection = collection(FirestoreDB, "users");
        const userDocRef = doc(userCollection, result.user.uid);
        const fbid = result.user.providerData[0].uid;

        const findUser = await getDoc(userDocRef);
        if (findUser.exists()) {
          firebaseSignIn(result.user.uid);
          return;
        }

        const userData = {
          accessToken,
          name: result.user.displayName,
          fbid,
        };

        await setDoc(userDocRef, userData);
        firebaseSignUp(result.user.uid);
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleFacebookSignIn = async () => {
    if (Platform.OS === "android" || Platform.OS === "ios") {
      LoginManager.logInWithPermissions(["public_profile"]).then(
        function (result) {
          if (result.isCancelled) {
          } else {
            AccessToken.getCurrentAccessToken().then((data) => {
              const token = data?.accessToken;
              if (token) {
                handleFirebaseSignIn(token);
              }
            });
          }
        },
        function (error) {
          console.log("==> Login fail with error: " + error);
        }
      );
    }
  };

  const renderSocialButton = (
    iconName: string,
    label: string,
    onPress: () => void
  ) => (
    <TouchableOpacity style={styles.socialButton} onPress={onPress}>
      <Ionicons
        name={iconName as any}
        size={24}
        color={Colors(theme).text}
        style={styles.icon}
      />
      <Text style={styles.socialButtonText}>{label}</Text>
    </TouchableOpacity>
  );

  useEffect(() => {
    if (Platform.OS === "ios" || Platform.OS === "android") {
      const requestTracking = async () => {
        const { status } = await requestTrackingPermissionsAsync();
        Settings.initializeSDK();
        if (status === "granted") {
          await Settings.setAdvertiserTrackingEnabled(true);
        }
      };
      requestTracking();
    }
  }, []);

  const skipToConnect = () => {
    // Calculate how many slides away the "connect" slide is
    const connectSlideIndex = slides.findIndex(
      (slide) => slide.key === "connect"
    );
    if (connectSlideIndex !== -1) {
      swiperRef.current?.scrollBy(connectSlideIndex);
    }
  };

  return (
    <AppLayout>
      <Swiper
        ref={swiperRef} // Attach the ref to Swiper
        style={styles.wrapper}
        dotStyle={styles.dotStyle}
        activeDotStyle={[
          styles.dotStyle,
          { backgroundColor: Colors(theme).primary },
        ]}
        paginationStyle={styles.pagination}
      >
        {slides.map((slide, index) => (
          <View style={styles.slide} key={slide.key}>
            {slide.key !== "connect" && (
              <TouchableOpacity
                style={styles.skipButton}
                onPress={skipToConnect} // Navigate to "connect" slide
              >
                <Text style={styles.skipButtonText}>Skip</Text>
              </TouchableOpacity>
            )}
            {slide.key === "connect" && (
              <View
                style={[
                  styles.skipButton,
                  {
                    backgroundColor: Colors(theme).white,
                    paddingHorizontal: 10,
                  },
                ]}
              >
                {/* {renderSocialButton(
                  "mail-outline",
                  "Login with Email",
                  handleEmailSignIn
                )}
                {renderSocialButton(
                  "logo-instagram",
                  "Login with Instagram",
                  handleInstagramSignIn
                )} */}
                <Ionicons
                  name="ellipsis-horizontal"
                  size={24}
                  color={Colors(theme).gray100}
                  onPress={() => {
                    setVisible(true);
                  }}
                />
              </View>
            )}
            <View style={styles.imageContainer}>
              <Image source={{ uri: slide.image }} style={styles.image} />
            </View>
            <Title style={[styles.title, { color: Colors(theme).primary }]}>
              {slide.title}
            </Title>
            <Paragraph style={styles.paragraph}>{slide.text}</Paragraph>
            {slide.key === "connect" && (
              <View style={styles.socialContainer}>
                {renderSocialButton(
                  "logo-facebook",
                  "Login with Facebook",
                  () => handleFacebookSignIn()
                )}
              </View>
            )}
          </View>
        ))}
      </Swiper>

      {error && <Text style={{ color: "red" }}>Error: {error}</Text>}
      <BottomSheetActions
        isVisible={visible}
        cardType="pre-signin"
        onClose={() => setVisible(false)}
        snapPointsRange={["25%", "40%"]}
      />
    </AppLayout>
  );
};

export default PreSignIn;
