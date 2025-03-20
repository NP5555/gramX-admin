import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/axios';

interface AuthContextType {
  isAuthenticated: boolean;
  user: {
    email: string;
    name: string;
    role: 'admin' | 'user';
  } | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

interface LoginResponse {
  token: string;
  user: {
    email: string;
    name: string;
    role: 'admin' | 'user';
  };
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthContextType['user']>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing auth token
    const token = localStorage.getItem('adminToken');
    if (token) {
      // Set the token in axios headers
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Get user data from localStorage if available
      const userData = localStorage.getItem('userData');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Make the real API call to the backend
      const response = await api.post<LoginResponse>('/admin-auth/login', {
        email,
        password
      });

      const { token, user: userData } = response.data;

      // Store the token and user data
      localStorage.setItem('adminToken', token);
      localStorage.setItem('userData', JSON.stringify(userData));
      
      // Set the token in axios headers
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setIsAuthenticated(true);
      setUser(userData);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('userData');
    delete api.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}; 