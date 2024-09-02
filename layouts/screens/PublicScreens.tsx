import { Stack } from "expo-router";

const PublicScreens = () => {
  return (
    <Stack
      screenOptions={{
        animation: "ios",
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="(pre-signin)" options={{ headerShown: false }} />
      <Stack.Screen name="(onboard)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
};

export default PublicScreens;
