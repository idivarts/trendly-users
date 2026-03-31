import { View } from "@/components/theme/Themed";
import { useAuthContext } from "@/contexts";
import GlassAppBar from "@/shared-uis/components/glass/GlassAppBar";
import { useMyNavigation } from "@/shared-libs/utils/router";
import Colors from "@/shared-uis/constants/Colors";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useTheme } from "@react-navigation/native";
import React from "react";
import { Platform, Pressable, StyleSheet } from "react-native";

interface ScreenHeaderProps {
    action?: () => void;
    title: string;
    rightActionButton?: React.ReactNode;
    rightAction?: boolean;
    /** Set true when this header is not under AppLayout’s SafeAreaView (e.g. chat channel, full-screen modal). */
    applyTopSafeArea?: boolean;
}

const ScreenHeader: React.FC<ScreenHeaderProps> = ({
    action,
    title,
    rightActionButton,
    rightAction = false,
    applyTopSafeArea = false,
}) => {
    const theme = useTheme();
    const { user } = useAuthContext();
    const router = useMyNavigation();

    const handleAction = () => {
        if (action) {
            action();
        } else if (router.canGoBack()) {
            router.back();
        } else if ((user?.profile?.completionPercentage || 0) < 60) {
            router.resetAndNavigate("/profile");
        } else {
            router.resetAndNavigate("/collaborations");
        }
    };

    const leading = (
        <Pressable
            onPress={handleAction}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={12}
            style={styles.backWrap}
        >
            <View
                lightColor={Colors(theme).transparent}
                darkColor={Colors(theme).transparent}
            >
                <FontAwesomeIcon
                    icon={faArrowLeft}
                    size={20}
                    color={Colors(theme).text}
                />
            </View>
        </Pressable>
    );

    return (
        <GlassAppBar
            applyTopSafeArea={applyTopSafeArea}
            title={title}
            leading={leading}
            trailing={
                rightAction ? (
                    <View style={styles.trailingInner}>{rightActionButton}</View>
                ) : null
            }
        />
    );
};

export default ScreenHeader;

const styles = StyleSheet.create({
    backWrap: {
        paddingVertical: 8,
        paddingRight: 8,
        marginLeft: Platform.OS === "web" ? 8 : 0,
        justifyContent: "center",
    },
    trailingInner: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
    },
});
