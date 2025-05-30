import Button from "@/components/ui/button";
import SocialButton from "@/components/ui/button/social-button";
import Colors from "@/constants/Colors";
import { slides } from "@/constants/Slides";
import { useInitialUserData } from "@/constants/User";
import { useFacebookLogin, useInstagramLogin } from "@/hooks/requests";
import AppLayout from "@/layouts/app-layout";
import { AuthApp } from "@/shared-libs/utils/firebase/auth";
import { FirestoreDB } from "@/shared-libs/utils/firebase/firestore";
import stylesFn from "@/styles/tab1.styles";
import { imageUrl } from "@/utils/url";
import { faApple, faFacebook, faGoogle, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faArrowRight, faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useTheme } from "@react-navigation/native";
import * as WebBrowser from "expo-web-browser";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Platform,
  Pressable,
  Text,
  View
} from "react-native";
import { Paragraph, Portal, Title } from "react-native-paper";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
;

import BottomSheetActions from "@/components/BottomSheetActions";
import ProfileOnboardLoader from "@/components/ProfileOnboardLoader";
import { IS_BETA_ENABLED } from "@/constants/App";
import { useBreakpoints } from "@/hooks";
import { useAppleLogin } from "@/hooks/requests/use-apple-login";
import { useGoogleLogin } from "@/hooks/requests/use-google-login";
import { runOnJS, useSharedValue } from "react-native-reanimated";

WebBrowser.maybeCompleteAuthSession();

const PreSignIn = () => {
  const theme = useTheme();
  const INITIAL_DATA = useInitialUserData();
  const styles = stylesFn(theme);
  const [error, setError] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const swiperRef = useRef<ICarouselInstance>(null);
  const progress = useSharedValue(0);
  const [termsCondition, setTermsCondition] = useState(false);

  const { instagramLogin, requestInstagram } =
    useInstagramLogin(
      AuthApp,
      FirestoreDB,
      INITIAL_DATA,
      setLoading,
      setError
    );

  const { facebookLogin, requestFacebook } =
    useFacebookLogin(
      AuthApp,
      FirestoreDB,
      INITIAL_DATA,
      setLoading,
      setError
    );

  const { googleLogin } = useGoogleLogin(setLoading, setError);
  const { appleLogin, isAppleAvailable } = useAppleLogin(setLoading, setError);

  const skipToConnect = () => {
    const connectSlideIndex = slides.findIndex(
      (slide) => slide.key === "connect"
    );
    if (connectSlideIndex !== -1) {
      swiperRef.current?.scrollTo({
        count: connectSlideIndex - progress.value,
        animated: true,
      });
    }
  };

  const onPressPagination = (index: number) => {
    swiperRef.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };
  const { xl } = useBreakpoints();

  return (
    <AppLayout>
      <View style={{ flex: 1, alignSelf: "center" }}>
        <Carousel
          data={slides}
          width={xl ? Dimensions.get("window").width - 120 * 4 : Dimensions.get("window").width}
          height={Dimensions.get("window").height - 120}
          pagingEnabled
          ref={swiperRef}
          loop={false}
          onProgressChange={(_, absoluteProgress) => {
            runOnJS((value: number) => {
              progress.value = value;
            })(absoluteProgress);
          }}
          withAnimation={{
            type: "timing",
            config: {},
          }}
          renderItem={({ item }) => (
            <View style={styles.slide}>
              {item.key === "connect" &&
                <>
                  {Platform.OS == "web" ?
                    <Button
                      mode="outlined"
                      style={styles.skipButton}
                      onPress={() => setVisible(true)}
                    >
                      Options
                    </Button> :
                    <Pressable style={[styles.skipButton, { padding: 20, flex: 1 }]} onPress={() => {
                      setVisible(true)
                    }}>
                      <FontAwesomeIcon
                        icon={faEllipsis}
                        size={24}
                        style={styles.skipIcon} />
                    </Pressable>}
                </>
              }
              {item.key !== "connect" && (
                <Button
                  mode="outlined"
                  style={styles.skipButton}
                  onPress={skipToConnect}
                >
                  Skip
                </Button>
              )}
              <View style={styles.imageContainer}>
                <Image source={imageUrl(item.image)} style={styles.image} />
              </View>
              <Title style={[styles.title, { color: Colors(theme).primary }]}>
                {item.title}
              </Title>
              <Paragraph style={styles.paragraph}>{item.text}</Paragraph>

              {item.key === "connect" && (
                <View style={styles.socialContainer}>
                  {Platform.OS != "ios" &&
                    <SocialButton
                      icon={faGoogle}
                      label="Continue with Google"
                      onPress={googleLogin}
                    />}
                  {(Platform.OS == "ios" && isAppleAvailable) &&
                    <SocialButton
                      icon={faApple}
                      label="Continue with Apple"
                      onPress={appleLogin}
                    />}
                  {IS_BETA_ENABLED &&
                    <SocialButton
                      icon={faFacebook}
                      label="Login with Facebook"
                      onPress={facebookLogin}
                    />}
                  {IS_BETA_ENABLED &&
                    <SocialButton
                      icon={faInstagram}
                      label="Login with Instagram"
                      onPress={instagramLogin}
                    />}
                </View>
              )}
              {item.key !== "connect" && (
                <Pressable
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 40,
                    backgroundColor: Colors(theme).primary,
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderRadius: 5,
                    gap: 10,
                  }}
                  onPress={() => {
                    swiperRef.current?.next();
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
              {/* {error && <Text style={{ color: "red", marginTop: 16 }}>Error: {error}</Text>} */}
              {item.key === "connect" && (
                <View style={{ marginTop: 40, paddingHorizontal: 20 }}>
                  <Text style={{ fontSize: 12, textAlign: "center", color: Colors(theme).text }}>
                    By proceeding to signup, you agree to{" "}
                    <Text
                      style={{ color: Colors(theme).primary, textDecorationLine: "underline" }}
                      onPress={() => setTermsCondition(true)}
                    >
                      Terms & Condition (EULA)
                    </Text>{" "}
                    {/* and{" "}
                    <Text
                      style={{ color: Colors(theme).primary, textDecorationLine: "underline" }}
                      onPress={() => setTermsCondition(true)}
                    >
                      Privacy Policy
                    </Text>{" "} */}
                    of Trendly
                  </Text>
                </View>
              )}
              {item.key === "connect" && loading && (
                <Portal>
                  <ProfileOnboardLoader />
                </Portal>
              )}
            </View>
          )}
        />
        <Pagination.Basic
          progress={progress}
          data={slides}
          size={12}
          dotStyle={{
            borderRadius: 100,
            backgroundColor: Colors(theme).backdrop,
          }}
          activeDotStyle={{
            borderRadius: 100,
            overflow: "hidden",
            backgroundColor: Colors(theme).primary,
          }}
          containerStyle={[
            {
              gap: 5,
              marginBottom: 10,
            },
          ]}
          horizontal
          onPress={onPressPagination}
        />
      </View>

      <BottomSheetActions
        isVisible={visible}
        cardType="pre-signin"
        onClose={() => setVisible(false)}
        snapPointsRange={IS_BETA_ENABLED ? ["25%", "25%"] : ["20%", "20%"]}
      />
      <BottomSheetActions
        isVisible={termsCondition}
        cardType="terms-condition"
        onClose={() => setTermsCondition(false)}
        snapPointsRange={["85%", "85%"]}
      />

    </AppLayout>
  );
};

export default PreSignIn;
