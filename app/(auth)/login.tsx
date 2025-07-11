import Button from "@/components/ui/button";
import TextInput from "@/components/ui/text-input";
import { IS_BETA_ENABLED } from "@/constants/App";
import { useAuthContext } from "@/contexts";
import { Console } from "@/shared-libs/utils/console";
import { useMyNavigation } from "@/shared-libs/utils/router";
import Colors from "@/shared-uis/constants/Colors";
import fnStyles from "@/styles/login.styles";
import { useTheme } from "@react-navigation/native";
import * as React from "react";
import { Alert, Image, KeyboardAvoidingView, Linking, Platform, ScrollView, Text, View } from "react-native";

const LoginScreen = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const router = useMyNavigation();
  const { signIn } = useAuthContext();
  const theme = useTheme();
  const styles = fnStyles(theme);

  const handleSignIn = () => {
    signIn(email, password);
  };

  const handleEmailPress = () => {
    const email = 'support@idiv.in';
    const subject = encodeURIComponent('Support Request');
    const body = encodeURIComponent('Hello, I need assistance with...');

    const mailto = `mailto:${email}?subject=${subject}&body=${body}`;

    Linking.canOpenURL(mailto)
      .then((supported) => {
        if (supported) {
          Linking.openURL(mailto);
        } else {
          Alert.alert('Error', 'No email app found on this device.');
        }
      })
      .catch((err) => Console.error('An error occurred', err));
  };

  return (
    <View style={styles.container}>
      {/* Logo Section */}
      <Image
        source={require("../../assets/images/logo.png")} // Replace with your actual logo path
        style={styles.logo}
        resizeMode="contain"
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            paddingBottom: 30,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Title */}
          <Text style={styles.title}>Login</Text>
          <Text style={styles.subTitle}>Welcome to Trendly Creators</Text>

          {/* Email Input Field */}
          <TextInput
            autoCapitalize="none"
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            style={styles.input}
            theme={{ colors: { primary: Colors(theme).text } }}
          />

          {/* Password Input Field */}
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            mode="outlined"
            style={styles.input}
            theme={{ colors: { primary: Colors(theme).text } }}
          />


          {/* Login Button */}
          <Button
            mode="contained"
            onPress={() => handleSignIn()}
          >
            Login
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
      {/* Sign Up and Forgot Password Links */}
      {IS_BETA_ENABLED ? <View style={styles.footer}>
        <Text style={styles.footerText}>
          Don't have an account?{" "}
          <Text
            style={styles.footerLink}
            onPress={() =>
              router.replace({
                pathname: "/signup",
              })
            }
          >
            Sign Up
          </Text>
        </Text>
      </View> : <View style={styles.footer}>
        <Text style={styles.footerText}>
          Email signup is restricted to authorized users only.{" "}
          <Text
            style={styles.footerLink}
            onPress={() => { handleEmailPress() }}
          >
            Contact Support
          </Text>
        </Text>
      </View>}

    </View>
  );
};

export default LoginScreen;
