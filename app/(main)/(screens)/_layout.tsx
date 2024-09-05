import { View } from "react-native";
import AppLayout from "@/layouts/app-layout";
import { Stack, useNavigation } from "expo-router";
import { IconButton } from "react-native-paper";

const ScreensLayout = () => {
  const navigation = useNavigation();
  return (
    <AppLayout>
      <View
        style={{
          flex: 1,
        }}
      >
        <Stack
          screenOptions={{
            animation: "ios",
            headerShown: false,
          }}
        >
          <Stack.Screen
            name="collaboration"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen name="collaboration-details" options={{}} />
          <Stack.Screen name="apply-now" options={{}} />
        </Stack>
      </View>
    </AppLayout>
  );
};

export default ScreensLayout;
