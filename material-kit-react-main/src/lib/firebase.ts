// src/lib/firebase.ts
import { initializeApp, getApp, FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

// Firebase config using environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBNCXIOAX2HUdeLvUxkTJh7DVbv8JU485s",
  authDomain: import.meta.env.VITE_FIREBASE_PROJECT_ID
    ? `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`
    : "goalgrid-c5e9c.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "goalgrid-c5e9c",
  storageBucket: import.meta.env.VITE_FIREBASE_PROJECT_ID
    ? `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`
    : "goalgrid-c5e9c.firebasestorage.app",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:544004357501:web:4b81a3686422b28534e014",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-BJQMLK9JJ1",
};

// Initialize Firebase
let app: FirebaseApp;
try {
  app = initializeApp(firebaseConfig);
} catch (error: any) {
  if (error.code === "app/duplicate-app") {
    app = getApp();
  } else {
    throw error;
  }
}

// Auth and Firestore instances
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);

// Google auth provider
const provider = new GoogleAuthProvider();

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

// Sign out
export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

