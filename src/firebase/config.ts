import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB-vrWdQrDjuyFtdmBbwpf4RRAzlb4HhHs",
  authDomain: "obase-sam-app.firebaseapp.com",
  projectId: "obase-sam-app",
  storageBucket: "obase-sam-app.firebasestorage.app",
  messagingSenderId: "866773646963",
  appId: "1:866773646963:web:311bd4590e08622b0ef406"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);