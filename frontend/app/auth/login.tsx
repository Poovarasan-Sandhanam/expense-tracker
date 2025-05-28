import { useAuthStore } from '../src/store/authStore';
import { useRouter } from 'expo-router';
import { View, Button, TextInput, Text } from 'react-native';
import { useState } from 'react';

export default function Login() {
  const login = useAuthStore((s) => s.login);
  const loading = useAuthStore((s) => s.loading);
  const router = useRouter();

  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password');

  const handleLogin = async () => {
    try {
      await login(email, password);
      router.replace('/home');
    } catch {
      alert('Invalid credentials');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Email</Text>
      <TextInput value={email} onChangeText={setEmail} style={{ borderWidth: 1 }} />
      <Text>Password</Text>
      <TextInput value={password} onChangeText={setPassword} secureTextEntry style={{ borderWidth: 1 }} />
      <Button title={loading ? 'Logging in...' : 'Login'} onPress={handleLogin} />
    </View>
  );
}
