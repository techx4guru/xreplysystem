// src/lib/firebase.ts
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp;
let auth: ReturnType<typeof getAuth>;
let db: ReturnType<typeof getFirestore>;
let functions: ReturnType<typeof getFunctions>;

try {
  if (!getApps().length) {
    if (!firebaseConfig.apiKey) {
      // This error will be caught by the AuthProvider to display a UI message.
      throw new Error("Firebase config is missing. Please set environment variables.");
    }
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }

  auth = getAuth(app);
  db = getFirestore(app);
  functions = getFunctions(app);

  if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
    try {
      console.log("Connecting to Firebase Emulators...");
      connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
      connectFirestoreEmulator(db, "localhost", 8080);
      connectFunctionsEmulator(functions, "localhost", 5001);
      console.info("Successfully connected to Firebase Emulators.");
    } catch (e) {
        console.warn("Could not connect to Firebase Emulators. Please run `firebase emulators:start`.");
    }
  }

} catch (error) {
    console.error("Firebase initialization failed:", error);
    // Gracefully handle the error by exporting null/undefined services.
    // The AuthProvider will detect this and show an error UI.
    const mockAuth = { onAuthStateChanged: () => () => {} } as unknown as ReturnType<typeof getAuth>;
    // @ts-ignore
    app = null;
    auth = mockAuth;
    // @ts-ignore
    db = null;
    // @ts-ignore
    functions = null;
}


export { app, auth, db, functions };
