import { IS_INSTA_ENABLED } from "@/constants/App";
import { useInitialUserData } from "@/constants/User";
import { useInstagramLogin } from "@/hooks/requests";
import { AuthApp } from "@/shared-libs/utils/firebase/auth";
import { FirestoreDB } from "@/shared-libs/utils/firebase/firestore";
import * as WebBrowser from "expo-web-browser";
import React, { useState } from "react";
import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import Button from "../ui/button";

WebBrowser.maybeCompleteAuthSession();

const InstagramLoginButton: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null)
    const INITIAL_DATA = useInitialUserData();

    const { instagramLogin } = useInstagramLogin(AuthApp, FirestoreDB, INITIAL_DATA, setIsLoading, setError);

    if (!IS_INSTA_ENABLED)
        return null;

    return (
        <View>
            {isLoading ? (
                <ActivityIndicator
                    animating={true}
                    size="large"
                    style={{ marginVertical: 10 }}
                />
            ) : (
                <Button
                    mode="contained"
                    style={{ marginVertical: 10, paddingVertical: 5 }}
                    onPress={instagramLogin}
                    icon={"instagram"}
                    labelStyle={{ color: "white", fontSize: 16 }}
                >
                    Add Instagram Account
                </Button>
            )}
        </View>
    );
};

export default InstagramLoginButton;
