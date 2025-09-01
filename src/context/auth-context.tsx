"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, getUserById } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  login: (userId: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for user in localStorage on initial load
    try {
      const storedUserId = localStorage.getItem('userId');
      if (storedUserId) {
        const loggedInUser = getUserById(storedUserId);
        if (loggedInUser) {
          setUser(loggedInUser);
        }
      }
    } catch (e) {
      console.error("Could not access local storage", e);
    }
    setIsLoading(false);
  }, []);

  const login = (userId: string) => {
    const loggedInUser = getUserById(userId);
    if (loggedInUser) {
        try {
            localStorage.setItem('userId', userId);
        } catch (e) {
            console.error("Could not access local storage", e);
        }
        setUser(loggedInUser);
    }
  };

  const logout = () => {
    try {
        localStorage.removeItem('userId');
    } catch (e) {
        console.error("Could not access local storage", e);
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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
