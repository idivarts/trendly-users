import { GroupContextProvider } from "@/contexts";
import { Stack } from "expo-router";

const MainLayout = () => {
  return (
    <GroupContextProvider>
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
    </GroupContextProvider>
  );
};

export default MainLayout;
