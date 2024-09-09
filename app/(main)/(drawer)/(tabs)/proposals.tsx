import { StyleSheet } from 'react-native';

import { Text, View } from '@/components/theme/Themed';

const ProposalsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Proposals</Text>
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

export default ProposalsScreen;
