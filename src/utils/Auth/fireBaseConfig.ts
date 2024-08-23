// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import {getFirestore} from 'firebase/firestore'
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDd6W1SEblOk6qDo57TYqSR-wYxQj2OdPw",
  authDomain: "expen-track.firebaseapp.com",
  projectId: "expen-track",
  storageBucket: "expen-track.appspot.com",
  messagingSenderId: "1017015544471",
  appId: "1:1017015544471:web:8b884038c2fc1315a4d7d2",
  measurementId: "G-VPGVZECF8X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

// Initialize Authentication with persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
