import React from "react";
import { Stack } from "expo-router";

const AuthScreens = () => (
  <Stack
    screenOptions={{
      animation: "ios",
    }}
  >
    <Stack.Screen name="(auth)" options={{ headerShown: false }} />
  </Stack>
);

export default AuthScreens;
