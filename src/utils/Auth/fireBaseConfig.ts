import { initializeApp } from 'firebase/app';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'; 

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

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

