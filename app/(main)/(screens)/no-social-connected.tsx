import FacebookLoginButton from "@/components/profile/ConnectWithFacebook";
import InstagramLoginButton from "@/components/profile/ConnectWithInstagram";
import Colors from "@/constants/Colors";
import { useAuthContext } from "@/contexts";
import { useSocialContext } from "@/contexts";
import AppLayout from "@/layouts/app-layout";
import { imageUrl } from "@/utils/url";
import { useTheme } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { View, StyleSheet, Image } from "react-native";
import { Button, Text } from "react-native-paper";

const TrendlyScreen = () => {
  const { signOutUser } = useAuthContext();
  const { socials } = useSocialContext();
  const theme = useTheme();

  useEffect(() => {
    if (socials.length > 0) {
      // Redirect to the main screen
      router.push("/(main)/collaborations");
    }
  }, [socials]);

  return (
    <AppLayout>
      <View
        style={{
          flex: 1,
          backgroundColor: Colors(theme).background,
          padding: 16,
          justifyContent: "space-between",
        }}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Trendly</Text>
          <Button
            mode="text"
            labelStyle={{
              color: Colors(theme).primary,
              fontSize: 16,
            }}
            onPress={signOutUser}
          >
            Logout
          </Button>
        </View>

        {/* Illustration */}
        <View>
          <View style={styles.imageContainer}>
            <Image
              source={imageUrl(require("@/assets/images/illustration3.png"))} // Replace with your local image
              style={styles.image}
              resizeMode="contain"
            />
          </View>

          {/* No Account Text */}
          <Text style={styles.noAccountText}>No Social Account Found</Text>
          <Text
            style={{
              textAlign: "center",
              color: Colors(theme).gray100,
              marginBottom: 30,
            }}
          >
            Influencers can only join Trendly after they connect their social
            media to Trendly App
          </Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <FacebookLoginButton onFacebookLogin={() => {}} />
          <InstagramLoginButton onFacebookLogin={() => {}} />
        </View>
      </View>
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  imageContainer: {
    alignItems: "center",
    marginVertical: 30,
  },
  image: {
    height: 200,
    width: 200,
  },
  noAccountText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  buttonContainer: {
    alignItems: "center",
  },
  button: {
    marginVertical: 10,
    paddingVertical: 5,
  },
});

export default TrendlyScreen;
