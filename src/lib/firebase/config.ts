
// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { initializeFirestore, getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  "projectId": "lore-weaver-2kklj",
  "appId": "1:66807357862:web:1aff4a072775f146c5ef67",
  "storageBucket": "lore-weaver-2kklj.appspot.com",
  "apiKey": "AIzaSyBUDGb6l7n1DIb3gR5ppQSjdBFSa9PxYt0",
  "authDomain": "lore-weaver-2kklj.firebaseapp.com",
  "messagingSenderId": "66807357862"
};

// Initialize Firebase
let app;
if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApp();
}

const db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
    experimentalLongPollingOptions: {
      timeoutSeconds: 30
    }
});
const auth = getAuth(app);

export { app, db, auth };
