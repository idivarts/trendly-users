import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Button } from "react-native";
import { useEffect } from "react";
import { requestUserPermission, setupForegroundMessageListener } from "@/utils/messaging";

const PreSignin = () => {
  const router = useRouter();

  useEffect(() => {
    requestUserPermission();
    setupForegroundMessageListener();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
      }}
    >
      <Text>PreSignin</Text>
      <Button title="Next" onPress={() => router.replace("/signup")} />
    </View>
  );
};

export default PreSignin;
