
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
<<<<<<< HEAD
import { getFirestore } from "firebase/firestore";
=======
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';
>>>>>>> 543bf2e081ddd17398953dc1c271e9e57e3bcdf4

// Use import.meta.env instead of process.env for Vite applications
const firebaseConfig = {
<<<<<<< HEAD
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
=======
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyB_9FmsmTSOj_FYq-kh7cgdIqhwuBLp4i0',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'electric-vehicle-recharg-2d586.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'electric-vehicle-recharg-2d586',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'electric-vehicle-recharg-2d586.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '456843971177',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:456843971177:web:98df2113074847a20630f8',
>>>>>>> 543bf2e081ddd17398953dc1c271e9e57e3bcdf4
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const auth = getAuth(app); // Export auth directly
<<<<<<< HEAD
export { db }; // Export db directly
=======
export const db = getDatabase(app); // Export db directly
export const firestore = getFirestore(app); // Export Firestore
>>>>>>> 543bf2e081ddd17398953dc1c271e9e57e3bcdf4
