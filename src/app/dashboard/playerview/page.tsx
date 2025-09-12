
"use client";

import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/context/auth-context';
import { db } from '@/lib/firebase/config';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import type { NarrativeThread } from '@/lib/firebase/types';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

export default function PlayerViewPage() {
    const { campaign, isLoading: isAuthLoading } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [narrativeThreads, setNarrativeThreads] = useState<NarrativeThread[]>([]);

    useEffect(() => {
        if (!campaign) return;

        const narrativeQuery = query(
            collection(db, "narrativeThreads"),
            where("campaignId", "==", campaign.id),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(narrativeQuery, (snapshot) => {
            if (!snapshot.empty) {
                const threads = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NarrativeThread));
                setNarrativeThreads(threads);
            }
            setIsLoading(false);
        }, (error) => {
            console.error("Failed to fetch narrative threads:", error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [campaign]);

    const activeThread = useMemo(() => {
        return narrativeThreads.length > 0 ? narrativeThreads[0] : null;
    }, [narrativeThreads]);
    
    if (isAuthLoading || isLoading) {
        return (
            <div className="w-full h-full p-4 md:p-8 space-y-8">
                <Skeleton className="h-16 w-1/2 mx-auto" />
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/3">
                        <Skeleton className="w-full h-96" />
                    </div>
                    <div className="md:w-2/3 space-y-4">
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-40 w-full" />
                    </div>
                </div>
            </div>
        );
    }
    
    if (!activeThread) {
        return (
             <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
                <h1 className="text-4xl font-headline uppercase tracking-widest">The story awaits</h1>
                <p className="mt-4 text-foreground/70">No narrative has been posted for this campaign yet.</p>
            </div>
        )
    }

    return (
        <div className="min-h-[calc(100vh-10rem)] w-full mx-auto max-w-7xl flex flex-col md:flex-row">
            {/* Vertical Banner on Wide Screens */}
            {campaign && (
                <div className="hidden md:flex items-center justify-center p-4">
                    <h2 className="font-headline text-2xl text-foreground/80 [writing-mode:vertical-rl] rotate-180 uppercase tracking-widest">
                        {campaign.title}
                    </h2>
                </div>
            )}
            
            <div className="flex-1 p-4 md:p-8">
                 {/* Horizontal Banner on Mobile */}
                {campaign && (
                    <div className="md:hidden text-center mb-8">
                        <h2 className="font-headline text-2xl text-foreground/80 uppercase tracking-widest">
                            {campaign.title}
                        </h2>
                    </div>
                )}
                
                <h1 className="text-4xl md:text-6xl font-headline uppercase tracking-widest text-center mb-8 md:mb-12">
                    {activeThread.title}
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
                    <div className="w-full">
                        <div className="relative aspect-[4/3] w-full rounded-sm overflow-hidden border-4 border-card">
                             <Image 
                                src={activeThread.imageUrl || '/placeholder.jpg'} 
                                alt={activeThread.title}
                                fill
                                className="object-cover"
                                data-ai-hint={activeThread.imageAiHint || "fantasy scene"}
                             />
                        </div>
                    </div>
                    <div className="w-full">
                        <div 
                          className="prose prose-lg prose-invert max-w-none text-foreground/90 leading-relaxed" 
                          dangerouslySetInnerHTML={{ __html: activeThread.content }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
