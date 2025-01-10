import React, { useState, useRef } from "react";
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
import * as WebBrowser from "expo-web-browser";
import { AuthApp } from "@/utils/auth";
import { useRouter } from "expo-router";
import {
  INITIAL_USER_DATA,
} from "@/constants/User";
import Colors from "@/constants/Colors";
import { FirestoreDB } from "@/utils/firestore";
import BottomSheetActions from "@/components/BottomSheetActions";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faArrowRight,
  faArrowRightArrowLeft,
  faChevronRight,
  faEllipsis,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import SocialButton from "@/components/ui/button/social-button";
import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { imageUrl } from "@/utils/url";
import { useFacebookLogin, useInstagramLogin } from "@/hooks/requests";

WebBrowser.maybeCompleteAuthSession();

const PreSignIn = () => {
  const theme = useTheme();
  const styles = stylesFn(theme);
  const [error, setError] = useState<string | null>(null);
  const swiperRef = useRef<Swiper>(null); // Use ref for Swiper
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const {
    instagramLogin,
    promptAsyncInstagram,
    requestInstagram,
  } = useInstagramLogin(
    AuthApp,
    FirestoreDB,
    INITIAL_USER_DATA,
    setLoading,
    setError,
  );

  const {
    facebookLogin,
    promptAsyncFacebook,
    requestFacebook,
  } = useFacebookLogin(
    AuthApp,
    FirestoreDB,
    INITIAL_USER_DATA,
    setLoading,
    setError,
  );

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
                    requestFacebook
                      ? () => {
                        promptAsyncFacebook();
                      }
                      : () => { }
                  }
                />
                <SocialButton
                  icon={faInstagram}
                  label="Login with Instagram"
                  onPress={
                    requestInstagram
                      ? () => {
                        promptAsyncInstagram();
                      }
                      : () => { }
                  }
                />
              </View>
            )}
            {slide.key === "connect" && Platform.OS === "web" && (
              <View style={styles.socialContainer}>
                <SocialButton
                  icon={faFacebook}
                  label="Login with Facebook"
                  onPress={facebookLogin}
                />
                <SocialButton
                  icon={faEnvelope}
                  label="Login with Email"
                  onPress={handleEmailSignIn}
                />
                <SocialButton
                  icon={faInstagram}
                  label="Login with Instagram"
                  onPress={instagramLogin}
                />
              </View>
            )}
            {slide.key !== "connect" && (
              <Pressable
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 15,
                  backgroundColor: Colors(theme).primary,
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderRadius: 5,
                  gap: 10,
                }}
                onPress={() => {
                  swiperRef.current?.scrollBy(1);
                }}
              >
                <Text
                  style={{
                    color: Colors(theme).white,
                    fontSize: 16,
                  }}
                >
                  Next
                </Text>
                <FontAwesomeIcon
                  icon={faArrowRight}
                  size={16}
                  color={Colors(theme).white}
                />
              </Pressable>
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
