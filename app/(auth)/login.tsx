import Button from "@/components/ui/button";
import TextInput from "@/components/ui/text-input";
import { IS_BETA_ENABLED } from "@/constants/App";
import Colors from "@/constants/Colors";
import { useAuthContext } from "@/contexts";
import fnStyles from "@/styles/login.styles";
import { useTheme } from "@react-navigation/native";
import { useRouter } from "expo-router";
import * as React from "react";
import { Alert, Image, KeyboardAvoidingView, Linking, Platform, ScrollView, Text, View } from "react-native";

const LoginScreen = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const router = useRouter();
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
      .catch((err) => console.error('An error occurred', err));
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
          Signup with Email is not allowed for regular users?{" "}
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
