import { useBreakpoints } from "@/hooks";
import AppLayout from "@/layouts/app-layout";
import {
    BRANDS_APPSTORE_URL,
    BRANDS_PLAYSTORE_URL,
    CREATORS_APPSTORE_URL,
    CREATORS_PLAYSTORE_URL,
} from "@/shared-constants/app";
import Colors from "@/shared-uis/constants/Colors";
import { faApple, faGooglePlay } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useTheme } from "@react-navigation/native";
import Constants from "expo-constants";
import { useMemo, useState } from "react";
import { Linking, ScrollView, StyleSheet, View } from "react-native";
import { Text } from "../theme/Themed";
import Button from "../ui/button";

const CREATOR_SLUG = "trendly-creators";

type MobileWebOs = "ios" | "android" | null;

const detectMobileWebOs = (): MobileWebOs => {
    if (typeof window === "undefined") {
        return null;
    }
    const userAgent = window.navigator.userAgent;
    const isIOS =
        /iPad|iPhone|iPod/.test(userAgent) ||
        (/Mac/.test(userAgent) && window.navigator.maxTouchPoints > 1);
    const isAndroid = /Android/i.test(userAgent);
    if (isIOS) {
        return "ios";
    }
    if (isAndroid) {
        return "android";
    }
    return null;
};

const ChannelListWeb = () => {
    const theme = useTheme();
    const colors = Colors(theme);
    const styles = useMemo(() => createStyles(colors), [colors]);
    const { lg } = useBreakpoints();
    const [mobileWebOs] = useState<MobileWebOs>(() => detectMobileWebOs());

    const isCreatorsApp = Constants.expoConfig?.slug === CREATOR_SLUG;
    const appStoreUrl = isCreatorsApp ? CREATORS_APPSTORE_URL : BRANDS_APPSTORE_URL;
    const playStoreUrl = isCreatorsApp ? CREATORS_PLAYSTORE_URL : BRANDS_PLAYSTORE_URL;

    const showBothStoreButtons = lg || mobileWebOs === null;

    const openUrl = (url: string) => {
        void Linking.openURL(url);
    };

    const buttonTheme = useMemo(
        () => ({
            colors: {
                primary: colors.primary,
            },
        }),
        [colors.primary]
    );

    return (
        <AppLayout>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.panel}>
                    <Text style={styles.title}>Messaging lives in the app</Text>
                    <Text style={styles.subtitle}>
                        Download Trendly on your phone to read and send messages, stay in sync with
                        brands, and keep your collaborations moving.
                    </Text>

                    {showBothStoreButtons ? (
                        <View style={styles.buttonRow}>
                            <Button
                                icon={() => (
                                    <FontAwesomeIcon
                                        color={colors.onPrimary}
                                        icon={faGooglePlay}
                                        size={20}
                                        style={styles.buttonIcon}
                                    />
                                )}
                                mode="contained"
                                onPress={() => openUrl(playStoreUrl)}
                                style={[styles.storeButton, styles.storeButtonInRow]}
                                theme={buttonTheme}
                            >
                                Google Play
                            </Button>
                            <Button
                                icon={() => (
                                    <FontAwesomeIcon
                                        color={colors.onPrimary}
                                        icon={faApple}
                                        size={20}
                                        style={styles.buttonIcon}
                                    />
                                )}
                                mode="contained"
                                onPress={() => openUrl(appStoreUrl)}
                                style={[styles.storeButton, styles.storeButtonInRow]}
                                theme={buttonTheme}
                            >
                                App Store
                            </Button>
                        </View>
                    ) : mobileWebOs === "android" ? (
                        <Button
                            icon={() => (
                                <FontAwesomeIcon
                                    color={colors.onPrimary}
                                    icon={faGooglePlay}
                                    size={20}
                                    style={styles.buttonIcon}
                                />
                            )}
                            mode="contained"
                            onPress={() => openUrl(playStoreUrl)}
                            style={styles.storeButton}
                            theme={buttonTheme}
                        >
                            Get it on Google Play
                        </Button>
                    ) : (
                        <Button
                            icon={() => (
                                <FontAwesomeIcon
                                    color={colors.onPrimary}
                                    icon={faApple}
                                    size={20}
                                    style={styles.buttonIcon}
                                />
                            )}
                            mode="contained"
                            onPress={() => openUrl(appStoreUrl)}
                            style={styles.storeButton}
                            theme={buttonTheme}
                        >
                            Download on the App Store
                        </Button>
                    )}

                    <Text style={styles.hint}>Scan or tap above from your phone to install.</Text>
                </View>
            </ScrollView>
        </AppLayout>
    );
};

export default ChannelListWeb;

const createStyles = (colors: ReturnType<typeof Colors>) =>
    StyleSheet.create({
        scrollContent: {
            flexGrow: 1,
            justifyContent: "center",
            paddingHorizontal: 24,
            paddingVertical: 32,
        },
        panel: {
            alignSelf: "center",
            maxWidth: 440,
            width: "100%",
            backgroundColor: colors.card,
            borderRadius: 16,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: colors.border,
            paddingHorizontal: 24,
            paddingVertical: 28,
        },
        title: {
            fontSize: 22,
            fontWeight: "700",
            color: colors.text,
            textAlign: "center",
            marginBottom: 12,
        },
        subtitle: {
            fontSize: 16,
            lineHeight: 24,
            color: colors.textSecondary,
            textAlign: "center",
            marginBottom: 28,
        },
        buttonRow: {
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 12,
            justifyContent: "center",
        },
        storeButton: {
            minWidth: "100%",
        },
        storeButtonInRow: {
            flex: 1,
            minWidth: 140,
        },
        buttonIcon: {
            marginRight: 8,
        },
        hint: {
            marginTop: 20,
            fontSize: 13,
            lineHeight: 18,
            color: colors.textSecondary,
            textAlign: "center",
        },
    });
