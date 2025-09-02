
// FILE: seed-narrative.js
//
// This script allows you to post a new narrative thread to your campaign from your local machine.
//
// To run this script:
// 1. Make sure you have Node.js installed on your computer.
// 2. Save your Firebase service account key as 'service-account-key.json' in the same directory as this script.
// 3. From your terminal, run: npm install firebase-admin
// 4. Then, run the script: node seed-narrative.js

const admin = require('firebase-admin');

// IMPORTANT: Path to your service account key file
const serviceAccount = require('./service-account-key.json');

// --- Configuration ---
// Paste your Campaign ID here
const CAMPAIGN_ID = '1'; 
// The user ID for the Game Master (typically '1' in this demo)
const GM_USER_ID = '1'; 
// --- End Configuration ---


// --- Narrative Content ---
const newThread = {
  campaignId: CAMPAIGN_ID,
  authorId: GM_USER_ID,
  title: "A Shadow in the Market",
  createdAt: Date.now(),
  content: `
    <p>
      As the afternoon sun cast long shadows across the bustling Silverwood market, a cloaked figure was seen slipping into the alley behind the 'Gilded Griffin' tavern. 
      Moments later, a faint cry was heard, abruptly silenced. The usual market chatter seems to mask the incident, and only the most observant of your party might have noticed.
    </p>
    <p>
      What do you do?
    </p>
  `,
  imageUrl: "https://picsum.photos/800/400?random=56",
  imageAiHint: "fantasy market alley"
};
// --- End Narrative Content ---


// --- Script Logic (Do not modify below this line) ---
console.log("Initializing Firebase Admin SDK...");
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // You don't need the databaseURL for Firestore, but if you were using Realtime Database:
    // databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
  });
} catch (error) {
  if (error.code === 'app/duplicate-app') {
    console.log('Firebase Admin SDK already initialized.');
  } else {
    console.error('Error initializing Firebase Admin SDK:', error);
    process.exit(1);
  }
}

const db = admin.firestore();

async function addNarrativeThread(threadData) {
  try {
    console.log(`Adding new narrative thread to campaign ${threadData.campaignId}...`);
    const docRef = await db.collection('narrativeThreads').add(threadData);
    console.log(`Successfully created narrative thread with ID: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error("Error adding narrative thread:", error);
    throw error;
  }
}

addNarrativeThread(newThread)
  .then(() => {
    console.log("\nScript finished successfully.");
    process.exit(0);
  })
  .catch(() => {
    console.error("\nScript finished with errors.");
    process.exit(1);
  });
