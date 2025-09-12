
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';

const defaultSystemPrompt = `You are a master storyteller and creative Dungeon Master for a tabletop role-playing game. Your task is to weave a compelling and collaborative narrative.

- **Analyze the History**: Carefully read the narrative history provided, which includes your previous posts and the players' actions.
- **Consult Character Data**: Use the available tools to look up information about the player characters. Refer to them by name and incorporate their unique backstories and abilities into the narrative.
- **Drive the Story Forward**: Write the next post in the story. It should be a direct continuation of the events, reacting to player choices and introducing new challenges, characters, or plot developments.
- **Be Evocative**: Use descriptive language to paint a vivid picture of the world, its inhabitants, and the atmosphere.
- **Maintain Tone**: Adhere to the established tone of the campaign (e.g., epic fantasy, gritty noir, lighthearted adventure).`;

// Helper function to set a cookie
function setCookie(name: string, value: string, days: number) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

// Helper function to get a cookie
function getCookie(name: string): string | null {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i=0;i < ca.length;i++) {
        let c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}


export default function ApiKeysPage() {
    const { toast } = useToast();
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [apiKey, setApiKey] = useState('');
    const [systemPrompt, setSystemPrompt] = useState(defaultSystemPrompt);

    useEffect(() => {
        if (!isLoading && user?.role !== 'master') {
          toast({
            variant: 'destructive',
            title: 'Access Denied',
            description: 'You must be a Game Master to view this page.',
          });
          router.push('/dashboard/settings');
        }
    }, [user, isLoading, router, toast]);

    const handleSave = () => {
        setCookie('gemini_api_key', apiKey, 7); // Save for 7 days
        localStorage.setItem('ai_system_prompt', systemPrompt);
        
        toast({
            title: "Settings Saved",
            description: "Your Gemini API key has been saved to a cookie and the system prompt to local storage.",
        });
    };
    
    React.useEffect(() => {
        const savedKey = getCookie('gemini_api_key');
        const savedPrompt = localStorage.getItem('ai_system_prompt');
        if (savedKey) setApiKey(savedKey);
        if (savedPrompt) setSystemPrompt(savedPrompt);
    }, []);

    if (isLoading || user?.role !== 'master') {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p>You must be a Game Master to view this page. Redirecting...</p>
          </CardContent>
        </Card>
      );
    }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">AI & API Key Settings</CardTitle>
          <CardDescription>Manage your generative AI settings and API keys here. Your key is stored in your browser cookies.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="api-key">Gemini API Key</Label>
                <Input 
                    id="api-key" 
                    type="password" 
                    placeholder="Enter your Google AI Studio API Key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                    Your key is stored locally in your browser cookies. Get one from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline">Google AI Studio</a>.
                </p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="system-prompt">AI System Prompt</Label>
                <Textarea 
                    id="system-prompt"
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    rows={15}
                    className="font-mono text-xs"
                />
                <p className="text-xs text-muted-foreground">
                    This is the core instruction given to the AI to define its role and behavior. You can tweak it to change the AI's personality or style.
                </p>
            </div>
             <div className="flex justify-end">
                <Button onClick={handleSave}>Save Settings</Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
