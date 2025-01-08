import { APP_SCHEME, APP_STORE_URL, PLAY_STORE_URL } from "@/constants/App";
import { Linking, Platform } from "react-native";

export const handleDeepLink = async (
  redirectUrl: string,
  screenSize: boolean
) => {
  if (screenSize) return;

  const url = `${APP_SCHEME}://${redirectUrl}`;

  try {
    const canOpen = await Linking.canOpenURL(url);

    if (canOpen) {
      await Linking.openURL(url);
    } else {
      const storeUrl = Platform.OS === "ios" ? APP_STORE_URL : PLAY_STORE_URL;
      await Linking.openURL(storeUrl);
    }
  } catch (error) {
    console.error("Error handling deep link:", error);
  }
};
