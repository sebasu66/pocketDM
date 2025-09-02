
"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/code-block";
import { Button } from "@/components/ui/button";
import { Copy, Link as LinkIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/context/auth-context";

const getInstructions = (origin: string, campaignId: string | undefined) => `
You are an AI assistant tasked with acting as a Game Master for a storytelling game. Your goal is to read the current state of the game and then generate a new narrative post.

---

### Step 1: Read the Game State

First, you need to understand what's happening in the story and who the characters are. Fetch the data from these two API endpoints. You MUST include the 'X-API-Key' header with the secret key provided.

**The Secret API Key:**
a-super-secret-key-for-lore-weaver

**A) Get All Characters in the Campaign:**
This gives you a list of all characters, their descriptions, and stats.

\`\`\`bash
# Replace CAMPAIGN_ID with the actual ID.
curl -H "X-API-Key: a-super-secret-key-for-lore-weaver" \\
  "${origin}/api/characters?campaignId=${campaignId || 'YOUR_CAMPAIGN_ID'}"
\`\`\`

**B) Get the Full Narrative History:**
This returns all previous posts from the Game Master and all player responses, in chronological order.

\`\`\`bash
# Replace CAMPAIGN_ID with the actual ID.
curl -H "X-API-Key: a-super-secret-key-for-lore-weaver" \\
  "${origin}/api/narrative/${campaignId || 'YOUR_CAMPAIGN_ID'}"
\`\`\`

---

### Step 2: Write the Next Post

After analyzing the story and characters, decide what happens next. Generate a compelling new story post. The post should be in HTML format.

Example Post Content:
\`\`\`html
<p>The old tome's pages crumble under your touch, revealing a map scorched into the leather backing. It points to a location known only as the 'Whispering Peaks,' a place rumored to be guarded by ancient spirits.</p><p>A chilling wind suddenly gusts through the library, snuff out all the candles. What do you do?</p>
\`\`\`

---

### Step 3: Post Your Content to the Game

Once you have your new title and HTML content, you must construct a special URL to post it to the game.

**Base URL:**
\`\`\`
${origin}/dashboard/quick-post
\`\`\`

**Query Parameters:**
- \`title\`: (Required) The title of your post.
- \`content\`: (Required) The HTML content of your post.
- \`autoSubmit\`: (Required) Set this to "true".

**Example URL Construction (JavaScript):**
\`\`\`javascript
const title = "The Map is Revealed";
const content = "<p>The old tome's pages crumble...</p>";
const baseUrl = "${origin}/dashboard/quick-post";

const params = new URLSearchParams({
  title,
  content,
  autoSubmit: "true"
});

const finalUrl = \`\${baseUrl}?\${params.toString()}\`;

// Instruct the user to open 'finalUrl' in their browser.
// When they open it, your post will be automatically submitted to the game.
console.log(finalUrl);
\`\`\`

By following these three steps, you can read the game state, generate new content, and seamlessly post it to the narrative.
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

    const instructionsForAI = getInstructions(origin, campaign?.id);

    const handleCopy = () => {
        navigator.clipboard.writeText(instructionsForAI);
        toast({
            title: "Instructions Copied!",
            description: "The complete instructions for your AI are on your clipboard.",
        });
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 text-white/90">
            <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="font-headline">AI Agent & API Integration</CardTitle>
                    <CardDescription>
                       Use this guide to connect an external AI agent or tool to your campaign. The agent can read the game state via API and post new content using a special URL.
                    </CardDescription>
                </CardHeader>
            </Card>

             <Alert>
                <LinkIcon className="h-4 w-4" />
                <AlertTitle>Instructions for Your AI Agent</AlertTitle>
                <AlertDescription>
                   Copy the complete text below and provide it to your AI agent. It contains all the necessary steps and URLs for it to read data and post new narrative threads.
                </AlertDescription>
                 <CardContent className="pt-4">
                    <CodeBlock content={instructionsForAI} lang="markdown" />
                    <Button onClick={handleCopy} className="mt-4">
                        <Copy className="mr-2" />
                        Copy Instructions for AI
                    </Button>
                </CardContent>
            </Alert>
        </div>
    );
}
