import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  Platform,
  Pressable,
  ActivityIndicator,
} from "react-native";
import Swiper from "react-native-swiper";
import { Title, Paragraph, Button, Portal } from "react-native-paper";
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
import Colors from "@/constants/Colors";
import { LoginManager, Settings } from "react-native-fbsdk-next";
import { FirestoreDB } from "@/utils/firestore";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { AccessToken } from "react-native-fbsdk-next";
import { requestTrackingPermissionsAsync } from "expo-tracking-transparency";
import BottomSheetActions from "@/components/BottomSheetActions";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEllipsis, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import SocialButton from "@/components/ui/button/social-button";
import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { imageUrl } from "@/utils/url";
import { FB_APP_ID } from "@/constants/Facebook";
import axios from "axios";
import { DUMMY_USER_CREDENTIALS2 } from "@/constants/User";

WebBrowser.maybeCompleteAuthSession();

const PreSignIn = () => {
  const theme = useTheme();
  const styles = stylesFn(theme);
  const [error, setError] = useState<string | null>(null);
  const { firebaseSignIn, firebaseSignUp, signIn, signUp } = useAuthContext();
  const swiperRef = useRef<Swiper>(null); // Use ref for Swiper
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

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
      setError("Facebook login failed. Please try again.");
    }
  }, [response]);

  const handleFirebaseSignIn = async (accessToken: string) => {
    try {
      setLoading(true);
      const credential = FacebookAuthProvider.credential(accessToken);
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

        const graphAPIResponse = await axios.get(
          `https://graph.facebook.com/v21.0/me`,
          {
            params: {
              fields: "accounts,name,id",
              access_token: accessToken,
            },
          }
        );

        const userData = {
          accessToken,
          name: result.user.displayName,
          email: result.user.email || "",
          // @ts-ignore
          profileImage: user?.profile?.picture?.data?.url || "",
          fbid,
        };

        await setDoc(userDocRef, userData);

        const socialsRef = collection(userDocRef, "socials");

        graphAPIResponse.data.accounts &&
          graphAPIResponse.data.accounts.data.forEach(async (page: any) => {
            const pageData = {
              name: page.name || "",
              fbid: page.id || "",
              category: page.category || "",
              accessToken,
              category_list: page.category_list || [],
              tasks: page.tasks || [],
            };

            const pageDocRef = doc(socialsRef, page.id);

            await setDoc(pageDocRef, pageData);
          });

        firebaseSignUp(result.user.uid);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const skipToConnect = () => {
    const connectSlideIndex = slides.findIndex(
      (slide) => slide.key === "connect"
    );
    if (connectSlideIndex !== -1) {
      swiperRef.current?.scrollBy(connectSlideIndex);
    }
  };

  const handleEmailSignIn = () => {
    router.navigate("/login");
  };

  const handleInstagramSignIn = () => {
    signIn(DUMMY_USER_CREDENTIALS2.email, DUMMY_USER_CREDENTIALS2.password);
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
            {slide.key === "connect" && Platform.OS !== "web" && (
              <View style={styles.socialContainer}>
                <SocialButton
                  icon={faFacebook}
                  label="Login with Facebook"
                  onPress={
                    request
                      ? () => {
                          promptAsync();
                        }
                      : () => {}
                  }
                />
              </View>
            )}
            {slide.key === "connect" && Platform.OS === "web" && (
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
            {slide.key === "connect" && loading && (
              <Portal>
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 1000,
                    backgroundColor: Colors(theme).backdrop,
                  }}
                >
                  <ActivityIndicator size="large" color={Colors(theme).text} />
                </View>
              </Portal>
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
