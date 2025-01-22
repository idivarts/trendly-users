import { Platform, ScrollView, StyleSheet, Text } from "react-native";

import { View } from "@/components/theme/Themed";
import { useAuthContext } from "@/contexts";
import { PROFILE_ITEMS } from "@/constants/Profile";
import ProfileItemCard from "@/components/profile/ProfileItemCard";
import ProfileCard from "@/components/profile/ProfileCard";
import { Href, useRouter } from "expo-router";
import ConfirmationModal from "@/components/ui/modal/ConfirmationModal";
import { useState } from "react";
import {
  faRightFromBracket,
  faWarning,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import Colors from "@/constants/Colors";
import { useTheme } from "@react-navigation/native";
import { COMPLETION_PERCENTAGE } from "@/constants/CompletionPercentage";
import AppLayout from "@/layouts/app-layout";

const ProfileScreen = () => {
  const router = useRouter();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const { signOutUser, user } = useAuthContext();
  const theme = useTheme();

  const handleSignOut = () => {
    setLogoutModalVisible(false);
    signOutUser();
  };

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
        {
          user && (
            <ProfileCard
              item={user}
              onPress={() => router.push("/edit-profile")}
            />
          )
        }
        {
          !user?.profile?.completionPercentage ||
            user?.profile?.completionPercentage < COMPLETION_PERCENTAGE ? (
            <View
              style={{
                backgroundColor: Colors(theme).yellow,
                flexDirection: "row",
                alignItems: "center",
                padding: 10,
                paddingHorizontal: 16,
                borderRadius: 10,
              }}
            >
              <FontAwesomeIcon icon={faWarning} color="#fff" size={22} />
              <Text
                style={{
                  fontSize: 16,
                  color: Colors(theme).white,
                  padding: 16,
                }}
              >
                We only advertise you to our brands if your profile is more
                than {COMPLETION_PERCENTAGE}% complete
              </Text>
            </View>
          ) : null
        }
        {
          PROFILE_ITEMS.map((item) => (
            <ProfileItemCard
              key={item.id}
              item={item}
              onPress={() => {
                if (
                  item.title === "Help and Support" &&
                  Platform.OS === "web"
                ) {
                  window.open(
                    "https://trendly.pro/help-and-support/",
                    "_blank"
                  );
                } else {
                  router.push(item.route as Href);
                }
              }}
            />
          ))
        }
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
});

export default ProfileScreen;
