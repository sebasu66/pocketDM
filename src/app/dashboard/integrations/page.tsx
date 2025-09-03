
"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/code-block";
import { Button } from "@/components/ui/button";
import { Copy, Link as LinkIcon, Database, Terminal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/context/auth-context";
import { Separator } from "@/components/ui/separator";

const getApiInstructions = (origin: string, campaignId: string | undefined) => `
### Step 1: Read the Game State (via API)

First, you need to understand what's happening in the story and who the characters are. Fetch the data from these two API endpoints.

**A) Get All Characters in the Campaign:**
This gives you a list of all characters, their descriptions, and stats.

\`\`\`bash
# Replace CAMPAIGN_ID with your actual Campaign ID.
curl "${origin}/api/characters?campaignId=${campaignId || 'YOUR_CAMPAIGN_ID'}"
\`\`\`

**B) Get the Full Narrative History:**
This returns all previous posts from the Game Master and all player responses, in chronological order.

\`\`\`bash
# Replace CAMPAIGN_ID with your actual Campaign ID.
curl "${origin}/api/narrative/${campaignId || 'YOUR_CAMPAIGN_ID'}"
\`\`\`
`.trim();

const getDbInstructions = (campaignId: string | undefined) => `
### Step 2: Post Your Content (via Direct Database Access)

To post a new narrative thread, your agent should connect directly to your Firestore database using the **Firebase Admin SDK** and a secure **Service Account Key**. This gives it the necessary permissions to write data.

**A) Get Your Service Account Key:**
1. Go to your Google Cloud Console IAM page for service accounts.
2. Select your Firebase project.
3. Find the "Firebase Admin SDK Service Agent" (or create a new service account with the "Editor" role).
4. Click on the service account, go to the "Keys" tab, and create a new JSON key.
5. Download this key and save it securely as \`service-account-key.json\` in your agent's directory. **DO NOT commit this file to version control.**

**B) Use the Script to Create a New Narrative Thread:**
The script below shows how to add a new document to the \`narrativeThreads\` collection. Each time you run it, it creates a new post in the story.

This is the correct way to continue the story. The application is designed to read all documents from this collection in chronological order to build the narrative.

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
    const [origin, setOrigin] = React.useState("");

    React.useEffect(() => {
        if (typeof window !== "undefined") {
            setOrigin(window.location.origin);
        }
    }, []);

    const apiInstructions = getApiInstructions(origin, campaign?.id);
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
                    <CardTitle className="font-headline">API & Agent Integration</CardTitle>
                    <CardDescription>
                       Use this guide to connect an external AI agent or tool to your campaign. Your agent can read game data via a read-only API and write new content by connecting directly to the database.
                    </CardDescription>
                </CardHeader>
            </Card>

             <Alert>
                <LinkIcon className="h-4 w-4" />
                <AlertTitle>How to Read Game Data</AlertTitle>
                <AlertDescription>
                   Use the following read-only API endpoints to get the current state of the campaign, including characters and the full story history. This data is returned in JSON format, perfect for an AI to process.
                </AlertDescription>
                 <CardContent className="pt-4">
                    <CodeBlock content={apiInstructions} lang="markdown" />
                    <Button onClick={() => handleCopy(apiInstructions)} className="mt-4">
                        <Copy className="mr-2" />
                        Copy Read Instructions
                    </Button>
                </CardContent>
            </Alert>
            
            <Separator />
            
             <Alert>
                <Database className="h-4 w-4" />
                <AlertTitle>How to Write New Content</AlertTitle>
                <AlertDescription>
                  Your agent should write new Game Master posts by connecting directly to your Firestore database using the Firebase Admin SDK. This is the secure and correct way to extend the narrative. **Each new post is a new document in the `narrativeThreads` collection.**
                </AlertDescription>
                 <CardContent className="pt-4">
                    <CodeBlock content={dbInstructions} lang="markdown" />
                    <Button onClick={() => handleCopy(dbInstructions)} className="mt-4">
                        <Copy className="mr-2" />
                        Copy Write Instructions
                    </Button>
                </CardContent>
            </Alert>
        </div>
    );
}
