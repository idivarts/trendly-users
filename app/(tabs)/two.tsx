import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

import { useState } from 'react';

import { AuthApp } from '@/utils/firebase';
import { router } from 'expo-router';

export default function TabTwoScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const response = await AuthApp.createUserWithEmailAndPassword(email, password);
    if (response.user) {
      router.push('/one');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
        onChangeText={setEmail}
        value={email}
        placeholder="Email"
      />
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
        onChangeText={setPassword}
        value={password}
        placeholder="Password"
      />
      <Button
        title="Login"
        onPress={handleLogin}
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
