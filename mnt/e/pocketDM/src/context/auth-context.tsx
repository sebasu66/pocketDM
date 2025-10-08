
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/lib/firebase/types';
import { findOrCreateUser, updateUser as updateDbUser, handleGoogleRedirectResult } from '@/lib/firebase/auth';
import { onAuthStateChanged, User as FirebaseAuthUser } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { usePathname, useRouter } from 'next/navigation';

type ActiveRole = 'gm' | 'player' | null;

interface AuthContextType {
  user: User | null;
  activeRole: ActiveRole;
  logout: () => Promise<void>;
  updateUser: (user: User) => Promise<void>;
  setUser: (user: User) => void;
  setActiveRole: (role: 'gm' | 'player') => void;
  isLoading: boolean;
  setupSession: (user: FirebaseAuthUser, extraData?: { name?: string; role?: { isGm: boolean; isPlayer: boolean; }, campaignSecret?: string}) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeRole, setActiveRoleState] = useState<ActiveRole>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseAuthUser | null) => {
      if (firebaseUser) {
        if (!user || user.id !== firebaseUser.uid) {
           await setupSession(firebaseUser);
        } else {
           setIsLoading(false);
        }
      } else {
        await clearSession();
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  useEffect(() => {
    const handleRedirect = async () => {
        try {
            const firebaseUser = await handleGoogleRedirectResult();
            if (firebaseUser) {
                if (!user || user.id !== firebaseUser.uid) {
                    await setupSession(firebaseUser);
                }
            }
        } catch (error) {
            console.error("[Auth] Error handling Google redirect:", error);
        }
    };
    handleRedirect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isLoading) {
        if (user && !pathname.startsWith('/dashboard')) {
            router.push('/dashboard');
        } else if (!user && pathname.startsWith('/dashboard')) {
            router.push('/login');
        }
    }
  }, [user, isLoading, pathname, router]);


  const setupSession = async (firebaseUser: FirebaseAuthUser, extraData: { name?: string; role?: { isGm: boolean; isPlayer: boolean; }, campaignSecret?: string} = {}) => {
    setIsLoading(true);
    try {
        const loggedInUser = await findOrCreateUser(firebaseUser, extraData);
        
        if (loggedInUser && loggedInUser.enabled) {
          setUser(loggedInUser);
          
          if (loggedInUser.role.isGm && !loggedInUser.role.isPlayer) {
            setActiveRoleState('gm');
          } else if (!loggedInUser.role.isGm && loggedInUser.role.isPlayer) {
            setActiveRoleState('player');
          } else {
            setActiveRoleState(null);
          }
        } else {
          await clearSession();
        }
    } catch(error) {
        console.error("[Auth] Error during setupSession:", error);
        await clearSession();
    } finally {
        setIsLoading(false);
    }
  };

  const clearSession = async () => {
    setUser(null);
    setActiveRoleState(null);
  };

  const logout = async () => {
    if (auth.currentUser) {
        await auth.signOut();
    }
    await clearSession();
    router.push('/login');
  };
  
  const updateUser = async (updatedUser: User) => {
    if (!user) return;
    await updateDbUser(updatedUser.id, updatedUser);
    setUser(updatedUser);
  };

  const setActiveRole = (role: 'gm' | 'player') => {
    if (user && user.role.isGm && user.role.isPlayer) {
      setActiveRoleState(role);
    }
  };

  return (
    <AuthContext.Provider value={{ user, activeRole, setActiveRole, logout, isLoading, updateUser, setupSession, setUser }}>
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
