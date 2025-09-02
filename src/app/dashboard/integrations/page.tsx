
"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/code-block";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

const nodeScriptContent = `
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
  content: \`
    <p>
      As the afternoon sun cast long shadows across the bustling Silverwood market, a cloaked figure was seen slipping into the alley behind the 'Gilded Griffin' tavern. 
      Moments later, a faint cry was heard, abruptly silenced. The usual market chatter seems to mask the incident, and only the most observant of your party might have noticed.
    </p>
    <p>
      What do you do?
    </p>
  \`,
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
    // databaseURL: \`https://\${serviceAccount.project_id}.firebaseio.com\`
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
    console.log(\`Adding new narrative thread to campaign \${threadData.campaignId}...\`);
    const docRef = await db.collection('narrativeThreads').add(threadData);
    console.log(\`Successfully created narrative thread with ID: \${docRef.id}\`);
    return docRef.id;
  } catch (error) {
    console.error("Error adding narrative thread:", error);
    throw error;
  }
}

addNarrativeThread(newThread)
  .then(() => {
    console.log("\\nScript finished successfully.");
    process.exit(0);
  })
  .catch(() => {
    console.error("\\nScript finished with errors.");
    process.exit(1);
  });
`.trim();

export default function IntegrationsPage() {
    const { toast } = useToast();

    const handleCopy = () => {
        navigator.clipboard.writeText(nodeScriptContent);
        toast({
            title: "Script Copied!",
            description: "The Node.js script is ready to be pasted into a file.",
        });
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 text-white/90">
            <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="font-headline">External Integrations</CardTitle>
                    <CardDescription>
                        Use the Firebase Admin SDK to securely manage your campaign data from a local script or backend service.
                    </CardDescription>
                </CardHeader>
            </Card>

             <Alert>
                <Terminal className="h-4 w-4" />
                <AlertTitle>The Correct Approach</AlertTitle>
                <AlertDescription>
                    The most secure and powerful way to interact with your database from an external tool (like a local AI script) is to connect directly to Firebase using the official Admin SDK, not through a web API. This guide shows you how.
                </AlertDescription>
            </Alert>

            <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle>Step 1: Get Your Service Account Key</CardTitle>
                    <CardDescription>A service account is a special identity for applications to authenticate securely to your Firebase project. You only need to do this once.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ol className="list-decimal list-inside space-y-2 text-white/80">
                        <li>
                            Open the Google Cloud IAM page for service accounts. 
                            <Link 
                                href="https://console.cloud.google.com/iam-admin/serviceaccounts?project=lore-weaver-2kklj" 
                                target="_blank"
                                className="text-accent underline ml-1"
                            >
                                Click this link to go there directly.
                            </Link>
                        </li>
                        <li>Find the service account with "App Engine default service account" in the name.</li>
                        <li>Click the three-dot menu (⋮) on the far right of that row and select **"Manage keys"**.</li>
                        <li>Click **"Add Key"** -&gt; **"Create new key"**.</li>
                        <li>Choose **"JSON"** as the key type and click **"Create"**.</li>
                        <li>A `.json` file will be downloaded to your computer. Rename this file to `service-account-key.json`.</li>
                        <li className="font-bold text-destructive-foreground/80">Important: Keep this file secure and do not share it or commit it to version control.</li>
                    </ol>
                </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle>Step 2: Use the Node.js Script</CardTitle>
                    <CardDescription>Save the script below as a `.js` file (e.g., `seed-narrative.js`) on your computer. Place it in the same directory where you saved your `service-account-key.json` file.</CardDescription>
                </CardHeader>
                <CardContent>
                    <CodeBlock content={nodeScriptContent} lang="javascript" />
                    <Button onClick={handleCopy} className="mt-4">
                        <Copy className="mr-2" />
                        Copy Script
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
