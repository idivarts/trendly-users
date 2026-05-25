import { IS_LIVE } from "@/shared-libs/utils/environment";
import { AuthApp } from "@/shared-libs/utils/firebase/auth";
import { Linking, Platform } from "react-native";

const CONNECT_BASE = IS_LIVE
    ? "https://connect.trendly.now"
    : "https://dev.connect.trendly.now";

const useConnectSocial = () => {
    const connectSocial = async (platform?: string) => {
        const token = await AuthApp.currentUser?.getIdToken();
        if (!token) return;

        const url = new URL(`${CONNECT_BASE}/connect/`);
        url.searchParams.set("token", token);
        url.searchParams.set("app", "users");
        url.searchParams.set("callbackScheme", "trendly-creators");
        if (!IS_LIVE) url.searchParams.set("stage", "dev");
        if (platform) url.searchParams.set("platform", platform);

        if (Platform.OS === "web") {
            window.open(url.toString(), "_blank");
        } else {
            await Linking.openURL(url.toString());
        }
    };

    return { connectSocial };
};

export default useConnectSocial;
