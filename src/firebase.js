// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBNCXIOAX2HUdeLvUxkTJh7DVbv8JU485s",
  authDomain: "goalgrid-c5e9c.firebaseapp.com",
  projectId: "goalgrid-c5e9c",
  storageBucket: "goalgrid-c5e9c.firebasestorage.app",
  messagingSenderId: "544004357501",
  appId: "1:544004357501:web:4b81a3686422b28534e014",
  measurementId: "G-BJQMLK9JJ1",
};

const app = initializeApp(firebaseConfig);

// Firestore
export const db = getFirestore(app);

// Auth
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user; // user info: displayName, email, photoURL, uid
  } catch (err) {
    console.error("Google Sign-In Error:", err);
    return null;
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (err) {
    console.error("Logout Error:", err);
  }
};
