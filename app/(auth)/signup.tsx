import { Button, Text, View } from "react-native";
import { useAuthContext } from "@/contexts";
import { DUMMY_USER_CREDENTIALS } from "@/constants/User";

const Signup = () => {
  const {
    signUp,
  } = useAuthContext();

  const handleSignUp = () => {
    signUp(
      DUMMY_USER_CREDENTIALS.name,
      DUMMY_USER_CREDENTIALS.email,
      DUMMY_USER_CREDENTIALS.password
    );
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
