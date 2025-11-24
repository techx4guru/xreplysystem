// src/lib/firebase.ts
// Robust client-only Firebase initializer with emulator + debug helpers

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

// Mock fallback for offline dev
export function createMockServices() {
  return {
    app: null,
    auth: { onAuthStateChanged: () => () => {} },
    db: null,
    functions: null,
    storage: null,
    ready: true,
    _mock: true
  };
}

export async function initializeFirebaseServices() {
  if (typeof window === "undefined") {
    return { app: null, auth: null, db: null, functions: null, storage: null, ready: false };
  }

  if (_initialized) {
    return { app: _app, auth: _auth, db: _db, functions: _functions, storage: _storage, ready: true };
  }

  if (!firebaseConfig.apiKey) {
    const err = new Error("Missing NEXT_PUBLIC_FIREBASE_API_KEY");
    console.error(err);
    throw err;
  }

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

      // Emulator support
      if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true") {
        console.info("Connecting Firebase Emulators...");
        try {
          authMod.connectAuthEmulator(_auth, "http://localhost:9099", { disableWarnings: true });
          firestoreMod.connectFirestoreEmulator(_db, "localhost", 8080);
          functionsMod.connectFunctionsEmulator(_functions, "localhost", 5001);
          storageMod.connectStorageEmulator(_storage, "localhost", 9199);
        } catch (e) {
          console.warn("Emulator error", e);
        }
      }

      // Developer debug helpers — SAFE implementation
      if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
        // @ts-ignore
        window.__firebase = {
          app: _app,
          auth: _auth,
          db: _db,
          functions: _functions,
          storage: _storage,
          getClaims: async (force = false) => {
            if (!_auth?.currentUser) return null;
            const r = await _auth.currentUser.getIdTokenResult(force);
            return { uid: r.claims.user_id, email: r.claims.email, claims: r.claims };
          },
          setFirestoreLogLevel: async (level = "debug") => {
            const m = await import("firebase/firestore");
            m.setLogLevel(level);
            console.log("Firestore log level:", level);
          },
          probeDocs: async (
            paths = [
              "config/app",
              "autopilot/config",
              "config/global",
              "settings/app",
              "autopilot/boot",
              "public/config"
            ]
          ) => {
            const { doc, getDoc } = await import("firebase/firestore");
            const results: any[] = [];

            for (const p of paths) {
              const [col, id] = p.split("/");
              try {
                const ref = doc(_db!, col, id);
                const snap = await getDoc(ref);
                results.push({
                  path: p,
                  exists: snap.exists(),
                  data: snap.exists() ? snap.data() : null,
                  error: null
                });
              } catch (err: any) {
                results.push({
                  path: p,
                  exists: false,
                  data: null,
                  error: err.message
                });
              }
            }

            console.table(results);
            return results;
          }
        };

        console.log("%c🔥 Firebase Debug Enabled", "color:#0f0;font-weight:bold;");
      }

      _initialized = true;
      return { app: _app, auth: _auth, db: _db, functions: _functions, storage: _storage, ready: true };
    } catch (err) {
      console.error("Firebase init failed:", err);
      throw err;
    }
  }, { retries: 3, baseDelay: 500 });
}

export function getFirebaseInstancesIfReady() {
  return {
    app: _app,
    auth: _auth,
    db: _db,
    functions: _functions,
    storage: _storage,
    ready: _initialized
  };
}
