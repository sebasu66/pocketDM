
// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";
import { getStorage, FirebaseStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAa6pJKmrxl65X-DeCrUclDdlLvZSGk32g",
  authDomain: "lore-weaver-rt9pc.firebaseapp.com",
  projectId: "lore-weaver-rt9pc",
  storageBucket: "lore-weaver-rt9pc.appspot.com",
  messagingSenderId: "9043819570",
  appId: "1:9043819570:web:d20e4928ab338405d2d02b"
};

// Initialize Firebase for SSR
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };
