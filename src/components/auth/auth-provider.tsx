'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import { User, signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification, updateProfile } from 'firebase/auth';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { auth, db } from '@/lib/firebase';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isAuthenticating: boolean;
  firebaseError: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<User | null>;
  signInWithEmail: (email: string, password: string) => Promise<User | null>;
  sendPasswordReset: (email: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [firebaseError, setFirebaseError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Runtime check for API key
    if (typeof window !== 'undefined' && !process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
        console.error("Firebase API key missing at runtime.");
        setFirebaseError("Firebase is not configured. Please add your Firebase Web Config to your environment variables.");
    }
    
    if (!auth || !db) {
        setFirebaseError("Firebase is not configured correctly. Check your environment variables and restart the server.");
        setLoading(false);
        return;
    }

    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const userRef = doc(db, 'users', firebaseUser.uid);
        const unsubUserDoc = onSnapshot(userRef, (snapshot) => {
          if (snapshot.exists()) {
            setUser({ ...(snapshot.data() as UserProfile), emailVerified: firebaseUser.emailVerified });
          } else {
             const newUserProfile: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              role: 'operator', // Default role
              emailVerified: firebaseUser.emailVerified,
            };
            setDoc(userRef, newUserProfile).catch(e => console.error("Error creating user profile", e));
            setUser(newUserProfile);
          }
           setLoading(false);
        });
        return () => unsubUserDoc();
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);
  
  const handleAuthError = (error: any, context: string) => {
    // This will be handled by the UI components now, but we can still log it.
    console.error(`Error in ${context}:`, error);
    setIsAuthenticating(false);
    throw error; // Re-throw the error to be caught by the form's catch block
  }

  const checkAuthReady = () => {
      if (!auth) {
          toast({ variant: "destructive", title: "Configuration Error", description: "Firebase not initialized. Check your environment variables." });
          return false;
      }
      return true;
  }

  const signInWithGoogle = async () => {
    if (!checkAuthReady()) return;
    setIsAuthenticating(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      handleAuthError(error, "Google Sign-In");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const signUpWithEmail = async (email: string, password: string, displayName: string): Promise<User | null> => {
    if (!checkAuthReady() || !db) return null;
    setIsAuthenticating(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      await updateProfile(firebaseUser, { displayName });
      const userProfile: UserProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: displayName,
        photoURL: null,
        role: 'operator',
        emailVerified: false,
      };
      await setDoc(doc(db, 'users', firebaseUser.uid), userProfile);
      await sendEmailVerification(firebaseUser);
      toast({ title: "Verification Email Sent", description: "Please check your inbox to verify your email address." });
      setIsAuthenticating(false);
      return firebaseUser;
    } catch (error: any) {
      handleAuthError(error, "Sign-Up");
      return null;
    }
  };

  const signInWithEmail = async (email: string, password: string): Promise<User | null> => {
    if (!checkAuthReady()) return null;
    setIsAuthenticating(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setIsAuthenticating(false);
      return userCredential.user;
    } catch (error: any)
    {
      handleAuthError(error, "Sign-In");
      return null;
    }
  };

  const sendPasswordReset = async (email: string) => {
    if (!checkAuthReady()) return;
    try {
      await sendPasswordResetEmail(auth, email);
      toast({ title: "Password Reset Email Sent", description: "If an account exists, you will receive reset instructions." });
    } catch (error: any) {
        const { mapFirebaseAuthError } = await import('@/lib/authErrors');
        const mappedError = mapFirebaseAuthError(error);
        toast({ variant: "destructive", title: "Password Reset Error", description: mappedError.message });
    }
  };

  const resendVerificationEmail = async () => {
    if (!checkAuthReady() || !auth.currentUser) return;
    try {
      await sendEmailVerification(auth.currentUser);
      toast({ title: "Verification Email Sent", description: "A new verification email has been sent." });
    } catch (error: any) {
        const { mapFirebaseAuthError } = await import('@/lib/authErrors');
        const mappedError = mapFirebaseAuthError(error);
        toast({ variant: "destructive", title: "Verification Error", description: mappedError.message });
    }
  };

  const signOut = async () => {
    if (!checkAuthReady()) return;
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = { user, loading, isAuthenticating, firebaseError, signInWithGoogle, signOut, signUpWithEmail, signInWithEmail, sendPasswordReset, resendVerificationEmail };

  return (
    <AuthContext.Provider value={value}>
        {firebaseError && (
            <div className="bg-destructive text-destructive-foreground p-3 text-center text-sm font-semibold flex items-center justify-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                <span>{firebaseError}</span>
                 <Link href="/dev/env-checker" className="underline font-bold">Open Env Checker</Link>
            </div>
        )}
        {loading ? (
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
        ) : children}
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
