// src/lib/firebase.ts
// Robust client-only Firebase initializer with emulator + mock fallback
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import type { Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";
import type { Functions } from "firebase/functions";
import type { FirebaseStorage } from "firebase/storage";
import { retry } from "@/lib/retry";

let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;
let _functions: Functions | null = null;
let _storage: FirebaseStorage | null = null;
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

// Create a minimal mock services object for offline dev
export function createMockServices() {
  return {
    app: null,
    auth: {
      onAuthStateChanged: (_cb: any) => { return () => {}; },
    },
    db: null,
    functions: null,
    storage: null,
    ready: true,
    _mock: true,
  };
}

export async function initializeFirebaseServices() {
  if (typeof window === "undefined") {
    return { app: null, auth: null, db: null, functions: null, storage: null, ready: false, error: null };
  }
  if (_initialized) return { app: _app, auth: _auth, db: _db, functions: _functions, storage: _storage, ready: true, error: _initError };

  if (!firebaseConfig.apiKey) {
    _initError = new Error("Missing NEXT_PUBLIC_FIREBASE_API_KEY");
    console.error("Missing NEXT_PUBLIC_FIREBASE_API_KEY — set envs in Firebase Studio and restart.");
    throw _initError;
  }

  // Retry initialization to tolerate transient network/DNS blips
  return retry(async () => {
    try {
      _app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
      const authMod = await import("firebase/auth");
      const firestoreMod = await import("firebase/firestore");
      const functionsMod = await import("firebase/functions");
      const storageMod = await import("firebase/storage");

      _auth = authMod.getAuth(_app);
      _db = firestoreMod.getFirestore(_app);
      _functions = functionsMod.getFunctions(_app, process.env.NEXT_PUBLIC_FUNCTIONS_BASE_URL || undefined);
      _storage = storageMod.getStorage(_app);

      if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true") {
        try {
          console.info("Connecting to Firebase emulators...");
          authMod.connectAuthEmulator(_auth, "http://localhost:9099", { disableWarnings: true });
          firestoreMod.connectFirestoreEmulator(_db, "localhost", 8080);
          functionsMod.connectFunctionsEmulator(_functions, "localhost", 5001);
          storageMod.connectStorageEmulator(_storage, "localhost", 9199);
          console.info("Connected to Firebase emulators");
        } catch (e) {
          console.warn("Emulator connection error", e);
           _initError = e as Error;
        }
      }
      
      
      // <<DEV DEBUG HELPERS - REMOVE BEFORE PROD>>
      if (typeof window !== "undefined" && process.env.NODE_ENV === 'development') {
        // @ts-ignore
        window.__auth = _auth;
        // @ts-ignore
        window.__getAuthClaims = async (force=false) => {
          // @ts-ignore
          if (!window.__auth || !window.__auth.currentUser) return null;
          try {
            // @ts-ignore
            const tr = await window.__auth.currentUser.getIdTokenResult(force);
            // @ts-ignore
            return { claims: tr.claims, uid: window.__auth.currentUser.uid, email: window.__auth.currentUser.email };
          } catch (e: any) {
            return { error: e?.message || String(e) };
          }
        };
      }


      _initialized = true;
      return { app: _app, auth: _auth, db: _db, functions: _functions, storage: _storage, ready: true, error: _initError };
    } catch (err: any) {
      console.error("Firebase init failed:", err);
       _initError = err;
      // If preview environment blocks network, throw so caller can choose fallback
      throw err;
    }
  }, { retries: 3, baseDelay: 500 });
}

export function getFirebaseInstancesIfReady() {
  return { app: _app, auth: _auth, db: _db, functions: _functions, storage: _storage, ready: _initialized, error: _initError };
}
