"use client";

import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useAuth } from '@/context/auth-context';
import { db } from '@/lib/firebase/config';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import type { NarrativeThread, EnrichedThread, Character, EnrichedComment } from '@/lib/firebase/types';
import { getCommentsByThreadId, addNarrativeComment } from '@/lib/firebase/comments';
import { getCharactersByCampaign } from '@/lib/firebase/characters';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, ArrowRight, Menu, User as UserIcon, X } from 'lucide-react';
import { RusticIconButton } from '@/components/ui/rustic-icon-button';
import { useI18n } from '@/context/i18n-context';
import React from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { ThreadComments } from './ThreadComments';
import { getUserById } from '@/lib/auth';
import { CommentForm } from './CommentForm';
import { useToast } from '@/hooks/use-toast';
import { CharacterSheet } from './CharacterSheet';
import { TypingEffect } from '@/components/ui/typing-effect';


export default function PlayerViewPage() {
    const { user, campaign, isLoading: isAuthLoading } = useAuth();
    const { t } = useI18n();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [narrativeThreads, setNarrativeThreads] = useState<NarrativeThread[]>([]);
    const [activeThreadIndex, setActiveThreadIndex] = useState(0);
    const [isMenuSheetOpen, setIsMenuSheetOpen] = React.useState(false);
    const [isCharacterSheetOpen, setIsCharacterSheetOpen] = React.useState(false);
    const [playerCharacter, setPlayerCharacter] = useState<Character | null>(null);
    const [activePlayers, setActivePlayers] = useState<Character[]>([]);
    const [activeThreadComments, setActiveThreadComments] = useState<EnrichedComment[]>([]);
    
    const pageEndRef = useRef<HTMLDivElement>(null);
    const isInitialLoad = useRef(true);

    useEffect(() => {
        if (!campaign) return;
        setIsLoading(true);

        const narrativeQuery = query(
            collection(db, "narrativeThreads"),
            where("campaignId", "==", campaign.id),
            orderBy("createdAt", "asc")
        );

        const unsubscribe = onSnapshot(narrativeQuery, async (snapshot) => {
            if (!snapshot.empty) {
                const threadsFromDb = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NarrativeThread));
                const isNewThread = threadsFromDb.length > narrativeThreads.length;
                
                setNarrativeThreads(threadsFromDb);

                if (isInitialLoad.current || isNewThread) {
                    setActiveThreadIndex(threadsFromDb.length - 1);
                    isInitialLoad.current = false;
                }
                
                const allCharacters = await getCharactersByCampaign(campaign.id);
                setActivePlayers(allCharacters.filter(c => c.isActive));

                if (user) {
                    const userCharacter = allCharacters.find(c => c.userId === user.id);
                    setPlayerCharacter(userCharacter || null);
                }
            }
            setIsLoading(false);
        }, (error) => {
            console.error("Failed to fetch narrative threads:", error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [campaign, user, narrativeThreads.length]);

    const activeThread = useMemo(() => {
        return narrativeThreads.length > 0 ? narrativeThreads[activeThreadIndex] : null;
    }, [narrativeThreads, activeThreadIndex]);
    
    // Effect to listen for comments on the active thread
    useEffect(() => {
        if (!activeThread) return;

        const q = query(
            collection(db, 'narrativeComments'),
            where('threadId', '==', activeThread.id),
            orderBy('createdAt', 'asc')
        );

        const unsubscribe = onSnapshot(q, async (snapshot) => {
            const commentsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EnrichedComment));
            
            const enrichedComments = await Promise.all(commentsData.map(async (comment) => {
                const author = await getUserById(comment.authorId);
                const character = activePlayers.find(c => c.id === comment.characterId);
                return { ...comment, author: author!, character: character || null };
            }));

            setActiveThreadComments(enrichedComments);
        }, (error) => {
            console.error("Error fetching real-time comments: ", error);
        });

        return () => unsubscribe();
    }, [activeThread, activePlayers]);


    const lastThread = useMemo(() => narrativeThreads.length > 0 ? narrativeThreads[narrativeThreads.length - 1] : null, [narrativeThreads]);
    
    const playersWhoHaveCommented = useMemo(() => new Set(activeThreadComments.map(c => c.authorId) || []), [activeThreadComments]);
    
    const hasPlayerResponded = user ? playersWhoHaveCommented.has(user.id) : false;

    const canPlayerRespond = lastThread && playerCharacter?.isActive && !hasPlayerResponded && activeThreadIndex === narrativeThreads.length - 1;

    const handlePrev = () => {
        setActiveThreadIndex(prev => Math.max(0, prev - 1));
    };

    const handleNext = () => {
        setActiveThreadIndex(prev => Math.min(narrativeThreads.length - 1, prev + 1));
    };
    
    const handleAddComment = async (text: string, hiddenText: string) => {
        if (!user || !playerCharacter || !lastThread) return;
        
        const commentData = {
            threadId: lastThread.id,
            authorId: user.id,
            characterId: playerCharacter.id,
            text,
            hiddenText,
            createdAt: Date.now(),
        };

        try {
          await addNarrativeComment(commentData);
          toast({ title: t('narrativeResponsePosted'), description: t('narrativeResponsePostedDesc')});
        } catch (error) {
          toast({ variant: "destructive", title: "Error", description: t('narrativeErrorPost')});
        }
    };
    
    const isLastThread = activeThreadIndex === narrativeThreads.length - 1;

     useEffect(() => {
        if (isLastThread) {
            setTimeout(() => {
                pageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 500);
        }
    }, [activeThreadComments, isLastThread]);


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
    
    const imageUrl = activeThread.imageUrl || '/locations/default_location.jpg';
    
    const renderContent = () => {
        if (isLastThread) {
            return <TypingEffect text={activeThread.content.replace(/<[^>]*>?/gm, '')} />;
        }
        return <div className="prose prose-xl prose-invert max-w-none text-foreground/90 leading-relaxed mt-8 md:mt-0" dangerouslySetInnerHTML={{ __html: activeThread.content }} />;
    };

    return (
        <div 
            className="min-h-[calc(100vh-10rem)] w-full mx-auto max-w-7xl flex"
        >
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
            
            <div className="hidden md:flex items-center justify-center p-4 z-10 bg-leather-column drop-shadow-2xl">
                <h2 className="font-headline text-2xl text-foreground/80 [writing-mode:vertical-rl] rotate-180 uppercase tracking-widest">
                    {campaign?.title}
                </h2>
            </div>
            
            <div className="flex-1 md:p-8 z-10 pb-20">
                 
                <div className="md:hidden text-center h-20 flex items-center justify-center bg-leather-column drop-shadow-2xl mb-8">
                    <h2 className="font-body text-2xl text-foreground/80 uppercase tracking-widest">
                        {campaign?.title}
                    </h2>
                </div>
                
                <div className="p-4 md:p-0">
                    <h1 className="text-4xl md:text-7xl font-headline uppercase tracking-widest text-center mb-8 md:mb-12">
                        {activeThread.title}
                    </h1>

                    <div>
                        <div 
                            className="relative aspect-[4/3] md:w-3/5 image-mask-squared"
                            data-ai-hint={activeThread.imageAiHint || "fantasy scene"}
                        >
                             <Image
                                src={imageUrl}
                                alt={activeThread.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="prose prose-xl prose-invert max-w-none text-foreground/90 leading-relaxed mt-8 md:mt-0">
                            {renderContent()}
                        </div>
                    </div>
                </div>

                <Separator className="my-8 md:my-12 bg-border/50" />

                <div className="p-4 md:p-0">
                    <div className="bg-transparent p-4 md:p-8 rounded-lg">
                        <ThreadComments comments={activeThreadComments} t={t} />
                    </div>
                </div>
                
                {canPlayerRespond && (
                    <div className="p-4 md:p-0 mt-8">
                        <div className='backdrop-blur-lg rounded-lg'>
                           <CommentForm onSubmit={handleAddComment} character={playerCharacter} t={t} />
                        </div>
                    </div>
                )}
                <div ref={pageEndRef} />
            </div>

            <div className="fixed bottom-6 right-6 z-30 flex h-14 items-center gap-2 rounded-full bg-black/20 p-2 backdrop-blur-sm">
                {canGoPrev && (
                    <RusticIconButton
                        tooltip={t('designTestPreviousPost')}
                        onClick={handlePrev}
                        className="text-white/90 hover:text-white"
                    >
                      <ArrowLeft/>
                    </RusticIconButton>
                )}
                {canGoNext && (
                    <RusticIconButton
                        tooltip={t('designTestNextPost')}
                        onClick={handleNext}
                        className="text-white/90 hover:text-white"
                    >
                      <ArrowRight/>
                    </RusticIconButton>
                )}
                
                {(canGoPrev || canGoNext) && <Separator orientation="vertical" className="h-6 bg-white/20" />}

                 <RusticIconButton
                    tooltip={t('charactersViewEditSheet')}
                    onClick={() => setIsCharacterSheetOpen(true)}
                    className="text-white/90 hover:text-white"
                    disabled={!playerCharacter}
                >
                    <UserIcon />
                </RusticIconButton>

                <RusticIconButton
                    tooltip="Toggle Menu"
                    onClick={() => setIsMenuSheetOpen(true)}
                    className="text-white/90 hover:text-white"
                >
                    <Menu />
                </RusticIconButton>
            </div>

             <Sheet open={isMenuSheetOpen} onOpenChange={setIsMenuSheetOpen}>
                 <SheetContent side="right" className="p-0 w-80 bg-sidebar-gradient border-l-0 text-sidebar-foreground">
                    {/* Placeholder for sidebar content */}
                 </SheetContent>
            </Sheet>

            <Sheet open={isCharacterSheetOpen} onOpenChange={setIsCharacterSheetOpen}>
                 <SheetContent side="right" className="p-0 w-full md:w-1/3 lg:w-1/4 bg-sidebar-gradient border-l-0 text-sidebar-foreground">
                    {playerCharacter && (
                        <div className="relative h-full">
                            <CharacterSheet character={playerCharacter} t={t} />
                            <div className="absolute bottom-6 right-6">
                                 <RusticIconButton
                                    tooltip={t('charactersCancel')}
                                    onClick={() => setIsCharacterSheetOpen(false)}
                                    className="text-white/90 hover:text-white"
                                >
                                    <X />
                                </RusticIconButton>
                            </div>
                        </div>
                    )}
                 </SheetContent>
            </Sheet>
        </div>
    );
}
