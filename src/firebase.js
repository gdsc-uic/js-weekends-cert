import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);
export const db = firebaseApp.firestore();
export const auth = firebaseApp.auth();
export const analytics = firebaseApp.analytics();
export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
      const unsubscribe = auth.onAuthStateChanged(user => {
          unsubscribe();
          if (user && import.meta.env.PROD) {
            analytics.setUserId(user.uid);
            analytics.setUserProperties({
              account_type: 'Basic'
            });
          }
          resolve(user);
      }, reject);
  })
};
