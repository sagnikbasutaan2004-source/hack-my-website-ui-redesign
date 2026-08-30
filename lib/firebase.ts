import { getApps, initializeApp } from "firebase/app";
import { browserLocalPersistence, getAuth, setPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
};

const hasRequiredFirebaseConfig = Object.values(firebaseConfig).every(Boolean);

const firebaseApp = hasRequiredFirebaseConfig
  ? getApps().length
    ? getApps()[0]
    : initializeApp(firebaseConfig)
  : null;

export const firebaseAuth = firebaseApp ? getAuth(firebaseApp) : null;

/**
 * Keep client-side Firebase auth state available across the Google OAuth
 * handoff. The backend still validates every ID token server-side.
 */
export const persistenceReady: Promise<void> = firebaseAuth
  ? setPersistence(firebaseAuth, browserLocalPersistence)
  : Promise.resolve();
