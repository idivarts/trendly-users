import InstagramLoginButton from "@/components/profile/ConnectWithInstagram";
import SocialPage from "@/components/profile/SocialPage";
import Button from "@/components/ui/button";
import { IS_INSTA_ENABLED } from "@/constants/App";
import { useAuthContext, useCloudMessagingContext, useSocialContext } from "@/contexts";
import AppLayout from "@/layouts/app-layout";
import { SocialPlatform } from "@/shared-libs/firestore/trendly-pro/constants/social-platform";
import { useMyNavigation } from "@/shared-libs/utils/router";
import Colors from "@/shared-uis/constants/Colors";
import { useTheme } from "@react-navigation/native";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";



const TrendlyScreen = () => {
    const { signOutUser } = useAuthContext();
    const { updatedTokens } = useCloudMessagingContext();
    const { primarySocial } = useSocialContext();
    const { resetAndNavigate } = useMyNavigation()
    const theme = useTheme();
    const color = Colors(theme);



    const logout = async () => {
        await updatedTokens?.()
        await signOutUser();
    }
    useEffect(() => {
        if (!IS_INSTA_ENABLED) {
            resetAndNavigate("/")
        }
    }, [])

    if (!primarySocial) {
        // resetAndNavigate("/no-social-connected")
        return null;
    }
    return (
        <AppLayout withWebPadding={true}>
            <View
                style={{
                    flex: 1,
                    backgroundColor: Colors(theme).background,
                    padding: 16,
                    justifyContent: "space-between",
                }}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={[styles.title, { color: Colors(theme).text }]}>Trendly</Text>
                    <Button
                        mode="text"
                        labelStyle={{
                            color: Colors(theme).primary,
                            fontSize: 16,
                        }}
                        onPress={logout}
                    >
                        Logout
                    </Button>
                </View>

                <View style={{ flex: 1, justifyContent: "center" }}>
                    {/* Illustration */}
                    <View>
                        {primarySocial &&
                            <View style={styles.imageContainer}>
                                <SocialPage
                                    handle={
                                        primarySocial.isInstagram ? primarySocial.instaProfile?.username || "" : ""
                                    }
                                    profile={primarySocial.isInstagram ? primarySocial.instaProfile : primarySocial.fbProfile}
                                    platform={
                                        primarySocial.isInstagram
                                            ? SocialPlatform.INSTAGRAM
                                            : SocialPlatform.FACEBOOK
                                    }
                                    name={primarySocial.isInstagram ? primarySocial.instaProfile?.username || "" : ""}
                                    id={primarySocial.id}
                                    image={primarySocial.image}
                                    hideOptions={true}
                                />
                                {/* <ImageComponent url={primarySocial?.image || ""} altText={primarySocial?.name || ""} /> */}
                                {/* <Image
                                source={primarySocial?.image || ""} // Replace with your local image
                                style={styles.image}
                                resizeMode="contain"
                            /> */}
                            </View>}

                        {/* No Account Text */}
                        <Text style={[styles.noAccountText, { color: Colors(theme).text }]}>Instagram Login Required</Text>
                        <Text
                            style={{
                                textAlign: "center",
                                color: Colors(theme).gray100,
                                marginBottom: 30,
                            }}
                        >
                            We noticed that you added instagram manually during your last onboarding. However, now we dont allow that
                        </Text>
                        <View style={styles.buttonContainer}>
                            <InstagramLoginButton markAsPrimary={true} buttonText="Authorize Instagram" />
                        </View>
                    </View>
                </View>

                {/* Buttons */}

            </View>
        </AppLayout>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",

    },
    imageContainer: {

        alignItems: "stretch",
        width: 600,
        maxWidth: "100%",
        alignSelf: "center",
    },
    image: {
        height: 300,
        width: 300,
    },
    noAccountText: {
        textAlign: "center",
        fontSize: 18,
        fontWeight: "bold",
        marginVertical: 20,
    },
    buttonContainer: {
        alignItems: "center",
        marginTop: 20,
    },
    button: {
        marginVertical: 10,
        paddingVertical: 5,
    },
});

export default TrendlyScreen;
