
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
import { Bot, TestTube2 } from 'lucide-react';
import { getUserByEmail } from '@/lib/firebase/auth';
import { useI18n } from '@/context/i18n-context';

type LogEntry = {
    id: string;
    timestamp: number;
    type: 'ai_generation' | 'system_test';
    title: string;
    request: any;
    response: any;
    status?: 'SUCCESS' | 'FAILURE';
};

export default function AiLogPage() {
    const { user, campaign, isLoading: isAuthLoading } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const { t } = useI18n();
    const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isAuthLoading && user?.role !== 'master') {
            toast({ variant: 'destructive', title: t('charactersAccessDenied'), description: t('charactersMustBeGM') });
            router.push('/dashboard');
        }
    }, [user, isAuthLoading, router, toast, t]);

    useEffect(() => {
        if (!campaign || !user || user.role !== 'master') return;

        setIsLoading(true);

        // Listener for AI Generation Logs (from narrativeThreads)
        const narrativeQuery = query(
            collection(db, "narrativeThreads"),
            where("campaignId", "==", campaign.id),
            orderBy("createdAt", "asc")
        );

        const unsubscribeNarrative = onSnapshot(narrativeQuery, async (snapshot) => {
            try {
                const threads = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NarrativeThread));
                const allCharacters = await getCharactersByCampaign(campaign.id);
                const gmUser = await getUserByEmail('gm@example.com');
                
                const allEnrichedComments: { [key: string]: EnrichedComment[] } = {};

                const aiEntries: LogEntry[] = [];
                for (let i = 0; i < threads.length; i++) {
                    const currentThread = threads[i];
                    if (currentThread.authorId !== gmUser?.id) continue;
                    if (i === 0) continue;

                    const previousThreads = threads.slice(0, i);
                    
                    for(const pt of previousThreads) {
                        if (!allEnrichedComments[pt.id]) {
                           allEnrichedComments[pt.id] = await getCommentsByThreadId(pt.id);
                        }
                    }

                    const narrativeState = {
                        characters: allCharacters.map(c => ({ id: c.id, name: c.name, description: c.description, class: c.class })),
                        threads: previousThreads.map(t => ({
                            title: t.title,
                            content: t.content.replace(/<[^>]*>?/gm, ''),
                            comments: (allEnrichedComments[t.id] || []).map(c => ({
                                authorName: c.character?.name || c.author?.name || 'Unknown',
                                text: c.text,
                            }))
                        }))
                    };

                    aiEntries.push({
                        id: currentThread.id,
                        timestamp: currentThread.createdAt,
                        type: 'ai_generation',
                        title: t('aiLogGeneration', {postNumber: i}),
                        request: {
                            systemPrompt: campaign.systemPrompt || "You are a master storyteller.",
                            narrativeState: narrativeState,
                        },
                        response: currentThread.content,
                    });
                }

                setLogEntries(prev => {
                    const otherLogs = prev.filter(p => p.type !== 'ai_generation');
                    return [...otherLogs, ...aiEntries].sort((a, b) => b.timestamp - a.timestamp);
                });

            } catch (error) {
                console.error("Error building AI logs:", error);
                toast({ variant: "destructive", title: "Error", description: "Could not build AI log data." });
            } finally {
                setIsLoading(false);
            }
        });

        // Listener for System Test Logs (from devLog)
        const devLogQuery = query(collection(db, "devLog"), orderBy("timestamp", "desc"));
        const unsubscribeDevLog = onSnapshot(devLogQuery, (snapshot) => {
            const devLogDocs = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
            const systemEntries: LogEntry[] = devLogDocs.map((log: any) => ({
                 id: log.id,
                 timestamp: log.timestamp,
                 type: 'system_test',
                 title: `System Test: ${log.type}`,
                 request: log.log,
                 response: `Test finished with status: ${log.status}`,
                 status: log.status
            }));
            
            setLogEntries(prev => {
                const otherLogs = prev.filter(p => p.type !== 'system_test');
                return [...otherLogs, ...systemEntries].sort((a, b) => b.timestamp - a.timestamp);
            });
            setIsLoading(false);
        });


        return () => {
            unsubscribeNarrative();
            unsubscribeDevLog();
        };
    }, [campaign, user, router, toast, t]);


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
            <CardTitle>{t('charactersAccessDenied')}</CardTitle>

          </CardHeader>
          <CardContent>
            <p>{t('charactersMustBeGM')}</p>
          </CardContent>
        </Card>
      );
    }
    
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">{t('aiLogTitle')}</CardTitle>
                    <CardDescription>
                        {t('aiLogDescription')}
                    </CardDescription>
                </CardHeader>
            </Card>

            {logEntries.length === 0 ? (
                <Card>
                    <CardContent className="p-6 text-center text-muted-foreground">
                        {t('aiLogNoGenerations')}
                    </CardContent>
                </Card>
            ) : (
                <Accordion type="single" collapsible className="w-full space-y-4">
                    {logEntries.map((entry, index) => (
                        <AccordionItem value={`item-${index}`} key={entry.id} className="bg-card/80 backdrop-blur-sm border-border/50 rounded-lg">
                            <AccordionTrigger className="p-4 hover:no-underline">
                                <div className="flex items-center gap-4">
                                     {entry.type === 'ai_generation' ? <Bot className="h-5 w-5" /> : <TestTube2 className={`h-5 w-5 ${entry.status === 'SUCCESS' ? 'text-green-500' : 'text-red-500'}`} />}
                                    <div className="text-left">
                                        <p className="font-semibold">{entry.title}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(entry.timestamp).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="p-4 pt-0">
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold text-lg mb-2">{entry.type === 'ai_generation' ? t('aiLogRequestToGemini') : 'Log Details'}</h4>
                                        <div className="space-y-2 p-3 bg-muted/50 rounded-md border max-h-96 overflow-y-auto">
                                            {entry.type === 'ai_generation' ? (
                                                <>
                                                    <h5 className="font-medium">{t('narrativeSystemPrompt')}</h5>
                                                    <pre className="text-xs whitespace-pre-wrap font-mono bg-background/50 p-2 rounded">{entry.request.systemPrompt}</pre>
                                                    <h5 className="font-medium">{t('aiLogNarrativeState')}</h5>
                                                    <pre className="text-xs whitespace-pre-wrap font-mono bg-background/50 p-2 rounded">{JSON.stringify(entry.request.narrativeState, null, 2)}</pre>
                                                </>
                                            ) : (
                                                <pre className="text-xs whitespace-pre-wrap font-mono bg-background/50 p-2 rounded">
                                                    {Array.isArray(entry.request) ? entry.request.join('\n') : JSON.stringify(entry.request, null, 2)}
                                                </pre>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-lg mb-2">{entry.type === 'ai_generation' ? t('aiLogResponseFromGemini') : 'Result'}</h4>
                                        <div className="p-3 bg-muted/50 rounded-md border">
                                            {entry.type === 'ai_generation' ? (
                                                <div className="prose prose-sm prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: entry.response }} />
                                            ) : (
                                                 <p className={`font-bold ${entry.status === 'SUCCESS' ? 'text-green-500' : 'text-red-500'}`}>{entry.response}</p>
                                            )}
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
