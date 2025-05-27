import React, { createContext, ReactNode } from 'react';

interface AuthContextProps {
  login: (email: string, password: string) => void;
}

export const AuthContext = createContext<AuthContextProps>({
  login: () => {}
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const login = (email: string, password: string) => {
    alert(`Logged in with ${email}`);
  };

  return (
    <AuthContext.Provider value={{ login }}>
      {children}
    </AuthContext.Provider>
  );
};
