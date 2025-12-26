import { IS_INSTA_ENABLED } from "@/constants/App";
import { useInitialUserData } from "@/constants/User";
import { useAuthContext, useSocialContext } from "@/contexts";
import { useInstagramLogin } from "@/hooks/requests";
import { ISocials } from "@/shared-libs/firestore/trendly-pro/models/socials";
import { AuthApp } from "@/shared-libs/utils/firebase/auth";
import { FirestoreDB } from "@/shared-libs/utils/firebase/firestore";
import { useMyNavigation } from "@/shared-libs/utils/router";
import * as WebBrowser from "expo-web-browser";
import React, { useState } from "react";
import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import Button from "../ui/button";

WebBrowser.maybeCompleteAuthSession();

interface IProps {
    markAsPrimary?: boolean;
    buttonText?: string
}
const InstagramLoginButton: React.FC<IProps> = ({ markAsPrimary, buttonText }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null)
    const INITIAL_DATA = useInitialUserData();
    const { user, updateUser } = useAuthContext()
    const { resetAndNavigate } = useMyNavigation()
    const { primarySocial } = useSocialContext()

    const { instagramLogin } = useInstagramLogin(AuthApp, FirestoreDB, INITIAL_DATA, setIsLoading, setError, (social) => {
        onInstagramLogin(social);
    });

    const onInstagramLogin = async (social: ISocials) => {
        if (!primarySocial) {
            updateUser(user?.id || "", { primarySocial: social.id });
            resetAndNavigate("/questions");
        } else if (markAsPrimary) {
            updateUser(user?.id || "", { primarySocial: social.id });
            resetAndNavigate("/collaborations");
        }
    }

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
                    {buttonText || "Add Instagram Account"}
                </Button>
            )}
        </View>
    );
};

export default InstagramLoginButton;
