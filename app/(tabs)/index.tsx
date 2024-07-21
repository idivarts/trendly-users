import { Button, StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { useContext } from 'react';
import CounterContext from '@/contexts/CounterContext';
import LogNoter from '@/components/LogNoter';
import LogContext, { LogProvider } from '@/contexts/LogContext';

export default function TabOneScreen() {
  const { counter } = useContext(CounterContext)
  return (
    <LogProvider>
      <View style={styles.container}>
        <Text style={styles.title}>Tab One: {counter}</Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <EditScreenInfo path="app/(tabs)/index.tsx" />
        <MButton />
        <LogNoter />
      </View>
    </LogProvider>
  );
}
const MButton = () => {
  const { counter, setCounter } = useContext(CounterContext)
  const { pushData } = useContext(LogContext)

  return <Button title='Increase Count' onPress={() => {
    setCounter(counter + 1)
    pushData("Increasing the count to " + (counter))
  }}></Button>
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
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
