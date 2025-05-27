import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Input from '../components/Input';
import Button from '../components/Button';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <Input placeholder="Email" value={email} onChangeText={setEmail} />
      <Input placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <Button title="Sign Up" onPress={() => alert('Sign Up logic here')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, flex: 1, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 }
});
