import { Button, StyleSheet } from 'react-native';

import { Text, View } from '@/components/theme/Themed';
import { useRouter } from 'expo-router';
import { useAuthContext } from '@/contexts';

const TabFiveScreen = () => {
  const router = useRouter();
  const {
    signOut,
  } = useAuthContext();

  const handleSignout = () => {
    signOut();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab Five</Text>
      <Button
        title="Go to Main Screen 1"
        onPress={() => router.push('/main-screen-1')}
      />
      <Button
        title="Signout"
        onPress={handleSignout}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default TabFiveScreen;
