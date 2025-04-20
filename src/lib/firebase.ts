
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

try {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  let analytics = null;

  if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
  }

  export { app as default, auth, db, analytics };
} catch (error) {
  console.error('Firebase initialization error:', error);
  throw error;
}
