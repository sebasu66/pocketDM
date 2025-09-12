
"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/code-block";
import { Button } from "@/components/ui/button";
import { Copy, Database, Workflow, ShieldAlert } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import { useI18n } from "@/context/i18n-context";

const getDbInstructions = (campaignId: string | undefined) => `
## Direct Database Integration Guide

This guide explains how an external AI agent or script can securely interact with your campaign data by connecting directly to the Firestore database.

### 1. Authentication: Service Account Key

To connect, your agent must use the Firebase Admin SDK with a **Service Account Key**. This key grants privileged access to your project's resources, bypassing normal user authentication.

**Action: Get Your Service Account Key**
1.  Go to the Google Cloud Console for your project.
2.  Navigate to **IAM & Admin > Service Accounts**.
3.  Select the **"Firebase Admin SDK Service Agent"** (or a service account with the "Editor" role).
4.  Go to the **Keys** tab, click **Add Key > Create new key**, and select **JSON**.
5.  A JSON file will be downloaded. Save it securely in your agent's directory as \`service-account-key.json\`.
6.  **Important**: This file is a secret. Do not commit it to version control.

### 2. Reading the World State

Before generating a new story beat, your agent needs to understand the current state of the world. This involves reading from several collections.

-   **\`characters\`**: To learn about the player characters.
    -   **Query**: Get all documents where \`campaignId\` matches your current campaign ID.
    -   **Fields of Interest**: \`name\`, \`description\`, \`class\`, \`level\`, and attribute scores (\`strength\`, \`dexterity\`, etc.). This tells your agent who is in the party and what they are capable of.

-   **\`narrativeThreads\`**: To get the GM's story posts.
    -   **Query**: Get all documents where \`campaignId\` matches, ordered by \`createdAt\` ascending. This gives you the chronological story.
    -   **Fields of Interest**: \`title\`, \`content\`.

-   **\`narrativeComments\`**: To get the players' responses to each thread.
    -   **Query**: For each narrative thread, get all comments where \`threadId\` matches that thread's ID, ordered by \`createdAt\` ascending.
    -   **Fields of Interest**: \`text\`, \`hiddenText\`, \`characterId\`. This shows how players have reacted to the story.

### 2.1. Understanding Character Behavior

The \`characters\` collection contains a **Behavior Profile** to help your agent understand a character's personality and likely actions in rich detail.

-   **\`archetype\`** (string): A high-level summary of the character's personality (e.g., "Braveheart", "Loot Goblin").
-   **\`archetypeDescription\`** (string): A brief explanation of the archetype.
-   **\`position\`** (number, 0-100): Where the character prefers to be in a fight. 0 = backline, 50 = mid-range, 100 = frontline.
-   **\`resolve\`** (number, 0-100): The character's courage. 0 = flees from danger, 100 = stands and fights to the end.
-   **\`altruism\`** (number, 0-100): How selfish the character is. 0 = prioritizes self/loot, 100 = prioritizes the group.
-   **\`discipline\`** (number, 0-100): How tactical the character is. 0 = reckless and impulsive, 100 = careful and disciplined.
-   **\`preferredAttack\`** (string): A short description of their go-to combat move (e.g., "Fireball", "Charge with axe").
-   **\`mostPrecious\`** (string): What the character values most (e.g., "My family's heirloom", "The approval of the king").
-   **\`motto\`** (string): A personal motto or battle cry (e.g., "For glory!", "Leave no stone unturned").
-   **\`conditionalRules\`** (array of objects): High-priority instructions for specific situations. Each object has the format \`{ if: string, then: string }\`. Example: \`[{ if: "character health < 10%", then: "use health potion" }]\`.

By reading these fields, your agent can make much more nuanced and in-character decisions for how a character acts and reacts to story events.

### 3. Writing to the Database: Continuing the Narrative

**This is the most important concept:** To continue the story, your agent must create a **new document** in the \`narrativeThreads\` collection. The application is designed to render these threads chronologically. Do NOT attempt to update an existing thread with new content.

**Action: Create a New Narrative Thread Document**
When your agent has decided on the next part of the story, it should create a new document in the \`narrativeThreads\` collection with the following structure:

-   **\`campaignId\`**: (string) The ID of the campaign (\`${campaignId || 'YOUR_CAMPAIGN_ID'}\`).
-   **\`authorId\`**: (string) The User ID of the Game Master (e.g., "1").
-   **\`title\`**: (string) A title for the new story post.
-   **\`content\`**: (string) The main narrative content. HTML is supported for formatting (e.g., \`<p>The story continues...</p>\`).
-   **\`createdAt\`**: (number) A Unix timestamp (e.g., \`Date.now()\`).
-   **\`imageUrl\`**: (string, optional) A URL for an image to display with the post.
-   **\`imageAiHint\`**: (string, optional) A hint for AI image generators (e.g., "fantasy market").

### 4. Frontend Updates

The application uses real-time listeners. When your agent successfully adds a new document to the \`narrativeThreads\` collection, the frontend will **automatically update** for all connected players. There is no need for manual refreshes.

### Example: Node.js Agent Script

Use this script as a template for your agent to post new narrative content.

\`\`\`javascript
const admin = require('firebase-admin');

// IMPORTANT: Path to your downloaded service account key file
const serviceAccount = require('./service-account-key.json');

// --- Configuration ---
const CAMPAIGN_ID = "${campaignId || 'YOUR_CAMPAIGN_ID'}";
// This should be the user ID for the Game Master. In this demo, it is '1'.
const GM_USER_ID = "1"; 
// --- End Configuration ---


// --- Narrative Content (Generated by your AI) ---
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
  imageUrl: "https://picsum.photos/800/400?random=" + Math.floor(Math.random() * 100),
  imageAiHint: "fantasy market alley"
};
// --- End Narrative Content ---


// --- Script Logic (Do not modify below this line) ---
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} catch (error) {
  if (error.code !== 'app/duplicate-app') {
    console.error('Firebase initialization error:', error);
    process.exit(1);
  }
}

const db = admin.firestore();

async function addNarrativeThread(threadData) {
  try {
    const docRef = await db.collection('narrativeThreads').add(threadData);
    console.log("Successfully created narrative thread with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding narrative thread:", error);
    throw error;
  }
}

addNarrativeThread(newThread)
  .then(() => {
    console.log("Script finished successfully.");
    process.exit(0);
  })
  .catch(() => {
    console.error("Script finished with errors.");
    process.exit(1);
  });
\`\`\`
`.trim();


