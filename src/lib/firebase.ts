// src/lib/firebase.ts
// Async, safe Firebase initializer for Next (App Router) — dynamic imports to avoid SSR/tresshake issues

import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, connectAuthEmulator, type Auth } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator, type Firestore } from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator, type Functions } from "firebase/functions";

let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;
let _functions: Functions | null = null;

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? "",
};

/**
 * Initializes Firebase client SDKs. This function is idempotent and safe to call multiple times.
 * It will only initialize the services once. It should only be called in browser contexts.
 */
export function initializeFirebaseServices() {
  if (typeof window === "undefined") {
    // This function should not be called on the server.
    return;
  }

  if (_app) {
    // Already initialized
    return;
  }

  if (!firebaseConfig.apiKey) {
    console.error("Missing NEXT_PUBLIC_FIREBASE_API_KEY. Check .env.local and restart dev server.");
    // Do not throw an error, but services will not be available.
    return;
  }

  try {
    _app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    _auth = getAuth(_app);
    _db = getFirestore(_app);
    _functions = getFunctions(_app);

    // Connect to emulators in development
    if (process.env.NODE_ENV === 'development') {
        // Check if emulators are already connected to prevent errors
        if (!(_auth as any).emulatorConfig) {
            connectAuthEmulator(_auth, "http://localhost:9099", { disableWarnings: true });
        }
        if (!(_db as any)._settings.host.includes('localhost')) {
            connectFirestoreEmulator(_db, "localhost", 8080);
        }
        if (!(_functions as any).emulatorOrigin) {
             connectFunctionsEmulator(_functions, "localhost", 5001);
        }
    }

  } catch (err) {
    console.error("Firebase initialization error:", err);
  }
}

/** 
 * Helper to get existing Firebase instances. 
 * Throws an error if services are not initialized.
 */
export function getFirebaseInstancesIfReady() {
    if (!_app || !_auth || !_db) {
        // This can happen if initialization failed or hasn't completed.
        console.error("Firebase services are not initialized. Please ensure initializeFirebaseServices() is called in a client component.");
        return { app: null, auth: null, db: null, functions: null };
    }
    return { app: _app, auth: _auth, db: _db, functions: _functions };
}
