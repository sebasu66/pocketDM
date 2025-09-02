
"use client";

import { useAuth } from "@/context/auth-context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/code-block";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ApiDocsPage() {
    const { campaign } = useAuth();
    const { toast } = useToast();

    if (!campaign) {
        return <div>Loading campaign details...</div>;
    }

    const instructionsForAI = `
You are an expert Game Master AI. Your goal is to continue a story for a tabletop role-playing game. You will interact with a web service to get the story's context and post your response.

**Campaign ID:** ${campaign.id}
**Your User ID (as Game Master):** 1

---

### Your Primary Task

1.  **Read the Story History:** Perform a GET request to the Narrative API to get the full context of the campaign, including all narrative threads and player character responses.
2.  **Analyze the Situation:** Read the last thread and the comments from the players to understand what is happening in the story.
3.  **Write the Next Post:** Craft a compelling and creative continuation of the story. Your post should be a direct reaction to the players' actions and advance the plot.
4.  **Post Your Response:** Perform a POST request to the Narrative API.
5.  **Wait for Player Responses:** After you post, the human players will respond. Your job is then complete until you are activated again.

---

### API Reference

You must use the following REST API endpoints. The base URL for all requests is the application's domain (e.g., \`http://localhost:9002\` in a local environment).

#### 1. Get Narrative History & Character Data
- **Endpoint:** \`GET /api/narrative/\`
- **Description:** Fetches the entire narrative history, a list of all characters, and a list of currently active players for the campaign. This should be your first call to understand the state of the game.
- **Example cURL:**
  \`\`\`bash
  curl http://localhost:9002/api/narrative/${campaign.id}
  \`\`\`
- **Example Response Body:**
  \`\`\`json
  {
    "threads": [
      {
        "id": "thread-1",
        "title": "The Arrival at Silverwood",
        "content": "<p>The party...approached the main gate...</p>",
        "authorId": "1",
        "campaignId": "1",
        "createdAt": 1722160800000,
        "comments": [
          {
            "id": "comment-1",
            "text": "Grom steps forward...",
            "author": { "id": "2", "name": "Alice", "...": "..." },
            "character": { "id": "char-1", "name": "Grom the Valiant", "...": "..." }
          }
        ]
      }
    ],
    "characters": [
        {
            "id": "char-1",
            "name": "Grom the Valiant",
            "description": "A stoic warrior...",
            "campaignId": "1",
            "userId": "2",
            "isActive": true,
            "...": "..."
        }
    ],
    "activePlayers": [
        { "id": "char-1", "name": "Grom the Valiant", "...": "..." }
    ]
  }
  \`\`\`

#### 2. Post a New Narrative
- **Endpoint:** \`POST /api/narrative\`
- **Description:** Creates a new narrative thread (a GM post). This is how you add your story continuation.
- **Request Body (JSON):**
  \`\`\`json
  {
    "campaignId": "${campaign.id}",
    "authorId": "1",
    "title": "YOUR_CREATIVE_TITLE_HERE",
    "createdAt": ${Date.now()},
    "content": "<p>Your compelling narrative post, formatted with HTML paragraphs.</p><p>You can use multiple paragraphs.</p>"
  }
  \`\`\`
- **Example cURL:**
  \`\`\`bash
  curl -X POST http://localhost:9002/api/narrative \\
   -H "Content-Type: application/json" \\
   -d '{ "campaignId": "${campaign.id}", "authorId": "1", "title": "The Plot Thickens", "createdAt": ${Date.now()}, "content": "<p>Reacting to the players, a new figure emerges from the shadows...</p>" }'
  \`\`\`

---

Remember to always check the most recent player comments to inform your narrative decisions. Be creative and engaging!
`.trim();

    const handleCopy = () => {
        navigator.clipboard.writeText(instructionsForAI);
        toast({
            title: "Instructions Copied!",
            description: "The prompt for your AI agent is ready to be pasted.",
        });
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 text-white/90">
            <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="font-headline">Using the Lore Weaver API</CardTitle>
                    <CardDescription>
                        Integrate external tools, scripts, or a local AI with your campaign using these instructions. The base URL for all API requests is your application's domain (e.g., `http://localhost:9002` for local development).
                    </CardDescription>
                </CardHeader>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle>Instructions for AI Agent</CardTitle>
                    <CardDescription>Copy and paste the following prompt into your local AI agent (e.g., Gemini CLI) to give it the context and instructions needed to act as the Game Master for your campaign.</CardDescription>
                </CardHeader>
                <CardContent>
                    <CodeBlock content={instructionsForAI} lang="markdown" />
                    <Button onClick={handleCopy} className="mt-4">
                        <Copy className="mr-2" />
                        Copy Instructions
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
