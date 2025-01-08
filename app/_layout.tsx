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
import { Linking, Platform } from "react-native";
import "react-native-reanimated";
import { useColorScheme } from "@/components/theme/useColorScheme";
import {
  AuthContextProvider,
  AWSContextProvider,
  BrandContextProvider,
  CloudMessagingContextProvider,
  CollaborationContextProvider,
  ContractContextProvider,
  FirebaseStorageContextProvider,
  NotificationContextProvider,
  useAuthContext,
} from "@/contexts";
import CustomPaperTheme from "@/constants/Theme";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { SocialContextProvider } from "@/contexts/social-context.provider";
import { APP_SCHEME } from "@/constants/App";
import { resetAndNavigate } from "@/utils/router";
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
      <SocialContextProvider>
        <GestureHandlerRootView>
          <BottomSheetModalProvider>
            <AWSContextProvider>
              <FirebaseStorageContextProvider>
                <BrandContextProvider>
                  <CollaborationContextProvider>
                    <ContractContextProvider>
                      <NotificationContextProvider>
                        <CloudMessagingContextProvider>
                          <RootLayoutStack />
                        </CloudMessagingContextProvider>
                      </NotificationContextProvider>
                    </ContractContextProvider>
                  </CollaborationContextProvider>
                </BrandContextProvider>
              </FirebaseStorageContextProvider>
            </AWSContextProvider>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </SocialContextProvider>
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

  const linkingWorkaround = () => {
    const subscription = Linking.addEventListener("url", ({ url }) => {
      const match = url.match(new RegExp(`^${APP_SCHEME}://(.*)`));
      if (match) {
        router.navigate(`/${match[1]}` as Href);
      }
    });

    return () => {
      subscription.remove();
    }
  }

  useEffect(() => {
    linkingWorkaround();
  }, []);

  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";
    const inMainGroup = segments[0] === "(main)";
    const inPublicGroup = segments[0] === "(public)";

    if (isLoading) return;

    if (Platform.OS !== "web") {
      if (
        session
        && !inPublicGroup
        && (pathname === "/" || inAuthGroup)
      ) {
        // On boot up, session exist and user is not in public group
        resetAndNavigate("/(main)/collaborations");
      } else if (!session && !inPublicGroup) {
        // On boot up, session doesn't exist and user is not in public group, redirect to pre-signin
        resetAndNavigate("/pre-signin");
      }
      // Redirect user to respective screen
    } else {
      if (
        session
        && !inPublicGroup
        && (pathname === "/" || inAuthGroup)
      ) {
        // On boot up, session exist and user is not in public group
        resetAndNavigate("/(main)/collaborations");
      } else if (!session && inMainGroup) {
        // On boot up, session doesn't exist and user is in main group, redirect to pre-signin
        resetAndNavigate("/pre-signin");
      }
      // Redirect user to respective screen
    }
  }, [session, isLoading, user]);

  return (
    <ThemeProvider value={appTheme === "dark" ? DarkTheme : ExpoDefaultTheme}>
      <Provider theme={CustomPaperTheme(theme)}>
        <Stack
          screenOptions={{
            animation: "ios",
            headerShown: false,
          }}
        >
          <Stack.Screen name="(main)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(public)" options={{ headerShown: false }} />
          <Stack.Screen name="index" />
          <Stack.Screen name="modal" options={{ presentation: "modal" }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </Provider>
    </ThemeProvider>
  );
};

export default RootLayout;
