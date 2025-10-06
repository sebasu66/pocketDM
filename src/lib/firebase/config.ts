// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getFirestore, initializeFirestore, type Firestore } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAa6pJKmrxl65X-DeCrUclDdlLvZSGk32g",
  authDomain: "lore-weaver-rt9pc.firebaseapp.com",
  projectId: "lore-weaver-rt9pc",
  storageBucket: "lore-weaver-rt9pc.firebasestorage.app",
  messagingSenderId: "9043819570",
  appId: "1:9043819570:web:d20e4928ab338405d2d02b",
  measurementId: "G-KRHEWVBV1G"
};

// Initialize Firebase
const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with long polling to prevent timeout issues
const db: Firestore = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

const auth: Auth = getAuth(app);

export { app, db, auth };
