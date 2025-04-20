
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

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

export default app;
