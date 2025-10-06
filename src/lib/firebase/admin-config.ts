
import { initializeApp, getApps, App, cert } from 'firebase-admin/app';

// IMPORTANT: Do not use this in client-side code.
// This configuration is for server-side (Genkit flows, API routes) use only.

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : undefined;

let admin: App;

if (getApps().length === 0) {
  if (!serviceAccount) {
    console.warn(
      '[Firebase Admin] Service account not found. Using default application credentials.'
    );
    admin = initializeApp();
  } else {
    admin = initializeApp({
      credential: cert(serviceAccount),
    });
  }
} else {
  admin = getApps()[0];
}

export { admin };
