import ProfileTabContent from "@/components/profile/ProfileTabContent";
import ScreenHeader from "@/components/ui/screen-header";
import AppLayout from "@/layouts/app-layout";
import { useMyNavigation } from "@/shared-libs/utils/router";
import Colors from "@/shared-uis/constants/Colors";
import { faGears } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useTheme } from "@react-navigation/native";
import { StyleSheet, TouchableOpacity } from "react-native";

const ProfileScreen = () => {
    const theme = useTheme();
    const colors = Colors(theme);
    const router = useMyNavigation();

    return (
        <AppLayout>
            <ScreenHeader
                title="Profile"
                showBack={false}
                rightAction
                rightActionButton={
                    <TouchableOpacity
                        style={styles.gearTap}
                        onPress={() => router.push("/settings")}
                    >
                        <FontAwesomeIcon
                            icon={faGears}
                            size={32}
                            color={colors.text}
                        />
                    </TouchableOpacity>
                }
            />
            <ProfileTabContent />
        </AppLayout>
    );
};

const styles = StyleSheet.create({
    gearTap: {
        paddingRight: 20,
    },
});

export default ProfileScreen;
