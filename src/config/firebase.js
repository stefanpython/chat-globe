import { initializeApp } from "firebase/app";
// Import getAuth for all types login and GoogleAuthProvider for login with gmail
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBcMy5qIpuIeNLPmWpXv6Nbak3-mVLwhzo",
  authDomain: "chatglobe-ac09d.firebaseapp.com",
  projectId: "chatglobe-ac09d",
  storageBucket: "chatglobe-ac09d.appspot.com",
  messagingSenderId: "1013698568654",
  appId: "1:1013698568654:web:ca205075b750b75215cb9f",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// Create variable and assign it with GoogleAuthProvider() for gmail login
export const googleProvider = new GoogleAuthProvider();