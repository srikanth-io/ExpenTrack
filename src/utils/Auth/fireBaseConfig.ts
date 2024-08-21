import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyA3mFXWUYpxwjzaY69I_NK5m3Ik9wEuk4c',
  authDomain: 'project-id.firebaseapp.com',
  databaseURL: 'https://project-id.firebaseio.com',
  projectId: 'expen-track',
  storageBucket: 'expen-track.appspot.com',
  messagingSenderId: '1017015544471',
  appId: '1:1017015544471:android:041085c9e87fdb72a4d7d2',
  measurementId: 'G-measurement-id',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const firestore = getFirestore(app);

export { app, auth, firestore };
