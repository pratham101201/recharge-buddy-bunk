
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB_9FmsmTSOj_FYq-kh7cgdIqhwuBLp4i0",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "electric-vehicle-recharg-2d586.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "electric-vehicle-recharg-2d586",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "electric-vehicle-recharg-2d586.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "456843971177",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:456843971177:web:98df2113074847a20630f8",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app); // Export auth directly
export const db = getDatabase(app); // Export db directly
