
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Campaign } from '@/lib/firebase/types';
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
    console.log("[Auth] Provider mounted. Setting up Firebase auth listener.");
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseAuthUser | null) => {
      console.log("[Auth] onAuthStateChanged triggered. Firebase user:", firebaseUser?.uid || "null");
      if (firebaseUser) {
        if (!user || user.id !== firebaseUser.uid) {
           console.log("[Auth] Context user doesn't match Firebase user. Setting up session for:", firebaseUser.uid);
           await setupSession(firebaseUser);
        } else {
           console.log("[Auth] Context user already matches Firebase user. No session setup needed.");
           setIsLoading(false);
        }
      } else {
        console.log("[Auth] No Firebase user. Clearing session and setting loading to false.");
        await clearSession();
        setIsLoading(false);
      }
    });

    return () => {
      console.log("[Auth] Unsubscribing from onAuthStateChanged.");
      unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  useEffect(() => {
    // This effect handles the result from a Google Sign-In redirect.
    // It should only run once on initial load.
    const handleRedirect = async () => {
        try {
            const firebaseUser = await handleGoogleRedirectResult();
            if (firebaseUser) {
                console.log("[Auth] Handled Google redirect. User found:", firebaseUser.uid);
                // If a new user is found from redirect, setup their session.
                // The onAuthStateChanged listener will handle persistence for existing users.
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
    // Redirect logic after user state changes
    if (!isLoading) {
        if (user && !pathname.startsWith('/dashboard')) {
            console.log("[Auth] User is loaded and not on dashboard, redirecting to /dashboard");
            router.push('/dashboard');
        } else if (!user && pathname.startsWith('/dashboard')) {
            console.log("[Auth] User is not loaded but is on dashboard, redirecting to /login");
            router.push('/login');
        }
    }
  }, [user, isLoading, pathname, router]);


  const setupSession = async (firebaseUser: FirebaseAuthUser, extraData: { name?: string; role?: { isGm: boolean; isPlayer: boolean; }, campaignSecret?: string} = {}) => {
    setIsLoading(true);
    console.log("[Auth] setupSession started for user:", firebaseUser.uid);
    try {
        const loggedInUser = await findOrCreateUser(firebaseUser, extraData);
        console.log("[Auth] findOrCreateUser returned:", loggedInUser);
        
        if (loggedInUser && loggedInUser.enabled) {
          setUser(loggedInUser);
          
          if (loggedInUser.role.isGm && !loggedInUser.role.isPlayer) {
            setActiveRoleState('gm');
            console.log("[Auth] Role set to: 'gm'");
          } else if (!loggedInUser.role.isGm && loggedInUser.role.isPlayer) {
            setActiveRoleState('player');
            console.log("[Auth] Role set to: 'player'");
          } else {
            setActiveRoleState(null);
            console.log("[Auth] User has dual roles. Role set to: null (awaiting choice)");
          }
        } else {
          console.log("[Auth] Logged in user is disabled or not found. Clearing session.");
          await clearSession();
        }
    } catch(error) {
        console.error("[Auth] Error during setupSession:", error);
        await clearSession();
    } finally {
        console.log("[Auth] setupSession finished. isLoading set to false.");
        setIsLoading(false);
    }
  };

  const clearSession = async () => {
    setUser(null);
    setActiveRoleState(null);
  };

  const logout = async () => {
    console.log("[Auth] logout called.");
    if (auth.currentUser) {
        await auth.signOut();
    }
    await clearSession();
    router.push('/login'); // Redirect to login on logout.
  };
  
  const updateUser = async (updatedUser: User) => {
    if (!user) return;
    await updateDbUser(updatedUser.id, updatedUser);
    setUser(updatedUser);
  };

  const setActiveRole = (role: 'gm' | 'player') => {
    if (user && user.role.isGm && user.role.isPlayer) {
      console.log(`[Auth] Manually setting active role to: ${role}`);
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
