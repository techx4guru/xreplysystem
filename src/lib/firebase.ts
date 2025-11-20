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
 * Returns an object with app, auth, db, functions, and an optional error string.
 */
export async function initializeFirebaseServices() {
  if (typeof window === "undefined") {
    console.warn("initializeFirebaseServices called on server — aborting.");
    return { app: null, auth: null, db: null, functions: null, error: 'server-side' };
  }

  if (!firebaseConfig.apiKey) {
    console.error("Missing NEXT_PUBLIC_FIREBASE_API_KEY. Check .env.local and restart dev server.");
    // Don't throw, just return error state
    return { app: null, auth: null, db: null, functions: null, error: 'missing-key' };
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
    _db = _db ?? firestoreModule.getFirestore(_app);
    _functions = _functions ?? functionsModule.getFunctions(_app, process.env.NEXT_PUBLIC_FUNCTIONS_BASE_URL || undefined);

    let emulatorError: string | null = null;
    if (process.env.NODE_ENV === 'development') {
        try {
          console.log("Connecting to emulators");
          authModule.connectAuthEmulator(_auth, "http://localhost:9099", { disableWarnings: true });
          firestoreModule.connectFirestoreEmulator(_db, "localhost", 8080);
          functionsModule.connectFunctionsEmulator(_functions, "localhost", 5001);
          console.info("Connected to Firebase emulators");
        } catch (e) {
          console.warn("Emulator connection failed. This is expected if emulators are not running.", e);
          emulatorError = 'emulator-connection-failed';
        }
    }

    return { app: _app, auth: _auth, db: _db, functions: _functions, error: emulatorError };
  } catch (err) {
    console.error("Error importing firebase submodules:", err);
    throw err;
  }
}

/** Helper—returns existing instances or null. Prefer calling initializeFirebaseServices() in client code. */
export function getFirebaseInstancesIfReady() {
  return { app: _app, auth: _auth, db: _db, functions: _functions };
}
