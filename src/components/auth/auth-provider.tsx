'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import { onAuthStateChanged, User, signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import type { UserProfile, UserRole } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isAuthenticating: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      if (firebaseUser) {
        const userRef = doc(db, 'users', firebaseUser.uid);
        
        const unsubscribeSnapshot = onSnapshot(userRef, async (snapshot) => {
          if (snapshot.exists()) {
            setUser(snapshot.data() as UserProfile);
          } else {
            // New user, create a profile
            const newUserProfile: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              role: 'operator', // Default role
            };
            await setDoc(userRef, newUserProfile);
            setUser(newUserProfile);
          }
          setLoading(false);
        });

        return () => unsubscribeSnapshot();
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setIsAuthenticating(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in with Google:', error);
    } finally {
        setIsAuthenticating(false);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = { user, loading, isAuthenticating, signInWithGoogle, signOut };

  // Render a loading screen while auth state is being determined
  if (loading) {
    return (
        <div className="flex h-screen w-screen items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-12 w-12 text-primary animate-pulse"
                  >
                    <path d="M11.767 19.089c4.91 0 7.43-4.141 7.43-7.43 0-1.3-.323-2.52-.89-3.635" />
                    <path d="M14.534 9.873a4.136 4.136 0 0 0-4.66-4.66" />
                    <path d="M19.199 4.801c-1.115-.568-2.315-.89-3.635-.89-3.289 0-7.43 2.52-7.43 7.43 0 4.91 4.141 7.43 7.43 7.43 1.3 0 2.52-.323 3.635-.89" />
                    <path d="M9.873 9.466a4.136 4.136 0 0 1 4.66 4.66" />
                    <path d="M4.801 4.801C3.685 5.915 2.5 7.69 2.5 9.873c0 3.289 2.52 7.43 7.43 7.43" />
                  </svg>
                  <p className="text-muted-foreground">Initializing Autopilot...</p>
            </div>
        </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
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
