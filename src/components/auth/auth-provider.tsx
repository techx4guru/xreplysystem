'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import {
  User,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
} from 'firebase/auth';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { initializeFirebaseServices } from '@/lib/firebase';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

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
  emulatorError: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [firebaseError, setFirebaseError] = useState<string | null>(null);
  const { toast } = useToast();
  const [auth, setAuth] = useState<Auth | null>(null);
  const [db, setDb] = useState<Firestore | null>(null);
  const [emulatorError, setEmulatorError] = useState(false);

  useEffect(() => {
    const initFirebase = async () => {
      if (typeof window !== 'undefined' && !process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
        setFirebaseError(
          "Firebase is not configured. Please add your Firebase Web Config to your environment variables."
        );
        setLoading(false);
        return;
      }

      try {
        const { auth: authInstance, db: dbInstance, error } = await initializeFirebaseServices();
        if (error) setEmulatorError(true);
        if (!authInstance || !dbInstance) {
          setFirebaseError("Firebase not initialized correctly. Check environment variables.");
          setLoading(false);
          return;
        }

        setAuth(authInstance);
        setDb(dbInstance);

        authInstance.onAuthStateChanged((firebaseUser) => {
          if (!firebaseUser) {
            // No user signed in → load front page safely
            setUser(null);
            setLoading(false);
            return;
          }

          // User signed in → listen to their own profile document
          try {
            const userRef = doc(dbInstance, 'users', firebaseUser.uid);
            const unsubUserDoc = onSnapshot(
              userRef,
              (snapshot) => {
                if (snapshot.exists()) {
                  setUser({
                    ...(snapshot.data() as UserProfile),
                    emailVerified: firebaseUser.emailVerified,
                  });
                } else {
                  const newUserProfile: UserProfile = {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName,
                    photoURL: firebaseUser.photoURL,
                    role: 'operator',
                    emailVerified: firebaseUser.emailVerified,
                  };
                  setDoc(userRef, newUserProfile).catch((e) =>
                    console.error("Error creating user profile", e)
                  );
                  setUser(newUserProfile);
                }
                setLoading(false);
              },
              (error) => {
                console.error("Error reading user doc:", error);
                setLoading(false);
              }
            );

            return () => unsubUserDoc();
          } catch (err) {
            console.error("Failed to attach user listener:", err);
            setLoading(false);
          }
        });
      } catch (err) {
        console.error("Firebase initialization failed:", err);
        setFirebaseError("Could not connect to Firebase. Check network or environment.");
        setLoading(false);
      }
    };

    initFirebase();
  }, []);

  const handleAuthError = (error: any, context: string) => {
    console.error(`Error in ${context}:`, error);
    setIsAuthenticating(false);
    throw error;
  };

  const checkAuthReady = () => {
    if (!auth) {
      toast({
        variant: "destructive",
        title: "Configuration Error",
        description: "Firebase not initialized.",
      });
      return false;
    }
    if (emulatorError) {
      toast({
        variant: "destructive",
        title: "Emulator Connection Error",
        description: "Could not connect to Firebase emulators.",
      });
      return false;
    }
    return true;
  };

  const signInWithGoogle = async () => {
    if (!checkAuthReady()) return;
    setIsAuthenticating(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth!, provider);
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
      const userCredential = await createUserWithEmailAndPassword(auth!, email, password);
      const firebaseUser = userCredential.user;
      await updateProfile(firebaseUser, { displayName });
      const userProfile: UserProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName,
        photoURL: null,
        role: 'operator',
        emailVerified: false,
      };
      await setDoc(doc(db, 'users', firebaseUser.uid), userProfile);
      await sendEmailVerification(firebaseUser);
      toast({ title: "Verification Email Sent", description: "Check your inbox." });
      return firebaseUser;
    } catch (error: any) {
      handleAuthError(error, "Sign-Up");
      return null;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const signInWithEmail = async (email: string, password: string): Promise<User | null> => {
    if (!checkAuthReady()) return null;
    setIsAuthenticating(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth!, email, password);
      return userCredential.user;
    } catch (error: any) {
      handleAuthError(error, "Sign-In");
      return null;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const sendPasswordReset = async (email: string) => {
    if (!checkAuthReady()) return;
    try {
      await sendPasswordResetEmail(auth!, email);
      toast({ title: "Password Reset Email Sent", description: "Check your inbox." });
    } catch (error: any) {
      console.error("Password Reset Error:", error);
    }
  };

  const resendVerificationEmail = async () => {
    if (!checkAuthReady() || !auth?.currentUser) return;
    try {
      await sendEmailVerification(auth.currentUser);
      toast({ title: "Verification Email Sent", description: "Check your inbox." });
    } catch (error: any) {
      console.error("Resend Verification Error:", error);
    }
  };

  const signOut = async () => {
    if (!checkAuthReady()) return;
    try {
      await firebaseSignOut(auth!);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticating,
    firebaseError,
    signInWithGoogle,
    signOut,
    signUpWithEmail,
    signInWithEmail,
    sendPasswordReset,
    resendVerificationEmail,
    emulatorError,
  };

  return (
    <AuthContext.Provider value={value}>
      {firebaseError && (
        <div className="bg-destructive text-destructive-foreground p-3 text-center text-sm font-semibold flex items-center justify-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          <span>{firebaseError}</span>
          <Link href="/dev/env-checker" className="underline font-bold">
            Open Env Checker
          </Link>
        </div>
      )}
      {emulatorError && (
        <div className="bg-yellow-500 text-black p-3 text-center text-sm font-semibold flex items-center justify-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          <span>Could not connect to Firebase emulators. Some features may not work.</span>
          <Link href="/dev/env-checker" className="underline font-bold">
            Open Env Checker
          </Link>
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
      ) : (
        children
      )}
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
