import { Button, StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { useContext } from 'react';
import CounterContext from '@/contexts/CounterContext';
import LogNoter from '@/components/LogNoter';
import LogContext from '@/contexts/LogContext';

export default function TabTwoScreen() {
  const { counter, setCounter } = useContext(CounterContext)
  const { pushData } = useContext(LogContext)
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab Two</Text>
      <Text style={styles.secondary}>Current Count: {counter}</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="app/(tabs)/two.tsx" />
      <Button title='Reset Counter' onPress={() => {
        setCounter(0)
        pushData("Resetted data to 0")
      }} />
      <LogNoter />
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
