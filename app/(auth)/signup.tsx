import Button from "@/components/ui/button";
import TextInput from "@/components/ui/text-input";
import { useAuthContext } from "@/contexts";
import { useMyNavigation } from "@/shared-libs/utils/router";
import Colors from "@/shared-uis/constants/Colors";
import fnStyles from "@/styles/signup.styles";
import { useTheme } from "@react-navigation/native";
import { useState } from "react";
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";

const SignUpScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useMyNavigation();
  const theme = useTheme();
  const styles = fnStyles(theme);
  const { signUp } = useAuthContext();

  const windowHeight = Dimensions.get("window").height;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={{
          minHeight: windowHeight,
          paddingBottom: 30,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo Section */}
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        {/* Title */}
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subTitle}>Welcome to Trendly Users</Text>
        {/* Name Field */}
        <View style={styles.inputContainer}>
          <TextInput
            label="Name"
            value={name}
            onChangeText={setName}
            mode="outlined"
            style={styles.input}
            theme={{ colors: { primary: Colors(theme).text } }}
          />
          {/* Email Field */}
          <TextInput
            autoCapitalize="none"
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={styles.input}
            theme={{ colors: { primary: Colors(theme).text } }}
          />
          {/* Password Field */}
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            mode="outlined"
            style={styles.input}
            theme={{ colors: { primary: Colors(theme).text } }}
          />
          <TextInput
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            mode="outlined"
            style={styles.input}
            theme={{ colors: { primary: Colors(theme).text } }}
          />
          {/* Sign Up Button */}
          <Button
            mode="contained"
            onPress={() => signUp(name, email, password)}
          >
            Signup
          </Button>
        </View>
        {/* Login Prompt */}
        <Text style={styles.loginText}>
          Already have an account?{" "}
          <Text
            style={styles.loginLink}
            onPress={() => router.replace("/(auth)/login")}
          >
            Login
          </Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;
