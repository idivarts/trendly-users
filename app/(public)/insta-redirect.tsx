import { useTheme } from "@react-navigation/native";
import { ActivityIndicator } from "react-native";

import { Text, View } from "@/components/theme/Themed";
import Colors from "@/constants/Colors";
import { CrashLog } from "@/shared-libs/utils/firebase/crashlytics";
import { useURL } from "expo-linking";
import { useEffect } from "react";

const Index = () => {
    const theme = useTheme();

    const url = useURL();
    useEffect(() => {
        if (url) {
            const params = new URLSearchParams(url.split("?")[1])
            const code = params.get("code")
            if (code) {
                CrashLog.log("Code: ", code);
                CrashLog.log("Parent", window.parent);

                // window.parent.postMessage({ code }, "*");
                // window.opener.postMessage({ code }, "*");
                localStorage.setItem("insta_code", code);
                window.close();
            } else {
                // localStorage.setItem("insta_code", "Somethign");
                // window.parent.postMessage({ code: "Somethign" }, "*");
                // window.opener.postMessage({ code: "Somethign" }, "*");
            }
        }
    }, [url])

    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Text>Loading insta Credentials</Text>
            <ActivityIndicator
                size="large"
                color={Colors(theme).primary}
            />
        </View>
    );
};

export default Index;
