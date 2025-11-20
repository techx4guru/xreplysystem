// src/lib/firebase.ts
// Safe client-only lazy Firebase initializer

import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import type { Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";
import type { Functions } from "firebase/functions";

let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;
let _functions: Functions | null = null;

// Read config from NEXT_PUBLIC envs (must be available at build time)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? "",
};

// Lazy init function — call this only in browser contexts
export function initializeFirebaseServices() {
  if (typeof window === "undefined") {
    // server — do not initialize client SDK here
    console.warn("initializeFirebaseServices called on server — aborting.");
    return { app: null, auth: null, db: null, functions: null };
  }

  // Basic env validation: make this obvious in console
  if (!firebaseConfig.apiKey) {
    console.error("Missing NEXT_PUBLIC_FIREBASE_API_KEY. Check .env.local and restart dev server.", {
      firebaseConfig,
    });
    throw new Error("Missing NEXT_PUBLIC_FIREBASE_API_KEY");
  }

  try {
    _app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  } catch (err) {
    // If initialization fails, log config (without revealing secret in prod) and rethrow
    console.error("Firebase initializeApp error (check config):", err, {
      projectId: firebaseConfig.projectId,
      authDomain: firebaseConfig.authDomain,
    });
    throw err;
  }

  // Import the client-only modules lazily to ensure bundlers don't hoist them to server
  // NOTE: these imports are synchronous but only executed in the browser block above.
  // Keep typed exports for convenience.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { getAuth, connectAuthEmulator } = require("firebase/auth");
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { getFirestore, connectFirestoreEmulator } = require("firebase/firestore");
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { getFunctions, connectFunctionsEmulator } = require("firebase/functions");

  _auth = _auth ?? getAuth(_app);
  _db = _db ?? getFirestore(_app);
  _functions = _functions ?? getFunctions(_app);
  
    if (process.env.NODE_ENV === 'development') {
        try {
            // @ts-ignore - _isEmulator is an internal property but useful here
            if (!_auth.emulatorConfig) {
                connectAuthEmulator(_auth, 'http://localhost:9099', { disableWarnings: true });
            }
            // @ts-ignore
            if (!_db._settings.host.includes('localhost')) {
                 connectFirestoreEmulator(_db, 'localhost', 8080);
            }
             // @ts-ignore
            if (!_functions.emulatorOrigin) {
                connectFunctionsEmulator(_functions, 'localhost', 5001);
            }
        } catch (error) {
            console.error("Error connecting to Firebase emulators:", error);
        }
    }


  return { app: _app, auth: _auth, db: _db, functions: _functions };
}

export function getFirebaseAuthSafe() {
  if (typeof window === "undefined") return null;
  if (!_auth) initializeFirebaseServices();
  return _auth as Auth;
}
export function getFirestoreSafe() {
  if (typeof window === "undefined") return null;
  if (!_db) initializeFirebaseServices();
  return _db as Firestore;
}
export function getFunctionsSafe() {
  if (typeof window === "undefined") return null;
  if (!_functions) initializeFirebaseServices();
  return _functions as Functions;
}

// These are for convenience but should be used with caution in components
// that might be server-rendered.
export const auth = getFirebaseAuthSafe();
export const db = getFirestoreSafe();
export const functions = getFunctionsSafe();
