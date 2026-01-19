import ProfileCard from "@/components/profile/ProfileCard";
import ProfileItemCard from "@/components/profile/ProfileItemCard";
import VerificationCard from "@/components/profile/VerificationCard";
import { View } from "@/components/theme/Themed";
import { COMPLETION_PERCENTAGE } from "@/constants/CompletionPercentage";
import { PROFILE_ITEMS } from "@/constants/Profile";
import { useAuthContext, useCloudMessagingContext } from "@/contexts";
import AppLayout from "@/layouts/app-layout";
import { useMyNavigation } from "@/shared-libs/utils/router";
import ConfirmationModal from "@/shared-uis/components/ConfirmationModal";
import Colors from "@/shared-uis/constants/Colors";
import {
    faRightFromBracket,
    faWarning
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useTheme } from "@react-navigation/native";
import { Href } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useCallback, useEffect, useRef, useState } from "react";
import { View as RNView, ScrollView, StyleSheet, Text } from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";

const ProfileScreen = () => {
    const router = useMyNavigation();
    const [logoutModalVisible, setLogoutModalVisible] = useState(false);
    const { signOutUser, user } = useAuthContext();
    const { updatedTokens } = useCloudMessagingContext();
    const [showVerifiedModal, setShowVerifiedModal] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const confettiRef = useRef<ConfettiCannon>(null);

    const theme = useTheme();

    const handleSignOut = async () => {
        setLogoutModalVisible(false);
        await updatedTokens?.();
        await signOutUser();
    };

    const openExternalLink = async (url: string) => {
        if (!url) return;
        await WebBrowser.openBrowserAsync(url);
    };

    useFocusEffect(
        useCallback(() => {
            const checkAndShowConfetti = async () => {
                console.log("🔍 Profile focused - checking KYC status");
                console.log("📊 isKYCDone:", user?.isKYCDone);
                console.log("📊 User KYC status:", user?.kyc?.status);

                // If KYC is not done, reset the flag
                if (!user?.isKYCDone) {
                    console.log("❌ KYC not done - resetting confetti flag");
                    await AsyncStorage.removeItem("PROFILE_VERIFIED_CONFETTI_SHOWN");
                    return;
                }

                console.log("✓ KYC is done, checking if confetti was shown before...");

                const alreadyShown = await AsyncStorage.getItem(
                    "PROFILE_VERIFIED_CONFETTI_SHOWN"
                );

                console.log("📱 Already shown flag:", alreadyShown);

                if (!alreadyShown) {
                    console.log("🎉 Showing confetti and verification modal!");
                    setShowVerifiedModal(true);
                    setShowConfetti(true);
                    await AsyncStorage.setItem(
                        "PROFILE_VERIFIED_CONFETTI_SHOWN",
                        "true"
                    );

                    // Trigger confetti
                    console.log("🚀 Starting confetti animation...");
                    console.log("Confetti ref:", confettiRef.current);

                    if (confettiRef.current) {
                        confettiRef.current.start();
                        console.log("✨ Confetti started!");
                    } else {
                        console.log("⚠️ Confetti ref is null!");
                    }

                    // auto-close modal after 2.5 sec
                    setTimeout(() => {
                        console.log("⏱️ Auto-closing verification modal");
                        setShowVerifiedModal(false);
                    }, 2300);

                    // Unmount confetti after animation finishes (fallSpeed + buffer)
                    setTimeout(() => {
                        console.log("🧹 Unmounting confetti component");
                        setShowConfetti(false);
                    }, 3000);
                } else {
                    console.log("⏭️ Confetti already shown before, skipping...");
                }
            };

            checkAndShowConfetti();
        }, [user?.isKYCDone])
    );

    useEffect(() => {
        console.log(user?.isKYCDone);
    }, [user?.isKYCDone]);

    return (
        <AppLayout>
            {showConfetti && (
                <RNView style={styles.confettiContainer}>
                    <ConfettiCannon
                        ref={confettiRef}
                        count={200}
                        origin={{ x: 200, y: -50 }}
                        fallSpeed={2500}
                        autoStart={false}
                        explosionSpeed={350}
                    />
                </RNView>
            )}
            <ScrollView
                style={{
                    ...styles.container,
                    backgroundColor: Colors(theme).background,
                    padding: 16,
                }}
                contentContainerStyle={{
                    paddingBottom: 16,
                }}
            >
                {user && (
                    <ProfileCard
                        item={user}
                        onPress={() => router.push("/edit-profile")}
                    />


                )}

                <VerificationCard
                    kycStatus={user?.kyc?.status}
                    onStartVerification={() => {
                        router.push("/verification");
                    }}
                />
                {!user?.profile?.completionPercentage ||
                    user?.profile?.completionPercentage < COMPLETION_PERCENTAGE ? (
                    <View
                        style={{
                            backgroundColor: Colors(theme).yellow,
                            flexDirection: "row",
                            alignItems: "center",
                            padding: 10,
                            paddingHorizontal: 16,
                            marginHorizontal: 16,
                            marginTop: 8,
                            borderRadius: 10,
                        }}
                    >
                        <FontAwesomeIcon icon={faWarning} color="#fff" size={22} />
                        <Text
                            style={{
                                fontSize: 14,
                                lineHeight: 20,
                                color: Colors(theme).white,
                                padding: 16,
                                paddingVertical: 8,
                            }}
                        >
                            We only advertise you to our brands if your profile is more than{" "}
                            {COMPLETION_PERCENTAGE}% complete
                        </Text>
                    </View>
                ) : null}
                {PROFILE_ITEMS.filter((item) => {
                    if (item.requiresKYC && user?.isKYCDone === false) {
                        return false;
                    }
                    return true;
                }).map((item) => (
                    <ProfileItemCard
                        key={item.id}
                        item={item}
                        onPress={async () => {
                            if (item.title === "Help and Support") {
                                await openExternalLink(
                                    "https://www.trendly.now/help-and-support/"
                                );
                                return;
                            }
                            // if (item.title === "Verify Profile") {
                            //     await openExternalLink(INFLUENCER_VERIFY_LINK);
                            //     return;
                            // }
                            router.push(item.route as Href);
                        }}
                    />
                ))}
                <ProfileItemCard
                    onPress={() => {
                        setLogoutModalVisible(true);
                    }}
                    item={{
                        id: "7",
                        title: "Logout",
                        icon: faRightFromBracket,
                    }}
                />
                <ConfirmationModal
                    cancelAction={() => setLogoutModalVisible(false)}
                    confirmAction={handleSignOut}
                    confirmText="Logout"
                    title="Logout"
                    description="Are you sure you want to logout?"
                    setVisible={setLogoutModalVisible}
                    visible={logoutModalVisible}
                />
            </ScrollView>
        </AppLayout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        gap: 6,
        paddingBottom: 6,
    },
    confettiContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "100%",
        pointerEvents: "none",
        zIndex: 999,
    },
});

export default ProfileScreen;
