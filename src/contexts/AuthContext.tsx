import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  employeeId: string;
  contactNumber: string;
  radiusSubmitted: boolean;
  attendanceSubmitted: boolean;
}

interface AuthContextType {
  user: User | null;
  updateUserStatus: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>({
    id: 'default-user',
    name: 'Teacher',
    email: 'teacher@school.com',
    employeeId: 'EMP001',
    contactNumber: '+91 9876543210',
    radiusSubmitted: false,
    attendanceSubmitted: false
  });

  const updateUserStatus = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={{ user, updateUserStatus }}>
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