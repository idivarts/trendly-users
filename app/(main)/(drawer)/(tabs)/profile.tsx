import { StyleSheet } from 'react-native';

import { View } from '@/components/theme/Themed';
import { useAuthContext } from '@/contexts';
import Profile from '@/components/profile';
import { PROFILE_BOTTOM_ITEMS, PROFILE_ITEMS } from '@/constants/Profile';
import ProfileItemCard from '@/components/profile/ProfileItemCard';
import ProfileCard from '@/components/profile/ProfileCard';
import { useRouter } from 'expo-router';

const ProfileScreen = () => {
  const router = useRouter();
  const {
    signOutUser,
    user,
  } = useAuthContext();

  const handleSignout = () => {
    signOutUser();
  };

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
    paddingHorizontal: 20,
  },
});

export default ProfileScreen;
