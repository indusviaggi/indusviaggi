
import React, { createContext, useContext, useState, useEffect } from 'react';

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
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users data - replace with actual API calls
const mockUsers = [
  { id: '1', email: 'demo@skywander.com', password: 'demo123', name: 'Demo User' },
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
    const storedToken = localStorage.getItem('skywander_token');
    const storedUser = localStorage.getItem('skywander_user');
    
    if (storedToken && storedUser && isTokenValid(storedToken)) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    } else {
      // Clear invalid tokens
      localStorage.removeItem('skywander_token');
      localStorage.removeItem('skywander_user');
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // TODO: Replace with actual API call to your Express backend
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password })
      // });
      // const data = await response.json();
      
      // Mock API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser = mockUsers.find(u => u.email === email && u.password === password);
      
      if (mockUser) {
        const newToken = generateMockToken(mockUser.id);
        const userData = { id: mockUser.id, email: mockUser.email, name: mockUser.name };
        
        setToken(newToken);
        setUser(userData);
        localStorage.setItem('skywander_token', newToken);
        localStorage.setItem('skywander_user', JSON.stringify(userData));
        
        setIsLoading(false);
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // TODO: Replace with actual API call to your Express backend
      // const response = await fetch('/api/auth/signup', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ name, email, password })
      // });
      // const data = await response.json();
      
      // Mock API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      const existingUser = mockUsers.find(u => u.email === email);
      
      if (!existingUser) {
        const newUser = { id: Date.now().toString(), email, password, name };
        mockUsers.push(newUser);
        
        const newToken = generateMockToken(newUser.id);
        const userData = { id: newUser.id, email: newUser.email, name: newUser.name };
        
        setToken(newToken);
        setUser(userData);
        localStorage.setItem('skywander_token', newToken);
        localStorage.setItem('skywander_user', JSON.stringify(userData));
        
        setIsLoading(false);
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Signup error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    const currentToken = localStorage.getItem('skywander_token');
    if (!currentToken) return false;

    try {
      // TODO: Replace with actual API call to your Express backend
      // const response = await fetch('/api/auth/refresh', {
      //   method: 'POST',
      //   headers: { 
      //     'Authorization': `Bearer ${currentToken}`,
      //     'Content-Type': 'application/json' 
      //   }
      // });
      // const data = await response.json();
      
      const userId = getUserIdFromToken(currentToken);
      if (userId) {
        const newToken = generateMockToken(userId);
        setToken(newToken);
        localStorage.setItem('skywander_token', newToken);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      logout();
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('skywander_token');
    localStorage.removeItem('skywander_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, isLoading, refreshToken }}>
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
export const authFetch = (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('skywander_token');
  
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  });
};
