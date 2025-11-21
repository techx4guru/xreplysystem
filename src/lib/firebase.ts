// src/lib/firebase.ts
// Clean, stable Firebase initializer for Next.js App Router (client-only)

import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

// --- IMPORTANT ---
// All values MUST come from NEXT_PUBLIC_ env vars.
// Set them in Firebase Studio → Environment Variables AND in .env.local locally.

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Prevent Firebase from initializing on the server
let app: FirebaseApp | null = null;

if (typeof window !== "undefined") {
  // Running in browser → safe to initialize Firebase
  if (!getApps().length) {
    if (!firebaseConfig.apiKey) {
      console.error("❌ Firebase config missing. Set your NEXT_PUBLIC_FIREBASE_* env variables.");
      throw new Error("Firebase config missing");
    }
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
} else {
  // On server → return null-safe placeholders
  app = null;
}

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const functions = app
  ? getFunctions(app, process.env.NEXT_PUBLIC_FUNCTIONS_BASE_URL || undefined)
  : null;
