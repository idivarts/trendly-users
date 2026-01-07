import { CREATORS_APPSTORE_URL, CREATORS_PLAYSTORE_URL } from "@/shared-constants/app";
import { Platform } from "react-native";

export const APP_NAME = "Trendly Users";

export const APP_SCHEME = "trendly-creators";
export const APP_STORE_URL = CREATORS_APPSTORE_URL;
export const PLAY_STORE_URL = CREATORS_PLAYSTORE_URL;

export const IS_INSTA_ENABLED = true;

export const IS_INSIGHT_ENABLED = false; //(process.env.EXPO_PUBLIC_APP_STAGE == "dev")

export const IS_BETA_ENABLED = Platform.OS == "web" ? (localStorage.getItem("v2") ? true : false) : false