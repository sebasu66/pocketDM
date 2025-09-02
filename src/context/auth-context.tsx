
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Campaign } from '@/lib/firebase/types';
import { getUserById, updateUser as updateMockUser } from '@/lib/auth';
import { getCampaign } from '@/lib/firebase/campaigns';

interface AuthContextType {
  user: User | null;
  campaign: Campaign | null;
  login: (userId: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
          const loggedInUser = getUserById(storedUserId);
          if (loggedInUser) {
            setUser(loggedInUser);
            const campaignData = await getCampaign(loggedInUser.campaignId);
            setCampaign(campaignData);
          }
        }
      } catch (e) {
        console.error("Could not access local storage or fetch data", e);
      }
      setIsLoading(false);
    };
    initializeAuth();
  }, []);

  const login = async (userId: string) => {
    const loggedInUser = getUserById(userId);
    if (loggedInUser) {
      try {
        localStorage.setItem('userId', userId);
        const campaignData = await getCampaign(loggedInUser.campaignId);
        setUser(loggedInUser);
        setCampaign(campaignData);
      } catch (e) {
        console.error("Could not access local storage or fetch data", e);
      }
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('userId');
    } catch (e) {
      console.error("Could not access local storage", e);
    }
    setUser(null);
    setCampaign(null);
  };
  
  const updateUser = (updatedUser: User) => {
    // This updates our mock database
    updateMockUser(updatedUser.id, updatedUser);
    // This updates the react context state
    setUser(updatedUser);
  }

  return (
    <AuthContext.Provider value={{ user, campaign, login, logout, isLoading, updateUser }}>
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
