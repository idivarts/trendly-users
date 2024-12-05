import { FlatList, StyleSheet, Text } from "react-native";

import { View } from "@/components/theme/Themed";
import { useAuthContext } from "@/contexts";
import Profile from "@/components/profile";
import { PROFILE_BOTTOM_ITEMS, PROFILE_ITEMS } from "@/constants/Profile";
import ProfileItemCard from "@/components/profile/ProfileItemCard";
import ProfileCard from "@/components/profile/ProfileCard";
import { Href, useRouter } from "expo-router";
import ConfirmationModal from "@/components/ui/modal/ConfirmationModal";
import { useState } from "react";
import {
  faInfo,
  faInfoCircle,
  faRightFromBracket,
  faWarning,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import Colors from "@/constants/Colors";
import { useTheme } from "@react-navigation/native";
import { COMPLETION_PERCENTAGE } from "@/constants/CompletionPercentage";

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
    <View style={styles.container}>
      {user && (
        <ProfileCard
          item={user}
          onPress={() => router.push("/basic-profile")}
        />
      )}
      <FlatList
        data={PROFILE_ITEMS}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ProfileItemCard
            item={item}
            onPress={() => router.push(item.route as Href)}
          />
        )}
        keyExtractor={(item) => item.id}
        ListFooterComponent={
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
        }
        ListHeaderComponent={
          !user?.profile?.completionPercentage ||
          user?.profile?.completionPercentage < COMPLETION_PERCENTAGE ? (
            <View
              style={{
                backgroundColor: "#E8B931",
                flexDirection: "row",
                alignItems: "center",
                padding: 10,
                borderRadius: 10,
              }}
            >
              <FontAwesomeIcon icon={faWarning} color="#fff" size={22} />
              <Text
                style={{
                  fontSize: 19,
                  color: Colors(theme).white,
                  padding: 10,
                }}
              >
                We only adverstize you to our brands if your profile is more
                than {COMPLETION_PERCENTAGE}% complete
              </Text>
            </View>
          ) : null
        }
      />
      <ConfirmationModal
        cancelAction={() => setLogoutModalVisible(false)}
        confirmAction={handleSignOut}
        confirmText="Logout"
        description="Are you sure you want to logout?"
        setVisible={setLogoutModalVisible}
        visible={logoutModalVisible}
      />
    </View>
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
