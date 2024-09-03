import { Text, View } from "@/components/theme/Themed";
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
      <Button title="Next" onPress={() => router.push("/one")} />
    </View>
  );
};

export default Onboard;
