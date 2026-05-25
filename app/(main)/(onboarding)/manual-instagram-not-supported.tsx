import SocialPage from "@/components/profile/SocialPage";
import Button from "@/components/ui/button";
import { useAuthContext, useCloudMessagingContext, useSocialContext } from "@/contexts";
import { useConnectSocial } from "@/hooks/requests";
import AppLayout from "@/layouts/app-layout";
import { SocialPlatform } from "@/shared-libs/firestore/trendly-pro/constants/social-platform";
import Colors from "@/shared-uis/constants/Colors";
import { useTheme } from "@react-navigation/native";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

const TrendlyScreen = () => {
    const { signOutUser } = useAuthContext();
    const { updatedTokens } = useCloudMessagingContext();
    const { primarySocial } = useSocialContext();
    const { connectSocial } = useConnectSocial();
    const theme = useTheme();

    const logout = async () => {
        await updatedTokens?.();
        await signOutUser();
    };

    if (!primarySocial) {
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
                    <View>
                        <View style={styles.imageContainer}>
                            <SocialPage
                                handle={primarySocial.username}
                                profile={{ name: primarySocial.displayName }}
                                platform={SocialPlatform.INSTAGRAM}
                                name={primarySocial.displayName}
                                id={primarySocial.id}
                                image={primarySocial.profileImageURL}
                                hideOptions={true}
                            />
                        </View>

                        <Text style={[styles.noAccountText, { color: Colors(theme).text }]}>
                            Instagram Login Required
                        </Text>
                        <Text
                            style={{
                                textAlign: "center",
                                color: Colors(theme).gray100,
                                marginBottom: 30,
                            }}
                        >
                            We noticed that you added instagram manually during your last onboarding. However, now we don't allow that.
                        </Text>
                        <View style={styles.buttonContainer}>
                            <Button
                                mode="contained"
                                style={{ marginVertical: 10, paddingVertical: 5 }}
                                onPress={() => connectSocial("instagram")}
                                icon="instagram"
                                labelStyle={{ color: "white", fontSize: 16 }}
                            >
                                Authorize Instagram
                            </Button>
                        </View>
                    </View>
                </View>
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
