import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAytzYCdkGy122gZgBr2t97kkUg210jfaM',
  authDomain: 'mc-purchase.firebaseapp.com',
  projectId: 'mc-purchase',
  storageBucket: 'mc-purchase.firebasestorage.app',
  messagingSenderId: '108802237637',
  appId: '1:108802237637:web:2cf94aeedb4326df607cac',
  measurementId: 'G-4YD77HZJ1Y'
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
