import { ChatContextProvider, ChatProvider } from "@/contexts";
import { Stack } from "expo-router";

const MainLayout = () => {
  return (
    <ChatProvider>
      <ChatContextProvider>
        <Stack
          screenOptions={{
            animation: "ios",
            headerShown: false,
          }}
        >
          <Stack.Screen
            name="(drawer)"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="(screens)"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      </ChatContextProvider>
    </ChatProvider>
  );
};

export default MainLayout;
