
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Campaign } from '@/lib/firebase/types';
import { getUserById, updateUser as updateDbUser, findOrCreateUserFromOAuth } from '@/lib/auth';
import { getCampaign, updateCampaign as updateDbCampaign } from '@/lib/firebase/campaigns';
import { onAuthStateChanged, User as FirebaseAuthUser } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';

interface AuthContextType {
  user: User | null;
  campaign: Campaign | null;
  login: (userId: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => Promise<void>;
  updateCampaign: (campaign: Campaign) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseAuthUser | null) => {
      if (firebaseUser) {
        setIsLoading(true);
        try {
          // Find user in Firestore or create them if they don't exist
          const appUser = await findOrCreateUserFromOAuth(firebaseUser);
          setUser(appUser);
          if (appUser.campaignId) {
            const campaignData = await getCampaign(appUser.campaignId);
            setCampaign(campaignData);
          }
           localStorage.setItem('userId', appUser.id);
        } catch (e) {
          console.error("Error during OAuth user processing", e);
          setUser(null);
          setCampaign(null);
        }
      } else {
        // Handle manual login from local storage if no Firebase auth state
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            const loggedInUser = await getUserById(storedUserId);
             if (loggedInUser) {
                setUser(loggedInUser);
                const campaignData = await getCampaign(loggedInUser.campaignId);
                setCampaign(campaignData);
            }
        } else {
            setUser(null);
            setCampaign(null);
        }
      }
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const login = async (userId: string) => {
    setIsLoading(true);
    const loggedInUser = await getUserById(userId);
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
    setIsLoading(false);
  };

  const logout = () => {
    try {
      auth.signOut();
      localStorage.removeItem('userId');
    } catch (e) {
      console.error("Could not access local storage or sign out", e);
    }
    setUser(null);
    setCampaign(null);
  };
  
  const updateUser = async (updatedUser: User) => {
    if (!user) return;
    await updateDbUser(updatedUser.id, updatedUser);
    setUser(updatedUser);
  };

  const updateCampaign = async (updatedCampaign: Campaign) => {
    if (!campaign) return;
    await updateDbCampaign(updatedCampaign.id, updatedCampaign);
    setCampaign(updatedCampaign);
  };

  return (
    <AuthContext.Provider value={{ user, campaign, login, logout, isLoading, updateUser, updateCampaign }}>
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
