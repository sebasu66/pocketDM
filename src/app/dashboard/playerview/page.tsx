

"use client";

import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/context/auth-context';
import { db } from '@/lib/firebase/config';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import type { NarrativeThread } from '@/lib/firebase/types';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Menu } from 'lucide-react';
import { RusticIconButton } from '@/components/ui/rustic-icon-button';
import { useI18n } from '@/context/i18n-context';
import React from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';

export default function PlayerViewPage() {
    const { campaign, isLoading: isAuthLoading } = useAuth();
    const { t } = useI18n();
    const [isLoading, setIsLoading] = useState(true);
    const [narrativeThreads, setNarrativeThreads] = useState<NarrativeThread[]>([]);
    const [activeThreadIndex, setActiveThreadIndex] = useState(0);
    const [isSheetOpen, setIsSheetOpen] = React.useState(false);


    useEffect(() => {
        if (!campaign) return;

        const narrativeQuery = query(
            collection(db, "narrativeThreads"),
            where("campaignId", "==", campaign.id),
            orderBy("createdAt", "asc") // Order chronologically
        );

        const unsubscribe = onSnapshot(narrativeQuery, (snapshot) => {
            if (!snapshot.empty) {
                const threads = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NarrativeThread));
                setNarrativeThreads(threads);
                setActiveThreadIndex(threads.length - 1); // Start at the latest thread
            }
            setIsLoading(false);
        }, (error) => {
            console.error("Failed to fetch narrative threads:", error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [campaign]);

    const activeThread = useMemo(() => {
        return narrativeThreads.length > 0 ? narrativeThreads[activeThreadIndex] : null;
    }, [narrativeThreads, activeThreadIndex]);
    
    const handlePrev = () => {
        setActiveThreadIndex(prev => Math.max(0, prev - 1));
    };

    const handleNext = () => {
        setActiveThreadIndex(prev => Math.min(narrativeThreads.length - 1, prev + 1));
    };

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
                <h1 className="text-4xl font-headline uppercase tracking-widest">{t('notFoundTitle')}</h1>
                <p className="mt-4 text-foreground/70">{t('notFoundDescription')}</p>
            </div>
        )
    }

    const canGoNext = activeThreadIndex < narrativeThreads.length - 1;
    const canGoPrev = activeThreadIndex > 0;

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
                          className="prose prose-xl prose-invert max-w-none text-foreground/90 leading-relaxed" 
                          dangerouslySetInnerHTML={{ __html: activeThread.content }}
                        />
                    </div>
                </div>
            </div>

            <div className="fixed bottom-6 right-6 z-30 flex h-14 items-center gap-2 rounded-full bg-black/20 p-2 backdrop-blur-sm">
                <RusticIconButton
                    tooltip={t('designTestPreviousPost')}
                    onClick={handlePrev}
                    disabled={!canGoPrev}
                    className="text-white/90 hover:text-white"
                >
                    <ArrowLeft />
                </RusticIconButton>
                <RusticIconButton
                    tooltip={t('designTestNextPost')}
                    onClick={handleNext}
                    disabled={!canGoNext}
                    className="text-white/90 hover:text-white"
                >
                    <ArrowRight />
                </RusticIconButton>
                
                <Separator orientation="vertical" className="h-6 bg-white/20" />

                <RusticIconButton
                    tooltip="Toggle Menu"
                    onClick={() => setIsSheetOpen(true)}
                    className="text-white/90 hover:text-white"
                >
                    <Menu />
                </RusticIconButton>
            </div>
             <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                 <SheetContent side="right" className="p-0 w-80 bg-sidebar-gradient border-l-0 text-sidebar-foreground">
                    {/* Placeholder for sidebar content */}
                 </SheetContent>
            </Sheet>
        </div>
    );
}
