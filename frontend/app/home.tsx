import { View, Text, Button } from 'react-native';
import { useAuthStore } from '@/store/authStore'; 
import { useRouter } from 'expo-router';
import React from 'react';

export default function Home() {
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text>Welcome Home!</Text>
      <Button
        title="Logout"
        onPress={() => {
          logout();
          router.replace('/login');
        }}
      />
    </View>
  );
}
