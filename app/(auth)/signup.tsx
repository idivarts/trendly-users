import { Text, View } from "@/components/theme/Themed";
import { useAuthContext } from "@/contexts";
import { Button } from "react-native";

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
