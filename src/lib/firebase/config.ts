// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
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
