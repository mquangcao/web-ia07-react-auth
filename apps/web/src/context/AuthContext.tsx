import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import axios from 'axios';

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  user: any;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(
    localStorage.getItem('refreshToken')
  );
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (refreshToken) {
      // Try to refresh on load
      refreshAccessToken();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email: string, password: string) => {
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
      email,
      password,
    });
    const { access_token, refresh_token } = response.data;
    setAccessToken(access_token);
    setRefreshToken(refresh_token);
    localStorage.setItem('accessToken', access_token);
    localStorage.setItem('refreshToken', refresh_token);
    // Decode user from token or fetch profile
    const payload = JSON.parse(atob(access_token.split('.')[1]));
    setUser(payload);
  };

  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  const refreshAccessToken = async () => {
    if (!refreshToken) return;
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/refresh`, {
        refresh_token: refreshToken,
      });
      const { access_token } = response.data;
      setAccessToken(access_token);
      localStorage.setItem('accessToken', access_token);
      const payload = JSON.parse(atob(access_token.split('.')[1]));
      setUser(payload);
    } catch {
      logout();
    }
  };

  const isAuthenticated = !!accessToken;

  return (
    <AuthContext.Provider
      value={{ accessToken, refreshToken, user, login, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};
