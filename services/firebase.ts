import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

const getEnvOrDefault = (value: string | undefined, fallback: string): string => {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : fallback;
};

const firebaseConfig = {
  apiKey: getEnvOrDefault(import.meta.env.VITE_FIREBASE_API_KEY, 'AIzaSyAytzYCdkGy122gZgBr2t97kkUg210jfaM'),
  authDomain: getEnvOrDefault(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN, 'mc-purchase.firebaseapp.com'),
  projectId: getEnvOrDefault(import.meta.env.VITE_FIREBASE_PROJECT_ID, 'mc-purchase'),
  storageBucket: getEnvOrDefault(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET, 'mc-purchase.firebasestorage.app'),
  messagingSenderId: getEnvOrDefault(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID, '108802237637'),
  appId: getEnvOrDefault(import.meta.env.VITE_FIREBASE_APP_ID, '1:108802237637:web:2cf94aeedb4326df607cac'),
  measurementId: getEnvOrDefault(import.meta.env.VITE_FIREBASE_MEASUREMENT_ID, 'G-4YD77HZJ1Y')
};

const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
