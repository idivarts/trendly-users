import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme as ExpoDefaultTheme,
  ThemeProvider,
  useTheme,
} from "@react-navigation/native";
import { Provider } from "react-native-paper";
import { useFonts } from "expo-font";
import { Href, Stack, usePathname, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { useColorScheme } from "@/components/theme/useColorScheme";
import {
  AuthContextProvider,
  AWSContextProvider,
  CloudMessagingContextProvider,
  FirebaseStorageContextProvider,
  NotificationContextProvider,
  useAuthContext,
} from "@/contexts";
import CustomPaperTheme from "@/constants/Theme";
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
      <GestureHandlerRootView>
        <AWSContextProvider>
          <FirebaseStorageContextProvider>
            <NotificationContextProvider>
              <CloudMessagingContextProvider>
                <RootLayoutStack />
              </CloudMessagingContextProvider>
            </NotificationContextProvider>
          </FirebaseStorageContextProvider>
        </AWSContextProvider>
      </GestureHandlerRootView>
    </AuthContextProvider>
  );
};

const RootLayoutStack = () => {
  const colorScheme = useColorScheme();
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const segments = useSegments();
  const { isLoading, session, user } = useAuthContext();

  const appTheme = user?.settings?.theme || colorScheme;

  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";
    const inMainGroup = segments[0] === "(main)";

    if (isLoading) return;

    if (session && inMainGroup) {
      // Redirect to main group path if signed in
      router.replace(pathname as Href);
    } else if (session) {
      // Redirect to main group if signed in
      router.replace("/collaborations");
      // router.replace("/pre-signin");
    } else if (!session && !inAuthGroup) {
      // App should start at pre-signin
      router.replace("/pre-signin");
    } else if (!session && inMainGroup) {
      // User can't access main group if not signed in
      router.replace("/login");
    }
  }, [session, isLoading]);

  return (
    <ThemeProvider value={appTheme === "dark" ? DarkTheme : ExpoDefaultTheme}>
      <Provider
        theme={CustomPaperTheme(theme)}
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
      </Provider>
    </ThemeProvider>
  );
};

export default RootLayout;
