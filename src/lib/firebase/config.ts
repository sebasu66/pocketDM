
// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

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

// Initialize Firebase
let app;
if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApp();
}

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };
