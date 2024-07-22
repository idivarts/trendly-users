import { Button, StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { useContext } from 'react';
import CounterContext from '@/contexts/CounterContext';
import LogNoter from '@/components/LogNoter';
import LogContext from '@/contexts/LogContext';
import CodingQ1 from '@/components/coding-test/CodingQ1';
import CodingQ2 from '@/components/coding-test/CodingQ2';

export default function TabThreeScreen() {
  const { counter, setCounter } = useContext(CounterContext)
  const { pushData } = useContext(LogContext)
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Coding Rounds</Text>
      <Text style={styles.secondary}>Enable comments in the code to start seeing the rounds</Text>
      {/* <CodingQ1 />
      <CodingQ2 /> */}
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
    marginBottom: 10
  },
  secondary: {
    fontSize: 18,
    fontWeight: 'regular',
    marginBottom: 10,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
