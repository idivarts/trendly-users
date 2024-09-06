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
          name="collaboration"
        />
        <Stack.Screen
          name="collaboration-details"
        />
        <Stack.Screen
          name="apply-now"
        />
        <Stack.Screen
          name="notifications"
          options={{
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="chat"
        />
      </Stack>
    </AppLayout>
  );
};

export default ScreensLayout;
