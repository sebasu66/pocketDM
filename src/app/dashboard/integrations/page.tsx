
"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/code-block";
import { Button } from "@/components/ui/button";
import { Copy, Database, Workflow } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/context/auth-context";

const getDbInstructions = (campaignId: string | undefined) => `
### How to Post New Narrative Content

To have your external agent act as the Game Master, it should connect directly to your Firestore database using the **Firebase Admin SDK** and a secure **Service Account Key**. This gives it the necessary permissions to write new story content.

The application's narrative is designed as a chronological list of posts. **Each new Game Master post is a new, separate document in the \`narrativeThreads\` collection.** This is the correct and only way to continue the story. The frontend is built to listen for new documents in this collection and will update in real-time.

**Step 1: Get Your Service Account Key**
1. Go to your Google Cloud Console IAM page for service accounts.
2. Select your Firebase project.
3. Find the "Firebase Admin SDK Service Agent" (or create a new service account with the "Editor" role).
4. Click on the service account, go to the "Keys" tab, and create a new JSON key.
5. Download this key and save it securely as \`service-account-key.json\` in your agent's directory. **DO NOT commit this file to version control.**

**Step 2: Use the Script to Create a New Narrative Thread**
The script below shows how to add a new document to the \`narrativeThreads\` collection. Each time you run it, it creates a new post in the story. You can adapt this script for your AI agent.

**Example Node.js Script (\`post-narrative.js\`):**
\`\`\`javascript
const admin = require('firebase-admin');

// IMPORTANT: Path to your downloaded service account key file
const serviceAccount = require('./service-account-key.json');

// --- Configuration ---
const CAMPAIGN_ID = "${campaignId || 'YOUR_CAMPAIGN_ID'}";
const GM_USER_ID = "1"; // The user ID for the Game Master
// --- End Configuration ---

// --- Narrative Content ---
const newThread = {
  campaignId: CAMPAIGN_ID,
  authorId: GM_USER_ID,
  title: "The Whispering Cave",
  createdAt: Date.now(),
  content: \`
    <p>A chill wind escapes the mouth of the dark cave. Your torch flickers, casting long, dancing shadows on the damp rock walls. A low growl echoes from deep within.</p>
    <p>What do you do?</p>
  \`,
  imageUrl: "https://picsum.photos/800/400?random=" + Math.floor(Math.random() * 100),
  imageAiHint: "dark cave entrance fantasy"
};
// --- End Narrative Content ---

// --- Script Logic ---
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

async function addNarrativeThread(threadData) {
  try {
    const docRef = await db.collection('narrativeThreads').add(threadData);
    console.log("Successfully created narrative thread with ID:", docRef.id);
  } catch (error) {
    console.error("Error adding narrative thread:", error);
  }
}

addNarrativeThread(newThread).then(() => process.exit(0));
\`\`\`
`.trim();


export default function IntegrationsPage() {
    const { toast } = useToast();
    const { campaign } = useAuth();
    
    const dbInstructions = getDbInstructions(campaign?.id);

    const handleCopy = (content: string) => {
        navigator.clipboard.writeText(content);
        toast({
            title: "Copied to Clipboard!",
        });
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 text-white/90">
            <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2"><Workflow />Agent Integration</CardTitle>
                    <CardDescription>
                       Use this guide to connect an external AI agent or tool to your campaign. Your agent can read and write game data by connecting directly to the database.
                    </CardDescription>
                </CardHeader>
            </Card>

            <Alert>
                <Database className="h-4 w-4" />
                <AlertTitle>How to Read & Write Game Data</AlertTitle>
                <AlertDescription>
                  Your agent should read and write game data by connecting directly to your Firestore database using the Firebase Admin SDK. This is the secure and correct way to interact with the world. The frontend will update in real-time when new data is added.
                </AlertDescription>
                 <CardContent className="pt-4">
                    <CodeBlock content={dbInstructions} lang="markdown" />
                    <Button onClick={() => handleCopy(dbInstructions)} className="mt-4">
                        <Copy className="mr-2" />
                        Copy Instructions
                    </Button>
                </CardContent>
            </Alert>
        </div>
    );
}

    