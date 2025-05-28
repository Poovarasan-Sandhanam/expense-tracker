import React from 'react';
import { useState } from 'react';
import { useAuthStore } from '../src/store/authStore'; 
import { useRouter } from 'expo-router';
import { View, Button, TextInput, Text, KeyboardAvoidingView, Platform } from 'react-native';



export default function Login() {
  const login = useAuthStore((s) => s.login);
  const loading = useAuthStore((s) => s.loading);
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Please enter email and password');
      return;
    }

    try {
      await login(email, password);
      router.replace('/tabs/home');
    } catch {
      alert('Invalid credentials');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, justifyContent: 'center', padding: 20 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Text>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, marginBottom: 20, padding: 8 }}
      />
      <Button title={loading ? 'Logging in...' : 'Login'} onPress={handleLogin} />
    </KeyboardAvoidingView>
  );
}
