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
        <Stack.Screen name="basic-profile" />
        <Stack.Screen name="connected-socials" />
        <Stack.Screen name="my-stats" />
        <Stack.Screen name="reports" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="help-and-support" />
      </Stack>
    </AppLayout>
  );
};

export default ScreensLayout;
