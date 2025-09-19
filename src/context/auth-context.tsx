
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Campaign } from '@/lib/firebase/types';
import { findOrCreateUser, updateUser as updateDbUser } from '@/lib/firebase/auth';
import { getCampaign, updateCampaign as updateDbCampaign } from '@/lib/firebase/campaigns';
import { onAuthStateChanged, User as FirebaseAuthUser } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';

type ActiveRole = 'gm' | 'player' | null;

interface AuthContextType {
  user: User | null;
  campaign: Campaign | null;
  activeRole: ActiveRole;
  logout: () => void;
  updateUser: (user: User) => Promise<void>;
  setUser: (user: User) => void;
  setCampaign: (campaign: Campaign) => void;
  updateCampaign: (campaign: Campaign) => Promise<void>;
  setActiveRole: (role: 'gm' | 'player') => void;
  isLoading: boolean;
  setupSession: (user: FirebaseAuthUser) => Promise<void>;
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
          await setupSession(firebaseUser);
        } catch (e) {
          console.error("Error during user session setup", e);
          await clearSession();
        }
      } else {
        await clearSession();
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setupSession = async (firebaseUser: FirebaseAuthUser) => {
    const loggedInUser = await findOrCreateUser(firebaseUser);
    
    if (loggedInUser && loggedInUser.enabled) {
      setUser(loggedInUser);
      if (loggedInUser.campaignId) {
        const campaignData = await getCampaign(loggedInUser.campaignId);
        setCampaign(campaignData);
      }
      
      if (loggedInUser.role.isGm && !loggedInUser.role.isPlayer) {
        setActiveRoleState('gm');
      } else if (!loggedInUser.role.isGm && loggedInUser.role.isPlayer) {
        setActiveRoleState('player');
      } else {
        setActiveRoleState(null); // Let user with dual roles choose
      }
    } else {
      await clearSession();
    }
  };

  const clearSession = async () => {
    setUser(null);
    setCampaign(null);
    setActiveRoleState(null);
  };

  const logout = async () => {
    await auth.signOut();
    await clearSession();
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
    <AuthContext.Provider value={{ user, campaign, setCampaign, activeRole, setActiveRole, logout, isLoading, updateUser, updateCampaign, setupSession, setUser }}>
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
