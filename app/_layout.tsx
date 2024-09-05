import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme as ExpoDefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, usePathname, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/components/theme/useColorScheme";
import { AuthContextProvider, useAuthContext } from "@/contexts";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(public)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthContextProvider>
      <RootLayoutStack />
    </AuthContextProvider>
  );
};

const RootLayoutStack = () => {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const pathname = usePathname();
  const segments = useSegments();
  const { isLoading, session } = useAuthContext();

  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";
    const inMainGroup = segments[0] === "(main)";

    if (isLoading) return;

    if (session && inMainGroup) {
      // Redirect to main group path if signed in
      router.replace(pathname);
    } else if (session) {
      // Redirect to main group if signed in
      router.replace("/one");
    } else if (!session && !inAuthGroup) {
      // App should start at pre-signin
      router.replace("/pre-signin");
    } else if (!session && inMainGroup) {
      // User can't access main group if not signed in
      router.replace("/login");
    }
  }, [session, isLoading]);

  return (
    <ThemeProvider
      value={colorScheme === "dark" ? DarkTheme : ExpoDefaultTheme}
    >
      <Stack
        screenOptions={{
          animation: "ios",
          headerShown: false,
        }}
      >
        <Stack.Screen name="(public)" options={{ headerShown: false }} />
        {!session ? (
          <Stack.Screen name="(main)" options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        )}
        <Stack.Screen name="index" />
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      {/* <Toast /> */}
    </ThemeProvider>
  );
};

export default RootLayout;
