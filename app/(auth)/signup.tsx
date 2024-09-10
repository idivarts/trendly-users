import { Button, Text, View } from "react-native";
import { useAuthContext } from "@/contexts";

const Signup = () => {
  const {
    signUp,
  } = useAuthContext();

  const handleSignUp = () => {
    signUp();
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
      <Text>Signup</Text>
      <Button title="Signup" onPress={handleSignUp} />
    </View>
  );
};

export default Signup;
