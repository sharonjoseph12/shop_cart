import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  projectId: "shipcart-2026",
  appId: "1:1073909769907:web:73ccc703d502eab5fdb2c6",
  storageBucket: "shipcart-2026.firebasestorage.app",
  apiKey: "AIzaSyB1DlECRY45mTmQHZ25lHstlDiUURaMbUs",
  authDomain: "shipcart-2026.firebaseapp.com",
  messagingSenderId: "1073909769907"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
