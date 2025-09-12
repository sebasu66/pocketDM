
"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { NarrativeThread, EnrichedComment } from '@/lib/firebase/types';
import { getCommentsByThreadId } from '@/lib/firebase/comments';
import { getCharactersByCampaign } from '@/lib/firebase/characters';
import { Skeleton } from '@/components/ui/skeleton';
import { Bot } from 'lucide-react';
import { getUserByEmail } from '@/lib/auth';

export default function AiLogPage() {
    const { user, campaign, isLoading: isAuthLoading } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const [logEntries, setLogEntries] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isAuthLoading && user?.role !== 'master') {
            toast({ variant: 'destructive', title: 'Access Denied', description: 'You must be a Game Master to view this page.' });
            router.push('/dashboard');
        }
    }, [user, isAuthLoading, router, toast]);

    useEffect(() => {
        if (!campaign || !user || user.role !== 'master') return;

        setIsLoading(true);

        const q = query(
            collection(db, "narrativeThreads"),
            where("campaignId", "==", campaign.id),
            orderBy("createdAt", "asc")
        );

        const unsubscribe = onSnapshot(q, async (snapshot) => {
            try {
                const threads = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NarrativeThread));
                const allCharacters = await getCharactersByCampaign(campaign.id);
                const gmUser = await getUserByEmail('gm@example.com');
                
                const allEnrichedComments: { [key: string]: EnrichedComment[] } = {};

                const generatedEntries = [];
                for (let i = 0; i < threads.length; i++) {
                    const currentThread = threads[i];
                    // Any thread not created by the GM is not an AI log entry.
                    if (currentThread.authorId !== gmUser?.id) continue;
                    // The first thread is manually created, so it's a response, not a request.
                    if (i === 0) continue;

                    const previousThreads = threads.slice(0, i);
                    
                    // Build up comments cache to avoid re-fetching
                    for(const pt of previousThreads) {
                        if (!allEnrichedComments[pt.id]) {
                           allEnrichedComments[pt.id] = await getCommentsByThreadId(pt.id);
                        }
                    }

                    const narrativeState = {
                        characters: allCharacters.map(c => ({
                            id: c.id,
                            name: c.name,
                            description: c.description,
                            class: c.class,
                        })),
                        threads: previousThreads.map(t => {
                            const comments = allEnrichedComments[t.id] || [];
                            return {
                                title: t.title,
                                content: t.content.replace(/<[^>]*>?/gm, ''), // strip html for log
                                comments: comments.map(c => ({
                                    authorName: c.character?.name || c.author?.name || 'Unknown',
                                    text: c.text,
                                }))
                            };
                        })
                    };

                    generatedEntries.push({
                        id: currentThread.id,
                        timestamp: currentThread.createdAt,
                        request: {
                            systemPrompt: localStorage.getItem('ai_system_prompt') || "You are a master storyteller.",
                            narrativeState: narrativeState,
                        },
                        response: currentThread.content,
                    });
                }
                setLogEntries(generatedEntries.reverse()); // Show newest first
            } catch (error) {
                console.error("Error building AI logs:", error);
                toast({ variant: "destructive", title: "Error", description: "Could not build AI log data." });
            } finally {
                setIsLoading(false);
            }
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
                                        <p className="font-semibold">AI Generation - Post #{totalGenerations - index}</p>
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
                                            <h5 className="font-medium">Narrative State (as JSON)</h5>
                                            <pre className="text-xs whitespace-pre-wrap font-mono bg-background/50 p-2 rounded">{JSON.stringify(entry.request.narrativeState, null, 2)}</pre>
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
