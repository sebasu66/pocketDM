
"use client";

import { useAuth } from "@/context/auth-context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/code-block";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const getNarrativeResponse = `{
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
          "author": { "id": "2", "name": "Alice", ... },
          "character": { "id": "char-1", "name": "Grom the Valiant", ... }
        },
      ]
    }
  ],
  "characters": [...],
  "activePlayers": [...]
}`;

const postNarrativeBody = `{
  "campaignId": "YOUR_CAMPAIGN_ID",
  "authorId": "1", // Must be the GM's user ID
  "title": "A Shadow in the Market",
  "createdAt": 1722165000000,
  "content": "<p>A scream pierces the bustling market square...</p>"
}`;

const getCharactersResponse = `[
    {
        "id": "char-1",
        "name": "Grom the Valiant",
        "description": "A stoic warrior...",
        "campaignId": "1",
        "userId": "2",
        "isActive": true,
        ...
    }
]`;

const postCommentBody = `{
  "threadId": "THE_ID_OF_THE_LAST_NARRATIVE_THREAD",
  "authorId": "THE_PLAYER_USER_ID",
  "characterId": "THE_PLAYER_CHARACTER_ID",
  "text": "The character's response or action.",
  "hiddenText": "Optional: Private thoughts for the GM.",
  "createdAt": 1722166000000
}`;


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

**Your Task:**
1.  **Read the Story History:** Perform a GET request to \`/api/narrative/${campaign.id}\` to get the full context of the campaign, including all narrative threads and player character responses.
2.  **Analyze the Situation:** Read the last thread and the comments from the players to understand the current situation.
3.  **Write the Next Post:** Craft a compelling and creative continuation of the story. Your post should be a direct reaction to the players' actions.
4.  **Post Your Response:** Perform a POST request to \`/api/narrative\`. The body of your request must be a JSON object with the following structure:
    \`\`\`json
    {
      "campaignId": "${campaign.id}",
      "authorId": "1",
      "title": "YOUR_CREATIVE_TITLE_HERE",
      "createdAt": ${Date.now()},
      "content": "<p>Your compelling narrative post, formatted with HTML paragraphs.</p><p>You can use multiple paragraphs.</p>"
    }
    \`\`\`
5.  **Wait for Player Responses:** After you post, the human players will respond. Your job is then complete until you are activated again.

**Example Workflow (using curl):**

1.  **Get History:**
    \`\`\`bash
    curl http://localhost:9002/api/narrative/${campaign.id}
    \`\`\`

2.  **Post New Narrative:**
    \`\`\`bash
    curl -X POST http://localhost:9002/api/narrative \\
     -H "Content-Type: application/json" \\
     -d '{ "campaignId": "${campaign.id}", "authorId": "1", "title": "The Plot Thickens", "createdAt": ${Date.now()}, "content": "<p>Reacting to the players, a new figure emerges from the shadows...</p>" }'
    \`\`\`
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
                    <CardDescription>Integrate external tools, scripts, or a local AI with your campaign using these REST API endpoints.</CardDescription>
                </CardHeader>
                 <CardContent>
                    <p>The base URL for all API requests is your application's domain. For local development, this is likely \`http://localhost:9002\`.</p>
                </CardContent>
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

            <div className="space-y-6">
                <h3 className="text-2xl font-headline">API Endpoints</h3>
                {/* GET Narrative */}
                <Card className="bg-card/80 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <span className="text-sm font-bold text-green-400 bg-green-900/50 px-2 py-1 rounded-md">GET</span> 
                           <span>/api/narrative/[campaignId]</span>
                        </CardTitle>
                        <CardDescription>Fetches the entire narrative history, characters, and active player list for a campaign.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <h4 className="font-bold mb-2">Example Response:</h4>
                        <CodeBlock content={getNarrativeResponse} lang="json" />
                    </CardContent>
                </Card>

                 {/* POST Narrative */}
                <Card className="bg-card/80 backdrop-blur-sm">
                    <CardHeader>
                         <CardTitle className="flex items-center gap-2">
                           <span className="text-sm font-bold text-blue-400 bg-blue-900/50 px-2 py-1 rounded-md">POST</span> 
                           <span>/api/narrative</span>
                        </CardTitle>
                        <CardDescription>Creates a new narrative thread (a GM post).</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <h4 className="font-bold mb-2">Request Body:</h4>
                        <CodeBlock content={postNarrativeBody} lang="json" />
                    </CardContent>
                </Card>
                
                 {/* POST Comment */}
                <Card className="bg-card/80 backdrop-blur-sm">
                    <CardHeader>
                         <CardTitle className="flex items-center gap-2">
                           <span className="text-sm font-bold text-blue-400 bg-blue-900/50 px-2 py-1 rounded-md">POST</span> 
                           <span>/api/comments</span>
                        </CardTitle>
                        <CardDescription>Creates a new player comment in response to a narrative thread.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <h4 className="font-bold mb-2">Request Body:</h4>
                        <CodeBlock content={postCommentBody} lang="json" />
                    </CardContent>
                </Card>
                
                 {/* GET Characters */}
                <Card className="bg-card/80 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <span className="text-sm font-bold text-green-400 bg-green-900/50 px-2 py-1 rounded-md">GET</span> 
                           <span>/api/characters</span>
                        </CardTitle>
                        <CardDescription>Fetches all characters for a given campaign ID via a query parameter.</CardDescription>
                    </CardHeader>
                     <CardContent>
                        <h4 className="font-bold mb-2">Usage:</h4>
                        <CodeBlock content={`/api/characters?campaignId=YOUR_CAMPAIGN_ID`} lang="bash" />
                        <h4 className="font-bold mt-4 mb-2">Example Response:</h4>
                        <CodeBlock content={getCharactersResponse} lang="json" />
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}

