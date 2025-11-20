// src/lib/firebase.ts
// Robust Firebase initializer with emulator & mock fallback
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import type { Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";
import type { Functions } from "firebase/functions";

let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;
let _functions: Functions | null = null;
let _initialized = false;

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
 * initializeFirebaseServices:
 * - runs only in browser
 * - dynamically imports firebase submodules
 * - tries connecting to emulator if env flag set
 */
export async function initializeFirebaseServices() {
  if (typeof window === "undefined") {
    return { app: null, auth: null, db: null, functions: null, ready: false };
  }
  if (_initialized) return { app: _app, auth: _auth, db: _db, functions: _functions, ready: true };

  if (!firebaseConfig.apiKey) {
    console.error("Missing NEXT_PUBLIC_FIREBASE_API_KEY — set envs in Firebase Studio and restart.");
    throw new Error("Missing NEXT_PUBLIC_FIREBASE_API_KEY");
  }

  try {
    _app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    const authModule = await import("firebase/auth");
    const firestoreModule = await import("firebase/firestore");
    const functionsModule = await import("firebase/functions");

    _auth = authModule.getAuth(_app);
    _db = firestoreModule.getFirestore(_app);
    _functions = functionsModule.getFunctions(_app, process.env.NEXT_PUBLIC_FUNCTIONS_BASE_URL || undefined);

    if (process.env.NODE_ENV === 'development') {
        try {
          console.log("Connecting to emulators");
          authModule.connectAuthEmulator(_auth, "http://localhost:9099", { disableWarnings: true });
          firestoreModule.connectFirestoreEmulator(_db, "localhost", 8080);
          functionsModule.connectFunctionsEmulator(_functions, "localhost", 5001);
          console.info("Connected to Firebase emulators");
        } catch (e) {
          console.warn("Emulator connection failed. This is expected if emulators are not running.", e);
        }
      }

    _initialized = true;
    return { app: _app, auth: _auth, db: _db, functions: _functions, ready: true };
  } catch (err) {
    console.error("Firebase init failed:", err);
    throw err;
  }
}

/**
 * getFirebaseInstancesIfReady - synchronous accessor
 */
export function getFirebaseInstancesIfReady() {
  return { app: _app, auth: _auth, db: _db, functions: _functions, ready: _initialized };
}