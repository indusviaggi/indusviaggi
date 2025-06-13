import React, { createContext, useContext, useState, useEffect } from 'react';
import apiFetch from '@/utils/apiFetch';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users data - replace with actual API calls
const mockUsers = [
  { id: '1', email: 'demo@indusviaggi.com', password: 'demo123', name: 'Demo User' },
  { id: '2', email: 'john@example.com', password: 'password', name: 'John Doe' }
];

// Mock JWT token generation - replace with actual backend calls
const generateMockToken = (userId: string) => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ 
    userId, 
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
    iat: Math.floor(Date.now() / 1000)
  }));
  const signature = btoa(`mock-signature-${userId}`);
  return `${header}.${payload}.${signature}`;
};

// Token validation helper
const isTokenValid = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
};

// Get user ID from token
const getUserIdFromToken = (token: string): string | null => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.userId;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored token on mount
    const storedToken = localStorage.getItem('indusviaggi_token');
    const storedUser = localStorage.getItem('indusviaggi_user');
    
    if (storedToken && storedUser && isTokenValid(storedToken)) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    } else {
      // Clear invalid tokens
      localStorage.removeItem('indusviaggi_token');
      localStorage.removeItem('indusviaggi_user');
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await apiFetch(
        `${import.meta.env.VITE_API_BASE_URL}/user/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        setIsLoading(false);
        return false;
      }

      const res = await response.json();
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('indusviaggi_token', res.data.token);
      localStorage.setItem('indusviaggi_user', JSON.stringify(res.data.user));
      setIsLoading(false);
      return true;
    } catch (error) {
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('indusviaggi_token');
    localStorage.removeItem('indusviaggi_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper function for making authenticated API calls
// (Replaced by centralized apiFetch)
