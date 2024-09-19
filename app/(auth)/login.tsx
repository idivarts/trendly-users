import { Text, View } from "react-native";
import { useAuthContext } from "@/contexts";
import { Button } from "react-native";

const Login = () => {
  const { signIn } = useAuthContext();

  const handleSignIn = () => {
    signIn("token");
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
      }}
    >
      <Text>Login</Text>
      <Button title="Login" onPress={handleSignIn} />
    </View>
  );
};

export default Login;
