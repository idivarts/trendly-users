import AppLayout from "@/layouts/app-layout";
import { SocialsProtectedScreen } from "@/layouts/protected";
import { Stack } from "expo-router";

const ScreensLayout = () => {
  return (
    <AppLayout>
      <SocialsProtectedScreen>
        <Stack
          screenOptions={{
            animation: "ios",
            headerShown: false,
          }}>
        </Stack>
      </SocialsProtectedScreen>
    </AppLayout>
  );
};

export default ScreensLayout;
