import { createContext, ReactNode } from 'react';

interface AuthContextProps {
  login: (email: string, password: string) => void;
}

export const AuthContext = createContext<AuthContextProps>({
  login: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const login = (email: string, password: string) => {
    alert(`Logging in with ${email}`);
  };

  return (
    <AuthContext.Provider value={{ login }}>
      {children}
    </AuthContext.Provider>
  );
};
