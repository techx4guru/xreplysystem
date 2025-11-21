// src/lib/firebase.ts
// Robust client-only Firebase initializer with emulator + mock fallback
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import type { Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";
import type { Functions } from "firebase/functions";
import { retry } from "@/lib/retry";

let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;
let _functions: Functions | null = null;
let _initialized = false;
let _initError: Error | null = null;

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
 * - fails fast if config is missing
 * - tries connecting to emulator if env flag set
 */
export async function initializeFirebaseServices() {
  if (typeof window === "undefined") {
    console.warn("initializeFirebaseServices called on server — aborting.");
    return { app: null, auth: null, db: null, functions: null, ready: false, error: new Error("Server side") };
  }
  if (_initialized) return { app: _app, auth: _auth, db: _db, functions: _functions, ready: true, error: _initError };

  if (!firebaseConfig.apiKey) {
    const err = new Error("Missing NEXT_PUBLIC_FIREBASE_API_KEY. Check .env.local and restart dev server.");
    _initError = err;
    console.error(err.message, {
        firebaseConfig: {
            projectId: firebaseConfig.projectId,
            authDomain: firebaseConfig.authDomain,
        },
    });
    return { app: null, auth: null, db: null, functions: null, ready: false, error: err };
  }
  
  return retry(async () => {
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
          console.log("Connecting to emulators...");
          authModule.connectAuthEmulator(_auth, "http://localhost:9099", { disableWarnings: true });
          firestoreModule.connectFirestoreEmulator(_db, "localhost", 8080);
          functionsModule.connectFunctionsEmulator(_functions, "localhost", 5001);
          console.info("Successfully connected to Firebase emulators.");
        } catch (e: any) {
          console.warn("Could not connect to Firebase emulators. Please run `firebase emulators:start`.");
          _initError = new Error("Emulator connection failed");
        }
      }
      
      _initialized = true;
      return { app: _app, auth: _auth, db: _db, functions: _functions, ready: true, error: null };
    } catch (err: any) {
      console.error("Firebase init failed:", err);
      _initError = err;
      throw err;
    }
  }, { retries: 3, baseDelay: 500 });
}

/**
 * getFirebaseInstancesIfReady - synchronous accessor
 */
export function getFirebaseInstancesIfReady() {
  return { app: _app, auth: _auth, db: _db, functions: _functions, ready: _initialized, error: _initError };
}
