// src/lib/firebase.ts
// Async, safe Firebase initializer for Next (App Router) — dynamic imports to avoid SSR/tresshake issues

import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import type { Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";
import type { Functions } from "firebase/functions";

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
 * Initialize Firebase client SDKs. MUST be called from the browser.
 * Returns an object with app, auth, db, functions.
 */
export async function initializeFirebaseServices() {
  if (typeof window === "undefined") {
    console.warn("initializeFirebaseServices called on server — aborting.");
    return { app: null, auth: null, db: null, functions: null };
  }

  if (!firebaseConfig.apiKey) {
    console.error("Missing NEXT_PUBLIC_FIREBASE_API_KEY. Check .env.local and restart dev server.", {
      firebaseConfig: {
        projectId: firebaseConfig.projectId,
        authDomain: firebaseConfig.authDomain,
      },
    });
    // We don't throw here to allow the app to render, but auth will fail.
    return { app: null, auth: null, db: null, functions: null };
  }

  try {
    _app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  } catch (err) {
    console.error("Firebase initializeApp error (check config):", err);
    throw err;
  }

  try {
    // dynamic import ensures provider registration in browser runtime
    const authModule = await import("firebase/auth");
    const firestoreModule = await import("firebase/firestore");
    const functionsModule = await import("firebase/functions");

    _auth = _auth ?? authModule.getAuth(_app);
    
    try {
        _db = _db ?? firestoreModule.getFirestore(_app);
    } catch (e) {
        console.error("Firestore is not available. Please enable it in your Firebase project console.", e);
    }

    try {
        _functions = _functions ?? functionsModule.getFunctions(_app);
    } catch (e) {
        console.warn("Firebase Functions is not available.", e)
    }

    // If you want to connect to emulators in dev:
    if (process.env.NODE_ENV === 'development') {
        try {
            if (_auth && !(_auth as any).emulatorConfig) {
                authModule.connectAuthEmulator(_auth, "http://localhost:9099", { disableWarnings: true });
            }
            if (_db && !(_db as any)._settings.host.includes('localhost')) {
                firestoreModule.connectFirestoreEmulator(_db, "localhost", 8080);
            }
            if (_functions && !(_functions as any).emulatorOrigin) {
                functionsModule.connectFunctionsEmulator(_functions, "localhost", 5001);
            }
        } catch (error) {
            console.error("Error connecting to Firebase emulators:", error);
        }
    }


    return { app: _app, auth: _auth, db: _db, functions: _functions };
  } catch (err) {
    console.error("Error importing firebase submodules:", err);
    throw err;
  }
}

/** Helper—returns existing instances or null. Prefer calling initializeFirebaseServices() in client code. */
export function getFirebaseAuthSafe() {
  return _auth;
}
export function getFirestoreSafe() {
  return _db;
}
export function getFunctionsSafe() {
    return _functions;
}
