import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDeWFFsOQ5EBms6p4g-E7Pl7_KR1vzX--k",
  authDomain: "resume-app-15b91.firebaseapp.com",
  projectId: "resume-app-15b91",
  storageBucket: "resume-app-15b91.appspot.com",
  messagingSenderId: "718167700699",
  appId: "1:718167700699:web:cae353203ba5f0651988fe",
  measurementId: "G-J77Y9JSRE2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app)



export { app, auth, db };
