import { StyleSheet } from 'react-native';

import { View } from '@/components/theme/Themed';
import { useAuthContext } from '@/contexts';
import Profile from '@/components/profile';
import { PROFILE_BOTTOM_ITEMS, PROFILE_ITEMS } from '@/constants/Profile';
import ProfileItemCard from '@/components/profile/ProfileItemCard';
import ProfileCard from '@/components/profile/ProfileCard';
import { useRouter } from 'expo-router';
import { ActivityIndicator } from 'react-native-paper';

const ProfileScreen = () => {
  const router = useRouter();
  const {
    signOut,
    user,
  } = useAuthContext();

  const handleSignout = () => {
    signOut();
  };

  if (!user) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ProfileCard
        item={user}
        onPress={() => router.push("/basic-profile")}
      />
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
});

export default ProfileScreen;
