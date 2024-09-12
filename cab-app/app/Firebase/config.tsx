import { initializeApp } from "firebase/app";
import { collection, addDoc, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB1IT9QWZu8mlW5XBleFWH6IhTjrsXbyL0",
  authDomain: "cab-app-bc3cd.firebaseapp.com",
  projectId: "cab-app-bc3cd",
  storageBucket: "cab-app-bc3cd.appspot.com",
  messagingSenderId: "182752419478",
  appId: "1:182752419478:web:d376a44b78b87ac49becb7",
  measurementId: "G-0631EWH943",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {db}