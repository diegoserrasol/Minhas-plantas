import { type FirebaseApp, getApps, initializeApp } from "firebase/app";
import { type Auth, getAuth } from "firebase/auth";
import { type Firestore, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Auth/Firestore validate the config eagerly at construction time, on
// both server and client. Until a real Firebase project is configured
// (NEXT_PUBLIC_FIREBASE_* set), skip construction entirely so the app can
// still render — every consumer (AuthProvider, repositories) is only ever
// reached from an authenticated route, so `undefined` here just means
// "sign-in isn't wired up yet" instead of a hard crash on every page load.
export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey);

function createFirebaseApp(): FirebaseApp | undefined {
  if (!isFirebaseConfigured) return undefined;
  return getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
}

export const firebaseApp = createFirebaseApp();
export const auth = (firebaseApp ? getAuth(firebaseApp) : undefined) as Auth;
export const db = (firebaseApp ? getFirestore(firebaseApp) : undefined) as Firestore;
