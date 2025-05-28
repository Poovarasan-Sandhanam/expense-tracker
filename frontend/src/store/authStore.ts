import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/authService';

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  loading: false,

  login: async (email, password) => {
    set({ loading: true });
    try {
      const data = await authService.login(email, password);
      set({ user: data.user, token: data.token });

      await AsyncStorage.setItem('token', data.token);
    } catch (err) {
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem('token');
    set({ user: null, token: null });
  },

  restoreSession: async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) return;

    try {
      const user = await authService.fetchUser(token);
      set({ user, token });
    } catch (err) {
      await AsyncStorage.removeItem('token');
    }
  },
}));
