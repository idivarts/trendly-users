import ProfileCard from "@/components/profile/ProfileCard";
import ProfileItemCard from "@/components/profile/ProfileItemCard";
import VerificationCard from "@/components/profile/VerificationCard";
import { View } from "@/components/theme/Themed";
import { COMPLETION_PERCENTAGE } from "@/constants/CompletionPercentage";
import { PROFILE_ITEMS } from "@/constants/Profile";
import { useAuthContext, useCloudMessagingContext } from "@/contexts";
import { KYCStatus } from "@/shared-libs/firestore/trendly-pro/models/users";
import { getRazorpayAccountStatus } from "@/shared-libs/utils/kyc-api";
import { useMyNavigation } from "@/shared-libs/utils/router";
import ConfirmationModal from "@/shared-uis/components/ConfirmationModal";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import Colors from "@/shared-uis/constants/Colors";
import { userHasPhoneForKyc } from "@/utils/profile";
import {
    faRightFromBracket,
    faWarning,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useTheme } from "@react-navigation/native";
import { Href } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { View as RNView, ScrollView, StyleSheet, Text } from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";

function useProfileTabStyles(colors: ReturnType<typeof Colors>) {
    return useMemo(
        () =>
            StyleSheet.create({
                scroll: {
                    flex: 1,
                    backgroundColor: colors.background,
                    padding: 16,
                    paddingHorizontal: 20,
                    gap: 6,
                    paddingBottom: 6,
                },
                scrollContent: {
                    paddingBottom: 16,
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
                warningBanner: {
                    backgroundColor: colors.yellow,
                    flexDirection: "row",
                    alignItems: "center",
                    padding: 10,
                    paddingHorizontal: 16,
                    marginHorizontal: 16,
                    marginTop: 8,
                    borderRadius: 10,
                },
                warningText: {
                    fontSize: 14,
                    lineHeight: 20,
                    color: colors.white,
                    padding: 16,
                    paddingVertical: 8,
                },
            }),
        [colors]
    );
}

const ProfileTabContent = () => {
    const router = useMyNavigation();
    const [logoutModalVisible, setLogoutModalVisible] = useState(false);
    const { signOutUser, updateUser, user } = useAuthContext();
    const { updatedTokens } = useCloudMessagingContext();
    const [showConfetti, setShowConfetti] = useState(false);
    const confettiRef = useRef<ConfettiCannon>(null);

    const [kycStatusSticky, setKycStatusSticky] = useState<
        KYCStatus | undefined
    >(undefined);

    const theme = useTheme();
    const colors = Colors(theme);
    const styles = useProfileTabStyles(colors);

    useEffect(() => {
        if (!user?.kyc) {
            setKycStatusSticky(undefined);
            return;
        }
        const s = user.kyc.status;
        if (Object.values(KYCStatus).includes(s)) {
            setKycStatusSticky(s);
        }
    }, [user?.kyc, user?.kyc?.status]);

    const verificationKycStatus = user?.kyc?.status ?? kycStatusSticky;

    const handleCheckKycStatus = useCallback(async () => {
        if (!user?.id) return;
        try {
            const res = await getRazorpayAccountStatus();
            const nextStatus = (res.status ?? res.account?.status) as string | undefined;
            if (!nextStatus) {
                Toaster.error("Unable to fetch verification status.");
                return;
            }
        } catch {
            Toaster.error("Unable to fetch verification status.");
        }
    }, [updateUser, user?.id, user?.kyc, user?.id]);

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
                if (!user?.isKYCDone) {
                    await AsyncStorage.removeItem(
                        "PROFILE_VERIFIED_CONFETTI_SHOWN"
                    );
                    return;
                }
                const alreadyShown = await AsyncStorage.getItem(
                    "PROFILE_VERIFIED_CONFETTI_SHOWN"
                );
                if (!alreadyShown) {
                    setShowConfetti(true);
                    await AsyncStorage.setItem(
                        "PROFILE_VERIFIED_CONFETTI_SHOWN",
                        "true"
                    );
                    if (confettiRef.current) {
                        confettiRef.current.start();
                    }
                    setTimeout(() => setShowConfetti(false), 3000);
                }
            };
            checkAndShowConfetti();
        }, [user?.isKYCDone])
    );

    return (
        <>
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
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
            >
                {user && (
                    <ProfileCard
                        item={user}
                        onPress={() => router.push("/edit-profile")}
                    />
                )}

                {user != null &&
                    (user.profile?.completionPercentage ?? 0) >=
                    COMPLETION_PERCENTAGE &&
                    userHasPhoneForKyc(user) && (
                        <VerificationCard
                            kycStatus={verificationKycStatus}
                            onStartVerification={() => {
                                router.push("/verification");
                            }}
                            onCheckStatus={handleCheckKycStatus}
                            influencerEmail={user.email ?? null}
                            influencerKycAccountId={user.kyc?.accountId ?? null}
                            influencerUserId={user.id ?? null}
                        />
                    )}
                {!user?.profile?.completionPercentage ||
                    user?.profile?.completionPercentage <
                    COMPLETION_PERCENTAGE ? (
                    <View style={styles.warningBanner}>
                        <FontAwesomeIcon
                            icon={faWarning}
                            color={colors.white}
                            size={22}
                        />
                        <Text style={styles.warningText}>
                            We only advertise you to our brands if your profile
                            is more than {COMPLETION_PERCENTAGE}% complete
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
        </>
    );
};

export default ProfileTabContent;
