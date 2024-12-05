import React, { useEffect, useRef, useState } from "react";
import { View, Text, Image, Pressable, Platform } from "react-native";
import Swiper from "react-native-swiper";
import { Title, Paragraph } from "react-native-paper";
import stylesFn from "@/styles/tab1.styles";
import { useTheme } from "@react-navigation/native";
import AppLayout from "@/layouts/app-layout";
import { slides } from "@/constants/Slides";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import {
  FacebookAuthProvider,
  getAdditionalUserInfo,
  signInWithCredential,
} from "firebase/auth";
import { AuthApp as auth } from "@/utils/auth";
import { useRouter } from "expo-router";
import { useAuthContext } from "@/contexts";
import {
  DUMMY_USER_CREDENTIALS,
  DUMMY_USER_CREDENTIALS2,
} from "@/constants/User";
import Colors from "@/constants/Colors";
import { FirestoreDB } from "@/utils/firestore";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEllipsis, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import Button from "@/components/ui/button";
import SocialButton from "@/components/ui/button/social-button";
import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { imageUrl } from "@/utils/url";

WebBrowser.maybeCompleteAuthSession();

const FB_APP_ID = "567254166026958";

const PreSignIn = () => {
  const theme = useTheme();
  const styles = stylesFn(theme);
  const [error, setError] = useState<string | null>(null);
  const { firebaseSignIn, firebaseSignUp, signIn, signUp } = useAuthContext();
  const swiperRef = useRef<Swiper>(null);
  const [visible, setVisible] = useState(false);

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

  const router = useRouter();

  // Handle response from Facebook
  useEffect(() => {
    if (response?.type === "success") {
      console.log("response", response);

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

        const user = getAdditionalUserInfo(result);

        const userData = {
          accessToken,
          name: result.user.displayName,
          email: result.user.email || "",
          // @ts-ignore
          profileImage: user?.profile?.picture?.data?.url || "",
          fbid,
        };

        await setDoc(userDocRef, userData);
        firebaseSignUp(result.user.uid);
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleEmailSignIn = () => {
    router.navigate("/login");
  };

  const handleInstagramSignIn = () => {
    signIn(DUMMY_USER_CREDENTIALS2.email, DUMMY_USER_CREDENTIALS2.password);
  };

  const handleFacebookSignIn = async () => {
    await promptAsync();
  };

  const skipToConnect = () => {
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
        ref={swiperRef}
        style={styles.wrapper}
        dotStyle={styles.dotStyle}
        loop={false}
        activeDotStyle={[
          styles.dotStyle,
          { backgroundColor: Colors(theme).primary },
        ]}
        paginationStyle={styles.pagination}
      >
        {slides.map((slide) => (
          <View style={styles.slide} key={slide.key}>
            {slide.key !== "connect" && (
              <Button
                mode="outlined"
                style={styles.skipButton}
                onPress={skipToConnect}
              >
                Skip
              </Button>
            )}
            {slide.key === "connect" && Platform.OS !== "web" && (
              <Pressable
                style={[styles.skipButton]}
                onPress={() => {
                  setVisible(true);
                }}
              >
                <FontAwesomeIcon
                  icon={faEllipsis}
                  size={24}
                  color={Colors(theme).gray100}
                />
              </Pressable>
            )}
            <View style={styles.imageContainer}>
              <Image source={imageUrl(slide.image)} style={styles.image} />
            </View>
            <Title style={[styles.title, { color: Colors(theme).primary }]}>
              {slide.title}
            </Title>
            <Paragraph style={styles.paragraph}>{slide.text}</Paragraph>
            {slide.key === "connect" && (
              <View style={styles.socialContainer}>
                <SocialButton
                  icon={faFacebook}
                  label="Login with Facebook"
                  onPress={handleFacebookSignIn}
                />
                <SocialButton
                  icon={faEnvelope}
                  label="Login with Email"
                  onPress={handleEmailSignIn}
                />
                <SocialButton
                  icon={faInstagram}
                  label="Login with Instagram"
                  onPress={handleInstagramSignIn}
                />
              </View>
            )}
          </View>
        ))}
      </Swiper>

      {error && <Text style={{ color: "red" }}>Error: {error}</Text>}
    </AppLayout>
  );
};

export default PreSignIn;
