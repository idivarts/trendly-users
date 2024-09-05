import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Button } from "react-native";

const Onboard = () => {
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
      }}
    >
      <Text>Onboard</Text>
      <Button title="Next" onPress={() => router.replace("/one")} />
    </View>
  );
};

export default Onboard;
