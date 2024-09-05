import { StyleSheet, Text, TextInput, View } from "react-native";
import { useAuthContext } from "@/contexts";
import { Button } from "react-native";
import { useState } from "react";

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const {
    signUp,
  } = useAuthContext();

  const handleSignUp = () => {
    signUp(email, password);
  };

  return (
    <View
      style={styles.container}
    >
      <Text>Signup</Text>
      <Button title="Signup" onPress={handleSignUp} />
      <Text style={styles.title}>Signup</Text>
      <TextInput
        keyboardType="email-address"
        onChangeText={setEmail}
        placeholder="Email"
        value={email}
      />
      <TextInput
        keyboardType="visible-password"
        onChangeText={setPassword}
        placeholder="Password"
        value={password}
      />
      <Button
        title="Signup"
        onPress={handleSignUp}
      />
    </View>
  );
};

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

export default Signup;
