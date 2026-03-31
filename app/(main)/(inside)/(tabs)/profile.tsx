import ProfileCard from "@/components/profile/ProfileCard";
import ProfileItemCard from "@/components/profile/ProfileItemCard";
// VERIFICATION_FLOW_DISABLED
// import VerificationCard from "@/components/profile/VerificationCard";
// END VERIFICATION_FLOW_DISABLED
import { View } from "@/components/theme/Themed";
import { COMPLETION_PERCENTAGE } from "@/constants/CompletionPercentage";
import { PROFILE_ITEMS } from "@/constants/Profile";
import { useAuthContext, useCloudMessagingContext } from "@/contexts";
import { useBreakpoints } from "@/hooks";
import { useFloatingTabChromePad } from "@/hooks/use-floating-tab-chrome-pad";
import AppLayout from "@/layouts/app-layout";
import { useMyNavigation } from "@/shared-libs/utils/router";
import ConfirmationModal from "@/shared-uis/components/ConfirmationModal";
import Colors from "@/shared-uis/constants/Colors";
import {
    faRightFromBracket,
    faWarning
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
// VERIFICATION_FLOW_DISABLED - AsyncStorage and useFocusEffect used only for verification confetti
// import AsyncStorage from "@react-native-async-storage/async-storage";
// END VERIFICATION_FLOW_DISABLED
import { useTheme } from "@react-navigation/native";
import { Href } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";

const ProfileScreen = () => {
    const router = useMyNavigation();
    const [logoutModalVisible, setLogoutModalVisible] = useState(false);
    const { signOutUser, user } = useAuthContext();
    const { updatedTokens } = useCloudMessagingContext();
    // VERIFICATION_FLOW_DISABLED
    // const [showVerifiedModal, setShowVerifiedModal] = useState(false);
    // const [showConfetti, setShowConfetti] = useState(false);
    // const confettiRef = useRef<ConfettiCannon>(null);
    // END VERIFICATION_FLOW_DISABLED

    const theme = useTheme();
    const { xl } = useBreakpoints();
    const tabChrome = useFloatingTabChromePad();

    const handleSignOut = async () => {
        setLogoutModalVisible(false);
        await updatedTokens?.();
        await signOutUser();
    };

    const openExternalLink = async (url: string) => {
        if (!url) return;
        await WebBrowser.openBrowserAsync(url);
    };

    // VERIFICATION_FLOW_DISABLED
    // useFocusEffect(
    //     useCallback(() => {
    //         const checkAndShowConfetti = async () => {
    //             console.log("🔍 Profile focused - checking KYC status");
    //             console.log("📊 isKYCDone:", user?.isKYCDone);
    //             console.log("📊 User KYC status:", user?.kyc?.status);
    //             if (!user?.isKYCDone) {
    //                 console.log("❌ KYC not done - resetting confetti flag");
    //                 await AsyncStorage.removeItem("PROFILE_VERIFIED_CONFETTI_SHOWN");
    //                 return;
    //             }
    //             console.log("✓ KYC is done, checking if confetti was shown before...");
    //             const alreadyShown = await AsyncStorage.getItem(
    //                 "PROFILE_VERIFIED_CONFETTI_SHOWN"
    //             );
    //             console.log("📱 Already shown flag:", alreadyShown);
    //             if (!alreadyShown) {
    //                 console.log("🎉 Showing confetti and verification modal!");
    //                 setShowVerifiedModal(true);
    //                 setShowConfetti(true);
    //                 await AsyncStorage.setItem(
    //                     "PROFILE_VERIFIED_CONFETTI_SHOWN",
    //                     "true"
    //                 );
    //                 if (confettiRef.current) {
    //                     confettiRef.current.start();
    //                 }
    //                 setTimeout(() => setShowVerifiedModal(false), 2300);
    //                 setTimeout(() => setShowConfetti(false), 3000);
    //             }
    //         };
    //         checkAndShowConfetti();
    //     }, [user?.isKYCDone])
    // );
    // useEffect(() => {
    //     console.log(user?.isKYCDone);
    // }, [user?.isKYCDone]);
    // END VERIFICATION_FLOW_DISABLED

    return (
        <AppLayout>
            {/* VERIFICATION_FLOW_DISABLED */}
            {/* {showConfetti && (
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
            )} */}
            {/* END VERIFICATION_FLOW_DISABLED */}
            <ScrollView
                style={{
                    ...styles.container,
                    backgroundColor: Colors(theme).background,
                }}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingTop: xl ? 16 : tabChrome.top + 16,
                    paddingBottom: xl ? 16 : tabChrome.bottom + 16,
                }}
            >
                {user && (
                    <ProfileCard
                        item={user}
                        onPress={() => router.push("/edit-profile")}
                    />


                )}

                {/* VERIFICATION_FLOW_DISABLED */}
                {/* <VerificationCard
                    kycStatus={user?.kyc?.status}
                    onStartVerification={() => {
                        router.push("/verification");
                    }}
                /> */}
                {/* END VERIFICATION_FLOW_DISABLED */}
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
    // VERIFICATION_FLOW_DISABLED
    // confettiContainer: {
    //     position: "absolute",
    //     top: 0,
    //     left: 0,
    //     right: 0,
    //     height: "100%",
    //     pointerEvents: "none",
    //     zIndex: 999,
    // },
    // END VERIFICATION_FLOW_DISABLED
});

export default ProfileScreen;
