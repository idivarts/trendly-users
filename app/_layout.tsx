import "react-native-reanimated";

import DownloadApp from "@/components/download";
import { useColorScheme } from "@/components/theme/useColorScheme";
import { APP_SCHEME } from "@/constants/App";
import CustomPaperTheme from "@/constants/Theme";
import {
    AuthContextProvider,
    ThemeContextProvider,
    useAuthContext,
    useThemeContext,
} from "@/contexts";
import UpdateProvider from "@/shared-libs/contexts/update-provider";
import { Console } from "@/shared-libs/utils/console";
import { useMyNavigation } from "@/shared-libs/utils/router";
import { ConfirmationModalProvider } from "@/shared-uis/components/ConfirmationModal";
import { queryParams } from "@/utils/url";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import {
    DarkTheme,
    DefaultTheme as ExpoDefaultTheme,
    ThemeProvider,
    useTheme,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import {
    Href,
    Stack,
    useGlobalSearchParams,
    usePathname,
    useSegments,
} from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { Linking } from "react-native";
import { setJSExceptionHandler } from "react-native-exception-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-native-paper";

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary
} from "expo-router";

export const unstable_settings = {
    // Ensure that reloading on `/modal` keeps a back button present.
    initialRouteName: "(public)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

setJSExceptionHandler((error, isFatal) => {
    Console.log("Error Occured is Fatal", isFatal);
    Console.error(error);
});

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
        <UpdateProvider force={true} influencerApp={true}>
            <AuthContextProvider>
                <ThemeContextProvider>
                    <GestureHandlerRootView>
                        <BottomSheetModalProvider>
                            <RootLayoutStack />
                        </BottomSheetModalProvider>
                    </GestureHandlerRootView>
                </ThemeContextProvider>
            </AuthContextProvider>
        </UpdateProvider>
    );
};

const RootLayoutStack = () => {
    const colorScheme = useColorScheme();
    const { resetAndNavigate } = useMyNavigation();
    const theme = useTheme();
    const router = useMyNavigation();
    const pathname = usePathname();
    const segments = useSegments();
    const searchParams = useGlobalSearchParams();
    const { isLoading, session, user } = useAuthContext();
    const { currentTheme } = useThemeContext();

    const appTheme = currentTheme;

    const linkingWorkaround = () => {
        Console.log("Linking workaround initiated", "RootLayout");
        const subscription = Linking.addEventListener("url", ({ url }) => {
            const match = url.match(new RegExp(`^${APP_SCHEME}://(.*)`));
            if (match) {
                router.push(`/${match[1]}` as Href);
            }
        });

        return () => {
            subscription.remove();
        };
    };

    useEffect(() => {
        // Console.log("App started", "RootLayout");
        linkingWorkaround();
    }, []);

    useEffect(() => {
        const inAuthGroup = segments[0] === "(auth)";
        const inMainGroup = segments[0] === "(main)";
        const inPublicGroup = segments[0] === "(public)";

        if (isLoading) return;

        if (session && (inAuthGroup || pathname === "/")) {
            // On boot up, session exist and user is in auth group or /, redirect to collaborations
            resetAndNavigate(`/collaborations${queryParams(searchParams)}` as Href);
        } else if (!session && (inMainGroup || pathname === "/")) {
            // On boot up, session doesn't exist and user is in main group or /, redirect to pre-signin
            resetAndNavigate("/pre-signin");
        } else if (inPublicGroup) {
            resetAndNavigate(`${pathname}${queryParams(searchParams)}` as Href);
        }
        // Redirect user to respective screen
    }, [session, isLoading]);

    return (
        <ThemeProvider value={appTheme === "dark" ? DarkTheme : ExpoDefaultTheme}>
            <Provider theme={CustomPaperTheme(theme)}>
                <DownloadApp />
                <ConfirmationModalProvider>
                    <Stack
                        screenOptions={{
                            headerShown: false,
                        }}
                    >
                        {/* <Stack.Screen name="(main)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(public)" options={{ headerShown: false }} /> */}
                        <Stack.Screen name="index" />
                        <Stack.Screen name="+not-found" />
                        {/* <Stack.Screen name="modal" options={{ presentation: "modal" }} /> */}
                    </Stack>
                </ConfirmationModalProvider>
            </Provider>
        </ThemeProvider>
    );
};

export default RootLayout;
