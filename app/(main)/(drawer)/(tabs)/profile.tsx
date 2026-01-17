import ProfileCard from "@/components/profile/ProfileCard";
import ProfileItemCard from "@/components/profile/ProfileItemCard";
import ProfileVerifiedModal from "@/components/profile/ProfileVerifiedModal";
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
import { useCallback, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, } from "react-native";

const ProfileScreen = () => {
    const router = useMyNavigation();
    const [logoutModalVisible, setLogoutModalVisible] = useState(false);
    const { signOutUser, user } = useAuthContext();
    const { updatedTokens } = useCloudMessagingContext();
    const [showVerifiedModal, setShowVerifiedModal] = useState(false);

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
                // Check if KYC is approved (not just done)
                if (user?.kyc?.status !== "approved") return;

                const alreadyShown = await AsyncStorage.getItem(
                    "PROFILE_VERIFIED_CONFETTI_SHOWN"
                );

                if (!alreadyShown) {
                    setShowVerifiedModal(true);
                    await AsyncStorage.setItem(
                        "PROFILE_VERIFIED_CONFETTI_SHOWN",
                        "true"
                    );

                    // auto-close after 2.5 sec
                    setTimeout(() => {
                        setShowVerifiedModal(false);
                    }, 2500);
                }
            };

            checkAndShowConfetti();
        }, [user?.kyc?.status])
    );

    useEffect(() => {
        console.log(user?.isKYCDone);
    }, [user?.isKYCDone]);

    return (
        <AppLayout>
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

                <ProfileVerifiedModal
                    visible={showVerifiedModal}
                    onClose={() => setShowVerifiedModal(false)}
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
});

export default ProfileScreen;
