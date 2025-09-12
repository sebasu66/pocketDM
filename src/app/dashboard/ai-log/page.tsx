
"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { NarrativeThread } from '@/lib/firebase/types';
import { getCommentsByThreadId } from '@/lib/firebase/comments';
import { getCharactersByCampaign } from '@/lib/firebase/characters';
import { Skeleton } from '@/components/ui/skeleton';
import { Bot } from 'lucide-react';

export default function AiLogPage() {
    const { user, campaign, isLoading: isAuthLoading } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const [logEntries, setLogEntries] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [systemPrompt, setSystemPrompt] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthLoading && user?.role !== 'master') {
            toast({ variant: 'destructive', title: 'Access Denied', description: 'You must be a Game Master to view this page.' });
            router.push('/dashboard');
        }
    }, [user, isAuthLoading, router, toast]);

    useEffect(() => {
        if (!campaign || !user || user.role !== 'master') return;

        setIsLoading(true);
        const savedPrompt = localStorage.getItem('ai_system_prompt');
        setSystemPrompt(savedPrompt);

        const q = query(
            collection(db, "narrativeThreads"),
            where("campaignId", "==", campaign.id),
            orderBy("createdAt", "asc")
        );

        const unsubscribe = onSnapshot(q, async (snapshot) => {
            const threads = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NarrativeThread));
            const allCharacters = await getCharactersByCampaign(campaign.id);
            
            const generatedEntries = [];
            for (let i = 0; i < threads.length; i++) {
                const currentThread = threads[i];
                if (i === 0) continue; // The first thread is manually created, so no AI log for it.

                const previousThread = threads[i - 1];
                const comments = await getCommentsByThreadId(previousThread.id);

                const narrativeHistory = `GM: ${previousThread.title}\n${previousThread.content.replace(/<[^>]*>?/gm, '')}\n` +
                    comments.map(c => {
                        const character = allCharacters.find(char => char.id === c.characterId);
                        const authorName = character?.name || c.author.name || "Unknown";
                        return `${authorName}: ${c.text}`;
                    }).join('\n');

                generatedEntries.push({
                    id: currentThread.id,
                    timestamp: currentThread.createdAt,
                    request: {
                        systemPrompt: savedPrompt || "You are a master storyteller.",
                        narrativeHistory: narrativeHistory,
                    },
                    response: currentThread.content,
                });
            }
            setLogEntries(generatedEntries.reverse()); // Show newest first
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching AI logs:", error);
            toast({ variant: "destructive", title: "Error", description: "Could not fetch AI log data." });
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [campaign, user, router, toast]);


    if (isAuthLoading || isLoading) {
        return (
            <div className="max-w-4xl mx-auto space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
            </div>
        )
    }

    if (user?.role !== 'master') {
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
    
    const totalGenerations = logEntries.length;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">AI Generation Log</CardTitle>
                    <CardDescription>
                        A chronological record of requests sent to the Gemini model and the responses received.
                    </CardDescription>
                </CardHeader>
            </Card>

            {logEntries.length === 0 ? (
                <Card>
                    <CardContent className="p-6 text-center text-muted-foreground">
                        No AI generations have occurred yet.
                    </CardContent>
                </Card>
            ) : (
                <Accordion type="single" collapsible className="w-full space-y-4">
                    {logEntries.map((entry, index) => (
                        <AccordionItem value={`item-${index}`} key={entry.id} className="bg-card/80 backdrop-blur-sm border-border/50 rounded-lg">
                            <AccordionTrigger className="p-4 hover:no-underline">
                                <div className="flex items-center gap-4">
                                    <Bot className="h-5 w-5" />
                                    <div className="text-left">
                                        <p className="font-semibold">AI Generation - Post #{totalGenerations - index + 1}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(entry.timestamp).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="p-4 pt-0">
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold text-lg mb-2">Request to Gemini</h4>
                                        <div className="space-y-2 p-3 bg-muted/50 rounded-md border">
                                            <h5 className="font-medium">System Prompt</h5>
                                            <pre className="text-xs whitespace-pre-wrap font-mono bg-background/50 p-2 rounded">{entry.request.systemPrompt}</pre>
                                            <h5 className="font-medium">Narrative History</h5>
                                            <pre className="text-xs whitespace-pre-wrap font-mono bg-background/50 p-2 rounded">{entry.request.narrativeHistory}</pre>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-lg mb-2">Response from Gemini</h4>
                                        <div className="p-3 bg-muted/50 rounded-md border">
                                            <div className="prose prose-sm prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: entry.response }} />
                                        </div>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            )}
        </div>
    );
}
