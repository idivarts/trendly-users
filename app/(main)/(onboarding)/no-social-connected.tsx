import FacebookLoginButton from "@/components/profile/ConnectWithFacebook";
import InstagramLoginButton from "@/components/profile/ConnectWithInstagramManual";
import Button from "@/components/ui/button";
import Colors from "@/constants/Colors";
import { useAuthContext } from "@/contexts";
import AppLayout from "@/layouts/app-layout";
import { imageUrl } from "@/utils/url";
import { useTheme } from "@react-navigation/native";
import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

const TrendlyScreen = () => {
  const { signOutUser } = useAuthContext();
  // const { socials } = useSocialContext();
  const theme = useTheme();

  // useEffect(() => {
  //   if (socials.length > 0) {
  //     // Redirect to the main screen
  //     router.replace("/(main)/collaborations");
  //   }
  // }, [socials]);

  return (
    <AppLayout withWebPadding>
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

        <View style={{ flex: 1, justifyContent: "center" }}>
          {/* Illustration */}
          <View>
            <View style={styles.imageContainer}>
              <Image
                source={imageUrl(require("@/assets/images/no-socials.png"))} // Replace with your local image
                style={styles.image}
                resizeMode="contain"
              />
            </View>

            {/* No Account Text */}
            <Text style={styles.noAccountText}>Showcase your Social Account</Text>
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
            <View style={styles.buttonContainer}>
              <InstagramLoginButton />
              <FacebookLoginButton />
            </View>
          </View>
        </View>

        {/* Buttons */}

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
    // marginVertical: 0,
  },
  image: {
    height: 300,
    width: 300,
  },
  noAccountText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  button: {
    marginVertical: 10,
    paddingVertical: 5,
  },
});

export default TrendlyScreen;
