import { APP_SCHEME, APP_STORE_URL, PLAY_STORE_URL } from "@/constants/App";
import { Console } from "@/shared-libs/utils/console";
import { Linking, Platform } from "react-native";

export const handleDeepLink = async (
  redirectUrl?: string,
  screenSize?: boolean
) => {
  if (screenSize) return;

  if (Platform.OS === "web" && !screenSize) {
    await Linking.openURL(APP_STORE_URL);
  }

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
    Console.error(error, "Error handling deep link:");
  }
};
