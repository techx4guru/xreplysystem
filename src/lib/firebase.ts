import { initializeApp, getApps, getApp, FirebaseOptions } from 'firebase/app';
import { getAuth, connectAuthEmulator, Auth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, Firestore } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator, Functions } from 'firebase/functions';

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

let auth: Auth;
let db: Firestore;
let functions: Functions;

// Check if we are on the client side before initializing Firebase services
if (typeof window !== 'undefined') {
    auth = getAuth(app);
    db = getFirestore(app);
    functions = getFunctions(app);

    // Connect to emulators in development
    if (process.env.NODE_ENV === 'development') {
        // Point to the emulators
        // Make sure you're running the emulators with `firebase emulators:start`
        try {
            connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
            connectFirestoreEmulator(db, 'localhost', 8080);
            connectFunctionsEmulator(functions, 'localhost', 5001);
            console.log("Connected to Firebase Emulators");
        } catch (error) {
            console.error("Error connecting to Firebase emulators:", error);
        }
    }
}

// @ts-ignore
export { app, auth, db, functions };
