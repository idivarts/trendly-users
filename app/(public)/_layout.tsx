import { CollaborationContextProvider, NotificationContextProvider } from "@/contexts";
import AppLayout from "@/layouts/app-layout";
import { Stack } from "expo-router";
import { View } from "react-native";

const PublicLayout = () => {
  return (
    <AppLayout>
      <CollaborationContextProvider>
        <NotificationContextProvider>
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
                name="collaboration/[collaborationId]"
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="insta-redirect"
                options={{
                  headerShown: false,
                }}
              />
            </Stack>
          </View>
        </NotificationContextProvider>
      </CollaborationContextProvider>
    </AppLayout>
  );
};

export default PublicLayout;
