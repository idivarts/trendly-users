import { StyleSheet } from 'react-native';

import { View } from '@/components/theme/Themed';
import { useAuthContext } from '@/contexts';
import Profile from '@/components/profile';
import { PROFILE_BOTTOM_ITEMS, PROFILE_ITEMS } from '@/constants/Profile';
import ProfileItemCard from '@/components/profile/ProfileItemCard';

const ProfileScreen = () => {
  const {
    signOut,
  } = useAuthContext();

  const handleSignout = () => {
    signOut();
  };

  return (
    <View style={styles.container}>
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
          onPress={handleSignout}
          item={{
            id: "7",
            title: "Logout",
            icon: "logout",
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  },
});

export default ProfileScreen;
