// src/firebase.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAggHqhiMpCpFBgP58hcw4GKYSwY4QmAd0",
  authDomain: "vapour-fc8ad.firebaseapp.com",
  projectId: "vapour-fc8ad",
  storageBucket: "vapour-fc8ad.firebasestorage.app",
  messagingSenderId: "1009334565582",
  appId: "1:1009334565582:web:5031c0e15001dc5dcaee9f"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

// Auto anonymous login
signInAnonymously(auth)
  .then(() => {
    console.log("Anonymous user signed in");
  })
  .catch((error) => {
    console.error("Auth error:", error);
  });