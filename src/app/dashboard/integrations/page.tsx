
"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/code-block";
import { Button } from "@/components/ui/button";
import { Copy, Link as LinkIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

const simpleInstructions = `
The easiest way to integrate an external AI is to generate the content on your local machine (e.g., using Gemini) and then simply copy and paste it into the Lore Weaver application.

1. Generate your story content using your favorite local AI tool.
2. Go to the "Narrative" page in Lore Weaver.
3. Click the "Add Manually" button.
4. Paste the text from the AI into the form.
`.trim();

const urlInstructions = (origin: string) => `
You can programmatically create a new narrative post by constructing a special URL. When a user opens this URL, it will open a form that is pre-filled with the content you provide.

Base URL:
${origin}/dashboard/quick-post

Query Parameters:
- title: (Required) The title of the narrative post. Must be URL-encoded.
- content: (Required) The main content of the post (can include HTML). Must be URL-encoded.
- autoSubmit: (Optional) Set to "true" to have the form submit automatically upon loading.

Example (JavaScript):
---------------------
const title = "A New Threat Emerges";
const content = "<p>The ground trembles as a monstrous beast crests the nearby hill.</p>";
const baseUrl = "${origin}/dashboard/quick-post";
const params = new URLSearchParams({
  title,
  content,
  autoSubmit: "true"
});

const url = \`\${baseUrl}?\${params.toString()}\`;
// Now, open the 'url' in a web browser to post the content.
console.log(url);
`.trim();


export default function IntegrationsPage() {
    const { toast } = useToast();
    const [origin, setOrigin] = React.useState("");

    React.useEffect(() => {
        if (typeof window !== "undefined") {
            setOrigin(window.location.origin);
        }
    }, []);

    const handleCopy = (content: string) => {
        navigator.clipboard.writeText(content);
        toast({
            title: "Instructions Copied!",
            description: "The steps are on your clipboard.",
        });
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 text-white/90">
            <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="font-headline">Integrating External Tools</CardTitle>
                    <CardDescription>
                       There are two primary ways to get externally-generated content into Lore Weaver.
                    </CardDescription>
                </CardHeader>
            </Card>

             <Alert>
                <Terminal className="h-4 w-4" />
                <AlertTitle>Method 1: Simple Copy & Paste</AlertTitle>
                <AlertDescription>
                   This is the easiest method and requires no setup. Simply generate content with an AI and paste it directly into the app.
                </AlertDescription>
                 <CardContent className="pt-4">
                    <CodeBlock content={simpleInstructions} lang="shell" />
                    <Button onClick={() => handleCopy(simpleInstructions)} className="mt-4">
                        <Copy className="mr-2" />
                        Copy Instructions
                    </Button>
                </CardContent>
            </Alert>

            <Alert>
                <LinkIcon className="h-4 w-4" />
                <AlertTitle>Method 2: Programmatic URL Generation</AlertTitle>
                <AlertDescription>
                    For more advanced integration, your local tool or AI agent can construct a URL that pre-fills and automatically submits a new narrative post. This is a secure way to automate content creation without handling API keys.
                </AlertDescription>
                 <CardContent className="pt-4">
                    <CodeBlock content={urlInstructions(origin)} lang="javascript" />
                    <Button onClick={() => handleCopy(urlInstructions(origin))} className="mt-4">
                        <Copy className="mr-2" />
                        Copy Instructions for AI
                    </Button>
                </CardContent>
            </Alert>
        </div>
    );
}
