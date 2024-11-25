import { StyleSheet } from 'react-native';

import { View } from '@/components/theme/Themed';
import { useAuthContext } from '@/contexts';
import Profile from '@/components/profile';
import { PROFILE_BOTTOM_ITEMS, PROFILE_ITEMS } from '@/constants/Profile';
import ProfileItemCard from '@/components/profile/ProfileItemCard';
import ProfileCard from '@/components/profile/ProfileCard';
import { useRouter } from 'expo-router';
import ConfirmationModal from '@/components/ui/modal/ConfirmationModal';
import { useState } from 'react';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

const ProfileScreen = () => {
  const router = useRouter();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const {
    signOutUser,
    user,
  } = useAuthContext();

  const handleSignOut = () => {
    setLogoutModalVisible(false);
    signOutUser();
  }

  return (
    <View style={styles.container}>
      {
        user && (
          <ProfileCard
            item={user}
            onPress={() => router.push("/basic-profile")}
          />
        )
      }
      <Profile
        items={PROFILE_ITEMS}
      />
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
        }}
      >
        <Profile
          items={PROFILE_BOTTOM_ITEMS}
        />
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
      </View>
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
});

export default ProfileScreen;
