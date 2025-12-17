import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAyeCpX8oN5SUteKKUEAeT8A4dL7zc2ivw",
    authDomain: "habit-tracker-b957b.firebaseapp.com",
    projectId: "habit-tracker-b957b",
    storageBucket: "habit-tracker-b957b.firebasestorage.app",
    messagingSenderId: "275723923519",
    appId: "1:275723923519:web:17f9303346e1516944888a",
    measurementId: "G-S9MKSJWXWE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
