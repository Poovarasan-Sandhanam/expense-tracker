import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Input from '../components/Input';
import Button from '../components/Button';
import { AuthContext } from '../context/AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/AuthNavigator';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Input placeholder="Email" value={email} onChangeText={setEmail} />
      <Input placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <Button title="Login" onPress={() => login(email, password)} />
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.link}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, flex: 1, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  link: { marginTop: 12, color: 'blue' }
});
