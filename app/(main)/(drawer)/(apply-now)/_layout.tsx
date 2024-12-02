import AppLayout from "@/layouts/app-layout";
import { Stack } from "expo-router";

const ApplyNowScreensLayout = () => {
  return (
    <AppLayout>
      <Stack
        screenOptions={{
          animation: "ios",
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="apply-now"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="apply-now/gallery"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="apply-now/preview"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </AppLayout>
  );
};

export default ApplyNowScreensLayout;