export default function IntegrationsPage() {
    const { toast } = useToast();
    const { campaign, user, isLoading } = useAuth();
    const router = useRouter();
    const { t } = useI18n();
    
    React.useEffect(() => {
      if (!isLoading && user?.role !== 'master') {
        toast({
          variant: 'destructive',
          title: t('charactersAccessDenied'),
          description: t('charactersMustBeGM'),
        });
        router.push('/dashboard');
      }
    }, [user, isLoading, router, toast, t]);

    if (isLoading || user?.role !== 'master') {
      return (
        <Card>
          <CardHeader>
            <CardTitle>{t('charactersAccessDenied')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{t('charactersMustBeGM')}</p>
          </CardContent>
        </Card>
      );
    }
    
    const rawDbInstructions = getDbInstructions(campaign?.id);
    const exampleScriptStartIndex = rawDbInstructions.indexOf('```javascript');
    const dbInstructions = exampleScriptStartIndex > -1 ? rawDbInstructions.substring(0, exampleScriptStartIndex) : rawDbInstructions;
    const exampleScript = exampleScriptStartIndex > -1 ? rawDbInstructions.substring(exampleScriptStartIndex).replace(/```javascript|```/g, '') : '';

    const handleCopy = (content: string) => {
        navigator.clipboard.writeText(content);
        toast({
            title: t('dashboardCopied'),
        });
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Workflow className="w-6 h-6"/>
                        <CardTitle className="font-headline text-2xl">{t('integrationsTitle')}</CardTitle>
                    </div>
                    <CardDescription>
                       {t('integrationsDescription')}
                    </CardDescription>
                </CardHeader>
            </Card>

            <Alert variant="destructive">
                <ShieldAlert className="h-4 w-4" />
                <AlertTitle>{t('integrationsGMsOnly')}</AlertTitle>
                <AlertDescription>
                    {t('integrationsGMsOnlyDesc')}
                </AlertDescription>
            </Alert>
            
            <Alert>
                <Database className="h-4 w-4" />
                <AlertTitle>{t('integrationsHowTo')}</AlertTitle>
                <AlertDescription>
                 <div className="prose prose-sm prose-invert max-w-none text-foreground/80 mt-4" dangerouslySetInnerHTML={{ __html: dbInstructions.replace(/##(.*?)\n/g, '<h3>$1</h3>').replace(/###(.*?)\n/g, '<h4>$1</h4>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/`([^`]+)`/g, '<code>$1</code>') }}/>
                </AlertDescription>
            </Alert>
            
            {exampleScript && (
                 <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">{t('integrationsExampleScript')}</CardTitle>
                        <CardDescription>{t('integrationsExampleScriptDesc')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CodeBlock content={exampleScript} lang="javascript" />
                        <Button onClick={() => handleCopy(exampleScript)} className="mt-4">
                            <Copy className="mr-2" />
                            {t('integrationsCopyScript')}
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

    