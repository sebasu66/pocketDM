// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getFirestore, initializeFirestore, connectFirestoreEmulator, type Firestore } from "firebase/firestore";
import { getAuth, connectAuthEmulator, type Auth } from "firebase/auth";

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

// Connect to Firebase Emulators in development mode
// Set NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true in .env.local to enable
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
  console.log('🔧 Connecting to Firebase Emulators...');

  // Connect Firestore Emulator
  try {
    connectFirestoreEmulator(db, '127.0.0.1', 8080);
    console.log('✅ Firestore Emulator connected (localhost:8080)');
  } catch (error) {
    console.warn('⚠️ Firestore Emulator already connected or failed:', error);
  }

  // Connect Auth Emulator
  try {
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
    console.log('✅ Auth Emulator connected (localhost:9099)');
  } catch (error) {
    console.warn('⚠️ Auth Emulator already connected or failed:', error);
  }

  console.log('🔧 Firebase Emulators UI available at: http://localhost:4000');
}

export { app, db, auth };
