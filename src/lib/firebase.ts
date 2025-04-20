
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBpG5iLiMkTVpVtLkpTTaE-pkHPknA1w7E",
  authDomain: "alramz-c461e.firebaseapp.com",
  projectId: "alramz-c461e", 
  storageBucket: "alramz-c461e.firebasestorage.app",
  messagingSenderId: "149411313418",
  appId: "1:149411313418:web:793ad53435603c948f2cf3",
  measurementId: "G-ZR262TCTMB"
};

let app;
let auth;
let db;
let analytics;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  // Only initialize analytics if window is available (client-side)
  if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
}

export { app as default, auth, db, analytics };
