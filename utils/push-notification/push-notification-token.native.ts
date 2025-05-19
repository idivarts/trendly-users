import { messaging } from "@/shared-libs/utils/firebase/messaging";
import { User } from "@/types/User";
import { removeToken } from "@/utils/token";
import { Platform } from "react-native";

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
