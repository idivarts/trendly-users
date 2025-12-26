import { useTheme } from "@react-navigation/native";
import { ActivityIndicator } from "react-native";

import { Text, View } from "@/components/theme/Themed";
import { Console } from "@/shared-libs/utils/console";
import { useMyNavigation } from "@/shared-libs/utils/router";
import Colors from "@/shared-uis/constants/Colors";
import { useURL } from "expo-linking";
import { useEffect } from "react";

const Index = () => {
    const theme = useTheme();
    const { resetAndNavigate } = useMyNavigation()
    const url = useURL();
    useEffect(() => {
        if (url) {
            const params = new URLSearchParams(url.split("?")[1])
            const code = params.get("code")
            if (code) {
                Console.log("Code: ", code);
                Console.log("Parent", window.parent);

                localStorage.setItem("insta_code", code);
                window.close();
            } else {
                resetAndNavigate("/")
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
