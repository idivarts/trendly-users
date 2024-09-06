import { Button, StyleSheet } from 'react-native';

import { Text, View } from '@/components/theme/Themed';
import { useNavigation } from 'expo-router';

const NotificationsScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <Button
        title="Dismiss"
        onPress={() => navigation.goBack()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default NotificationsScreen;
