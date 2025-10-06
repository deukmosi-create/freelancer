// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyABa6PoZXOay0P9fQPbjBJ5SQfWW5h3S64",
  authDomain: "freelancerke-b3745.firebaseapp.com",
  projectId: "freelancerke-b3745",
  storageBucket: "freelancerke-b3745.firebasestorage.app",
  messagingSenderId: "695061406543",
  appId: "1:695061406543:web:b87aad8d82da46df4b5b3a"
};

const app = initializeApp(firebaseConfig);

// Initialize Auth and providers
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export { auth, googleProvider, facebookProvider };