
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
// Step 1: Generate your story content using your favorite local AI tool.
// For example, you might ask Gemini:
// "Continue the story: The heroes have just entered the tavern. A cloaked figure in the corner looks up."

// Step 2: The AI will give you back a response, something like this:
// "The cloaked figure slowly rises, a metallic glint under their cloak. 'I've been expecting you,' the figure says, their voice a low rasp."

// Step 3: Simply copy the text the AI generated.

// Step 4: Go to the "Narrative" page in Lore Weaver and paste the text into the form for a new post.
`.trim();

export default function IntegrationsPage() {
    const { toast } = useToast();

    const handleCopy = () => {
        navigator.clipboard.writeText(nodeScriptContent);
        toast({
            title: "Instructions Copied!",
            description: "The steps are on your clipboard.",
        });
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 text-white/90">
            <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="font-headline">Using External AI Tools</CardTitle>
                    <CardDescription>
                        This is the easiest way to use a local AI (like Gemini running on your PC) to generate story content for Lore Weaver.
                    </CardDescription>
                </CardHeader>
            </Card>

             <Alert>
                <Terminal className="h-4 w-4" />
                <AlertTitle>The Easiest Approach: Copy & Paste</AlertTitle>
                <AlertDescription>
                    The simplest and most secure way to use an external AI is to generate the content on your local machine and then paste it directly into the Lore Weaver application. This requires no complex setup with API keys or scripts.
                </AlertDescription>
            </Alert>

            <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle>How It Works</CardTitle>
                    <CardDescription>Follow these simple steps to integrate any local AI with your campaign.</CardDescription>
                </CardHeader>
                <CardContent>
                    <CodeBlock content={nodeScriptContent} lang="shell" />
                    <Button onClick={handleCopy} className="mt-4">
                        <Copy className="mr-2" />
                        Copy Instructions
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
