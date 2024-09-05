import { StyleSheet, Text, View } from 'react-native';

const TabTwoScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Two</Text>
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
  secondary: {
    fontSize: 18,
    fontWeight: 'regular',
    marginTop: 10,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});

export default TabTwoScreen;
