import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCjixRcJ4HzvGEXAcrB4ZehNJkh0n9xwZQ",
  authDomain: "letterlify.firebaseapp.com",
  projectId: "letterlify",
  storageBucket: "letterlify.firebasestorage.app",
  messagingSenderId: "410003478668",
  appId: "1:410003478668:web:be308e080c4d84ec7ac3a9",
  measurementId: "G-2VW35TZMM2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { auth, db, analytics }; 