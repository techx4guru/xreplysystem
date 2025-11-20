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

// Initialize Firebase App
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let auth: Auth;
let db: Firestore;
let functions: Functions;

// This function ensures Firebase services are only initialized on the client-side.
function initializeFirebaseServices() {
    if (typeof window !== 'undefined') {
        if (!auth) {
            auth = getAuth(app);
            db = getFirestore(app);
            functions = getFunctions(app);

            if (process.env.NODE_ENV === 'development') {
                try {
                    // Check if emulators are already connected to prevent re-connecting on hot reloads
                    // @ts-ignore - _isEmulator is an internal property but useful here
                    if (!auth.emulatorConfig) {
                        connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
                    }
                    // @ts-ignore
                    if (!db._settings.host.includes('localhost')) {
                         connectFirestoreEmulator(db, 'localhost', 8080);
                    }
                     // @ts-ignore
                    if (!functions.emulatorOrigin) {
                        connectFunctionsEmulator(functions, 'localhost', 5001);
                    }
                } catch (error) {
                    console.error("Error connecting to Firebase emulators:", error);
                }
            }
        }
    }
}

// Immediately initialize services if on the client
if (typeof window !== 'undefined') {
    initializeFirebaseServices();
}


// Export the initialized services. The direct export is now safe because initialization is handled correctly.
// The types are asserted as they will be defined on the client.
export { app, auth, db, functions };
