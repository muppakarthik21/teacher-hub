import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Dummy credentials
const DUMMY_USERS = [
  { id: '1', name: 'John Smith', email: 'john@school.edu', username: 'john', password: 'password123' },
  { id: '2', name: 'Sarah Johnson', email: 'sarah@school.edu', username: 'sarah', password: 'password123' },
  { id: '3', name: 'Michael Brown', email: 'michael@school.edu', username: 'michael', password: 'password123' }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = DUMMY_USERS.find(u => u.username === username && u.password === password);
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      setIsLoading(false);
      return true;
    }
    setIsLoading(false);
    return false;
  };

  const register = async (name: string, email: string, username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if username already exists
    const existingUser = DUMMY_USERS.find(u => u.username === username);
    if (existingUser) {
      setIsLoading(false);
      return false;
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      username
    };
    
    setUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}