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
        <Stack.Screen
          name="notifications"
          options={{
            presentation: "modal",
          }}
        />
      </Stack>
    </AppLayout>
  );
};

export default ScreensLayout;
