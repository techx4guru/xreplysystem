'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import { onAuthStateChanged, User, signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification, updateProfile } from 'firebase/auth';
import { doc, onSnapshot, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { initializeFirebaseServices, getFirebaseInstancesIfReady } from '@/lib/firebase';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isAuthenticating: boolean;
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
  const { toast } = useToast();
  
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    
    // Initialize Firebase services on component mount.
    // This function is client-side only and safe to call here.
    initializeFirebaseServices();
    const { auth, db } = getFirebaseInstancesIfReady();

    if (!auth || !db) {
      console.error("Firebase services not available. Check your configuration and .env.local file.");
      setLoading(false);
      return;
    }

    unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      if (firebaseUser) {
        const userRef = doc(db, 'users', firebaseUser.uid);
        
        const unsubscribeSnapshot = onSnapshot(userRef, async (snapshot) => {
          if (snapshot.exists()) {
            setUser({...(snapshot.data() as UserProfile), emailVerified: firebaseUser.emailVerified});
          } else {
            // This case handles users signing in via Google for the first time.
            const newUserProfile: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              role: 'operator', // Default role
              emailVerified: firebaseUser.emailVerified,
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

    return () => {
        if (unsubscribe) {
            unsubscribe();
        }
    };
  }, []);

  const signInWithGoogle = async () => {
    const { auth } = getFirebaseInstancesIfReady();
    if (!auth) {
        toast({ variant: "destructive", title: "Configuration Error", description: "Firebase is not configured." });
        return;
    }
    setIsAuthenticating(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
       toast({
        variant: "destructive",
        title: "Authentication Error",
        description: error.message,
      });
    } finally {
        setIsAuthenticating(false);
    }
  };

  const signUpWithEmail = async (email: string, password: string, displayName: string) => {
    const { auth, db } = getFirebaseInstancesIfReady();
    if (!auth || !db) {
        toast({ variant: "destructive", title: "Configuration Error", description: "Firebase is not configured." });
        return null;
    }
    setIsAuthenticating(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Update the user's profile with the display name
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

      toast({
          title: "Verification Email Sent",
          description: "Please check your inbox to verify your email address.",
      });
      
      return firebaseUser;

    } catch (error: any) {
      console.error('Error signing up:', error);
      toast({
        variant: "destructive",
        title: "Sign-up Failed",
        description: error.message,
      });
      return null;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    const { auth } = getFirebaseInstancesIfReady();
    if (!auth) {
        toast({ variant: "destructive", title: "Configuration Error", description: "Firebase is not configured." });
        return null;
    }
    setIsAuthenticating(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error: any)
{
      console.error('Error signing in:', error);
      toast({
        variant: "destructive",
        title: "Sign-in Failed",
        description: "Invalid email or password. Please try again.",
      });
      return null;
    } finally {
        setIsAuthenticating(false);
    }
  };
  
  const sendPasswordReset = async (email: string) => {
      const { auth } = getFirebaseInstancesIfReady();
      if (!auth) {
        toast({ variant: "destructive", title: "Configuration Error", description: "Firebase is not configured." });
        return;
      }
      try {
          await sendPasswordResetEmail(auth, email);
          toast({
              title: "Password Reset Email Sent",
              description: "If an account exists for this email, you will receive instructions to reset your password.",
          });
      } catch (error: any) {
          console.error("Error sending password reset email:", error);
           toast({
              variant: "destructive",
              title: "Error",
              description: "Could not send password reset email. Please try again later.",
          });
      }
  };

  const resendVerificationEmail = async () => {
    const { auth } = getFirebaseInstancesIfReady();
    if (!auth) {
        toast({ variant: "destructive", title: "Configuration Error", description: "Firebase is not configured." });
        return;
    }
    const firebaseUser = auth.currentUser;
    if (firebaseUser) {
        try {
            await sendEmailVerification(firebaseUser);
            toast({
                title: "Verification Email Sent",
                description: "A new verification email has been sent to your address.",
            });
        } catch (error: any) {
            console.error("Error resending verification email:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to send verification email. Please try again later.",
            });
        }
    }
  };

  const signOut = async () => {
    const { auth } = getFirebaseInstancesIfReady();
    if (!auth) {
        toast({ variant: "destructive", title: "Configuration Error", description: "Firebase is not configured." });
        return;
    }
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = { user, loading, isAuthenticating, signInWithGoogle, signOut, signUpWithEmail, signInWithEmail, sendPasswordReset, resendVerificationEmail };

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
