import { Platform } from "react-native";

export const APP_NAME = "Trendly Users";

export const APP_SCHEME = "trendly-creators";
export const APP_STORE_URL =
    "https://apps.apple.com/app/trendly-collaboration-search/id6733245999";
export const PLAY_STORE_URL =
    "https://play.google.com/store/apps/details?id=pro.trendly.creators";

export const IS_BETA_ENABLED = Platform.OS == "web" ? (localStorage.getItem("v2") ? true : false) : false