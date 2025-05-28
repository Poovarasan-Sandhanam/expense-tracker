import axios from 'axios';

export const authService = {
  login: async (email: string, password: string) => {
    // Replace with your real API
    const response = await axios.post('https://example.com/api/login', {
      email,
      password,
    });
    return response.data; // should return user or token
  },

  logout: async () => {
    // Optionally call backend to invalidate session
    return true;
  },

  fetchUser: async (token: string) => {
    // Simulate fetching user with token
    const response = await axios.get('https://example.com/api/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};
