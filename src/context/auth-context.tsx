
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Campaign } from '@/lib/firebase/types';
import { getUserById, updateUser as updateDbUser, findOrCreateUserFromOAuth } from '@/lib/auth';
import { getCampaign, updateCampaign as updateDbCampaign } from '@/lib/firebase/campaigns';
import { onAuthStateChanged, User as FirebaseAuthUser } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';

type ActiveRole = 'gm' | 'player' | null;

interface AuthContextType {
  user: User | null;
  campaign: Campaign | null;
  activeRole: ActiveRole;
  login: (userId: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => Promise<void>;
  setCampaign: (campaign: Campaign) => void;
  updateCampaign: (campaign: Campaign) => Promise<void>;
  setActiveRole: (role: 'gm' | 'player') => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeRole, setActiveRoleState] = useState<ActiveRole>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseAuthUser | null) => {
      setIsLoading(true);
      if (firebaseUser) {
        try {
          // This handles both initial sign-in and subsequent visits for OAuth users
          const appUser = await findOrCreateUserFromOAuth(firebaseUser);
          await setupSession(appUser);
        } catch (e) {
          console.error("Error during OAuth user processing", e);
          clearSession();
        }
      } else {
        // Fallback to manual login session from localStorage
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            const loggedInUser = await getUserById(storedUserId);
            if (loggedInUser) {
                await setupSession(loggedInUser);
            } else {
                clearSession();
            }
        } else {
            clearSession();
        }
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const setupSession = async (loggedInUser: User) => {
    if (loggedInUser.enabled) {
      setUser(loggedInUser);
      if (loggedInUser.campaignId) {
        const campaignData = await getCampaign(loggedInUser.campaignId);
        setCampaign(campaignData);
      }
      
      // Set active role
      if (loggedInUser.role.isGm && !loggedInUser.role.isPlayer) {
        setActiveRoleState('gm');
      } else if (!loggedInUser.role.isGm && loggedInUser.role.isPlayer) {
        setActiveRoleState('player');
      } else {
        // Dual role or no role, let them choose or reset
        setActiveRoleState(null);
      }
      localStorage.setItem('userId', loggedInUser.id);
    } else {
      // Handle disabled user
      clearSession();
    }
  };

  const clearSession = () => {
    setUser(null);
    setCampaign(null);
    setActiveRoleState(null);
    localStorage.removeItem('userId');
  };

  const login = async (userId: string) => {
    setIsLoading(true);
    const loggedInUser = await getUserById(userId);
    if (loggedInUser) {
      await setupSession(loggedInUser);
    }
    setIsLoading(false);
  };

  const logout = () => {
    auth.signOut();
    clearSession();
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

  const setActiveRole = (role: 'gm' | 'player') => {
    if (user && user.role.isGm && user.role.isPlayer) {
      setActiveRoleState(role);
    }
  };

  return (
    <AuthContext.Provider value={{ user, campaign, setCampaign, activeRole, setActiveRole, login, logout, isLoading, updateUser, updateCampaign }}>
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
