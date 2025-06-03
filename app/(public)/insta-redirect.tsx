import { useTheme } from "@react-navigation/native";
import { ActivityIndicator } from "react-native";

import { Text, View } from "@/components/theme/Themed";
import { Console } from "@/shared-libs/utils/console";
import Colors from "@/shared-uis/constants/Colors";
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
                Console.log("Code: ", code);
                Console.log("Parent", window.parent);

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
