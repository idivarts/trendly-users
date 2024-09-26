import AppLayout from "@/layouts/app-layout";
import { Stack } from "expo-router";

const ScreensLayout = () => {
  return (
    <AppLayout>
      <Stack
        screenOptions={{
          animation: "ios",
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="questions"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="collaboration-details" />
        <Stack.Screen name="apply-now" />
        <Stack.Screen
          name="notifications"
          options={{
            presentation: "modal",
          }}
        />
        <Stack.Screen name="chat" />
        <Stack.Screen name="basic-profile" />
        <Stack.Screen name="connected-socials" />
        <Stack.Screen name="test-cloud-messaging" />
      </Stack>
    </AppLayout>
  );
};

export default ScreensLayout;
