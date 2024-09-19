import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import Swiper from "react-native-swiper";
import { Title, Paragraph } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import createStyles from "@/styles/tab1.styles";
import { useTheme } from "@react-navigation/native";
import AppLayout from "@/layouts/app-layout";
import { slides } from "@/constants/Slides";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { FacebookAuthProvider, signInWithCredential } from "firebase/auth";
import { AuthApp as auth } from "@/utils/auth";
import { useRouter } from "expo-router";
import { useAuthContext } from "@/contexts";

WebBrowser.maybeCompleteAuthSession();

const FB_APP_ID = "2223620811324637";

const PreSignIn = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [error, setError] = useState<string | null>(null);
  const { signIn } = useAuthContext();

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

  // console.log("Request: ", response);
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
        console.log("User signed in: ", result.user);
        signIn(result.user.uid);
      }
    } catch (error: any) {
      setError(error.message);
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
        color={colors.text}
        style={styles.icon}
      />
      <Text style={styles.socialButtonText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <AppLayout>
      <Swiper
        style={styles.wrapper}
        dotStyle={styles.dotStyle}
        activeDotStyle={[styles.dotStyle, { backgroundColor: colors.primary }]}
        paginationStyle={styles.pagination}
      >
        {slides.map((slide) => (
          <View style={styles.slide} key={slide.key}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: slide.image }} style={styles.image} />
            </View>
            <Title style={[styles.title, { color: colors.primary }]}>
              {slide.title}
            </Title>
            <Paragraph style={styles.paragraph}>{slide.text}</Paragraph>
            {slide.key === "connect" && (
              <View style={styles.socialContainer}>
                {renderSocialButton(
                  "logo-facebook",
                  "Login with Facebook",
                  () => promptAsync({})
                )}
                {renderSocialButton("mail-outline", "Login with Email", () =>
                  router.push("/questions")
                )}
                {renderSocialButton(
                  "logo-instagram",
                  "Login with Instagram",
                  () => router.push("/questions")
                )}
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
