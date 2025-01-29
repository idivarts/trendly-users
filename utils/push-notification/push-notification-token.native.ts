import messaging from "@react-native-firebase/messaging";
import { Platform } from "react-native";
import { User } from "@/types/User";
import { removeToken } from "@/utils/token";

export const updatedTokens = async (user: User | null) => {
  if (!user) return null;

  let newUpdatedTokens: {
    ios?: string[];
    android?: string[];
    web?: string[];
  } | null = null;

  const token = await messaging().getToken();

  if (Platform.OS === "ios") {
    newUpdatedTokens = removeToken("ios", user, token);
  } else if (Platform.OS === "android") {
    newUpdatedTokens = removeToken("android", user, token);
  }

  await messaging().deleteToken();

  return newUpdatedTokens;
};
