import { type FirebaseApp, getApps, initializeApp } from "firebase/app";
import { type Auth, getAuth } from "firebase/auth";
import { type Firestore, getFirestore } from "firebase/firestore";
import { type FirebaseStorage, getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function createFirebaseApp(): FirebaseApp {
  return getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
}

// Auth/Firestore/Storage validate config eagerly. Every Firebase-backed
// hook only runs client-side (inside useEffect), so it's safe to skip
// construction during SSR/static build — otherwise a build with no
// Firebase project configured yet (NEXT_PUBLIC_FIREBASE_* unset) would
// crash on prerender instead of just failing real auth calls in the browser.
const isBrowser = typeof window !== "undefined";

export const firebaseApp = createFirebaseApp();
export const auth = (isBrowser ? getAuth(firebaseApp) : undefined) as Auth;
export const db = (isBrowser ? getFirestore(firebaseApp) : undefined) as Firestore;
export const storage = (isBrowser
  ? getStorage(firebaseApp)
  : undefined) as FirebaseStorage;
