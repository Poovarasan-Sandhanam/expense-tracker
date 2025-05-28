import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../src/store/authStore';
import { View, Text, ActivityIndicator } from 'react-native';

export default function Index() {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace(user ? '/tabs/home' : '/auth/login');
    }, 1000);
    return () => clearTimeout(timeout);
  }, [user]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Loading...</Text>
      <ActivityIndicator size="large" />
    </View>
  );
}
