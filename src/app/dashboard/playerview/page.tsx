
"use client";

import { useEffect, useState, useMemo, useRef } from 'react';
import { useAuth } from '@/context/auth-context';
import { db } from '@/lib/firebase/config';
import { collection, query, where, orderBy, onSnapshot, writeBatch, doc } from 'firebase/firestore';
import type { NarrativeThread, Character, EnrichedComment, User } from '@/lib/firebase/types';
import { addNarrativeComment, getCommentsByThreadId } from '@/lib/firebase/comments';
import { getCharactersByCampaign } from '@/lib/firebase/characters';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, ArrowRight, Menu, User as UserIcon, X, Bot, Plus, FileText, RotateCcw, Trash2, Play, Pause } from 'lucide-react';
import { RusticIconButton } from '@/components/ui/rustic-icon-button';
import { useI18n } from '@/context/i18n-context';
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import Image from 'next/image';
import { ThreadComments } from './ThreadComments';
import { getUserById } from '@/lib/firebase/auth';
import { CommentForm } from './CommentForm';
import { useToast } from '@/hooks/use-toast';
import { CharacterSheet } from './CharacterSheet';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogTrigger, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { generateStory } from '@/ai/flows/narrative-orchestrator';
import { addNarrativeThread, deleteNarrativeThread, restartCampaignNarrative } from '@/lib/firebase/narrative';
import { StoryInput, StoryOutput } from '@/ai/flows/narrative-orchestrator';
import { InteractiveSection } from '@/components/ui/interactive-section';
import { GmSidebarContent, PlayerSidebarContent } from '../layout';
import { useRouter } from 'next/navigation';


export default function PlayerViewPage() {
    const { user, campaign, isLoading: isAuthLoading, activeRole } = useAuth();
    const { t, locale } = useI18n();
    const { toast } = useToast();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [allNarrativeThreads, setAllNarrativeThreads] = useState<NarrativeThread[]>([]);
    const [activeThreadIndex, setActiveThreadIndex] = useState(0);
    const [isMenuSheetOpen, setIsMenuSheetOpen] = React.useState(false);
    const [isCharacterSheetOpen, setIsCharacterSheetOpen] = React.useState(false);
    const [playerCharacter, setPlayerCharacter] = useState<Character | null>(null);
    const [activePlayers, setActivePlayers] = useState<Character[]>([]);
    const [activeThreadComments, setActiveThreadComments] = useState<EnrichedComment[]>([]);
    
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const isInitialLoad = useRef(true);

    const isMaster = activeRole === 'gm';
    const [isGenerating, setIsGenerating] = useState(false);
    const [lastPrompt, setLastPrompt] = useState<any | null>(null);

    // Filter threads based on characterFilterList
    const narrativeThreads = useMemo(() => {
        if (isMaster || !playerCharacter) {
            return allNarrativeThreads;
        }
        return allNarrativeThreads.filter(thread => {
            if (!thread.characterFilterList || typeof thread.characterFilterList !== 'string') {
                return true; // Show if filter is missing, null, or not a string
            }
            return thread.characterFilterList.split(',').includes(playerCharacter.id);
        });
    }, [allNarrativeThreads, playerCharacter, isMaster]);


    // Effect to fetch threads and characters
    useEffect(() => {
        if (!campaign) return;
        setIsLoading(true);

        const narrativeQuery = query(
            collection(db, "narrativeThreads"),
            where("campaignId", "==", campaign.id),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(narrativeQuery, async (snapshot) => {
            const threadsFromDb = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NarrativeThread));
            
            if (isInitialLoad.current) {
                setActiveThreadIndex(0);
                isInitialLoad.current = false;
            } else {
                 if(threadsFromDb.length !== allNarrativeThreads.length){
                     setActiveThreadIndex(0);
                 }
            }
            setAllNarrativeThreads(threadsFromDb);

            const allCharacters = await getCharactersByCampaign(campaign.id);
            setActivePlayers(allCharacters.filter(c => c.isActive));

            if (user) {
                const userCharacter = allCharacters.find(c => c.userId === user.id);
                setPlayerCharacter(userCharacter || null);

                // Redirect if player has no character
                if (!isMaster && !userCharacter && !isAuthLoading && user.role.isPlayer) {
                    toast({
                        title: "Character Needed",
                        description: "You must create a character before viewing the narrative.",
                        variant: "destructive"
                    });
                    router.push('/dashboard/characters');
                }
            }
            
            setIsLoading(false);
        }, (error) => {
            console.error("Failed to fetch narrative threads:", error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [campaign, user, isMaster, router, isAuthLoading, toast]);

    const activeThread = useMemo(() => {
        return narrativeThreads.length > 0 ? narrativeThreads[activeThreadIndex] : null;
    }, [narrativeThreads, activeThreadIndex]);
    
    // Effect to reset audio when thread changes
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setIsPlaying(false);
        }
    }, [activeThread]);

    // Effect to fetch comments for the active thread
    useEffect(() => {
        if (!activeThread) {
            setActiveThreadComments([]);
            return;
        };

        const commentsQuery = query(
            collection(db, "narrativeComments"),
            where("threadId", "==", activeThread.id),
            orderBy("createdAt", "asc")
        );

        const unsubscribe = onSnapshot(commentsQuery, async (snapshot) => {
            const commentsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EnrichedComment));
            
            const characterCache: Record<string, Character> = {};
            const userCache: Record<string, User> = {};

            const enrichedComments = await Promise.all(commentsData.map(async (comment) => {
                let author = userCache[comment.authorId];
                if (!author) {
                    author = (await getUserById(comment.authorId))!;
                    if(author) userCache[comment.authorId] = author;
                }

                let character = comment.characterId ? characterCache[comment.characterId] : undefined;
                if(comment.characterId && !character) {
                    const charFromDb = await getCharactersByCampaign(campaign!.id, undefined, comment.characterId);
                    if(charFromDb.length > 0) {
                        character = charFromDb[0];
                        characterCache[comment.characterId] = character;
                    }
                }
                
                return { ...comment, author: author!, character: character || null };
            }));

            setActiveThreadComments(enrichedComments);
        });

        return () => unsubscribe();
    }, [activeThread, campaign]);

    const lastThread = useMemo(() => narrativeThreads.length > 0 ? narrativeThreads[0] : null, [narrativeThreads]);
    
    const playersWhoHaveCommentedOnLastThread = useMemo(() => {
        if (activeThread?.id !== lastThread?.id) return new Set();
        return new Set(activeThreadComments.map(c => c.authorId));
    }, [activeThread, lastThread, activeThreadComments]);
    
    const hasPlayerResponded = user ? playersWhoHaveCommentedOnLastThread.has(user.id) : false;

    const allActivePlayersResponded = useMemo(() => {
        if (!lastThread || activePlayers.length === 0) return false;
        if (activeThread?.id !== lastThread?.id) return false;
        return activePlayers.every(p => playersWhoHaveCommentedOnLastThread.has(p.userId));
    }, [activePlayers, playersWhoHaveCommentedOnLastThread, lastThread, activeThread]);

    const isAITurn = useMemo(() => {
        if (!isMaster) return false;
        if (narrativeThreads.length === 0) return true;
        return allActivePlayersResponded;
    }, [isMaster, narrativeThreads.length, allActivePlayersResponded]);

    const canPlayerRespond = !isMaster && playerCharacter?.isActive && lastThread && !hasPlayerResponded && activeThreadIndex === 0;

    const handlePrev = () => {
        setActiveThreadIndex(prev => Math.min(narrativeThreads.length - 1, prev + 1));
    };

    const handleNext = () => {
        setActiveThreadIndex(prev => Math.max(0, prev - 1));
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
    
    const handleGenerateNextPost = async () => {
      if (!campaign || !user || !isMaster) return;

      setIsGenerating(true);
      toast({ title: t('narrativeThinking'), description: t('narrativeThinkingDesc') });

      try {
        const apiKey = localStorage.getItem('gemini_api_key');
        const systemPrompt = campaign.systemPrompt;

        if (!apiKey) {
            toast({ variant: "destructive", title: t('narrativeApiKeyNotFound'), description: t('narrativeApiKeyNotFoundDesc') });
            setIsGenerating(false);
            return;
        }
        
        const storyInput: StoryInput = {
            campaignId: campaign.id,
            systemPrompt: systemPrompt || "You are a master storyteller.",
            apiKey: apiKey,
        };

        setLastPrompt(storyInput);

        const result: StoryOutput = await generateStory(storyInput);

        const newThreadData: Omit<NarrativeThread, 'id'> = {
            campaignId: campaign.id,
            authorId: user.id, 
            title: "The Story Continues...",
            createdAt: Date.now(),
            content: `<p>${result.nextPost.replace(/\n/g, '</p><p>')}</p>`,
            characterFilterList: result.characterFilterList || "",
        };

        await addNarrativeThread(newThreadData);
        toast({ title: t('narrativeStoryUpdated'), description: t('narrativeStoryUpdatedDesc') });

      } catch (error: any) {
        console.error("Error generating story:", error);
        toast({ 
            variant: "destructive", 
            title: t('narrativeGenerationFailed'), 
            description: `An error occurred: ${error.message || String(error)}`
        });
      } finally {
        setIsGenerating(false);
      }
    }
    
    const togglePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleAudioEnded = () => {
        setIsPlaying(false);
    };

   const handleRedo = async () => {
    if (!lastThread) return;
    setIsGenerating(true);
    try {
        await deleteNarrativeThread(lastThread.id);
        setTimeout(() => {
            handleGenerateNextPost();
        }, 500);
    } catch (error) {
        console.error("Error redoing generation:", error);
        toast({ variant: "destructive", title: "Error", description: t('narrativeErrorRedo')});
        setIsGenerating(false);
    }
  }

  const handleRestart = async () => {
    if (!campaign) return;
    setIsGenerating(true);
    toast({ title: t('narrativeRestarting'), description: t('narrativeRestartingDesc')});
    try {
        await restartCampaignNarrative(campaign.id, locale);
    } catch (error) {
        console.error("Error restarting campaign:", error);
        toast({ variant: "destructive", title: "Error", description: t('narrativeErrorRestart')});
    } finally {
        setIsGenerating(false);
    }
  }

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
                <p className="mt-4 text-foreground/70">{t('narrativeNotStarted')}</p>
                 {isMaster && (
                    <div className="mt-8">
                        <GmControls
                            isAITurn={isAITurn}
                            isGenerating={isGenerating}
                            onGenerate={handleGenerateNextPost}
                            onRedo={handleRedo}
                            onRestart={handleRestart}
                            lastPrompt={lastPrompt}
                            activePlayers={activePlayers}
                            commentingPlayers={playersWhoHaveCommentedOnLastThread}
                            hasThreads={narrativeThreads.length > 0}
                            t={t}
                        />
                    </div>
                )}
            </div>
        )
    }

    const canGoNext = activeThreadIndex > 0;
    const canGoPrev = activeThreadIndex < narrativeThreads.length - 1;
    
    const imageUrl = activeThread.imageUrl || '/locations/default_location.jpg';

    return (
        <div 
            className="w-full mx-auto max-w-7xl flex"
        >
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
            
            <div className="hidden md:flex items-center justify-center p-4 z-10 bg-leather-column drop-shadow-2xl">
                <h2 className="font-headline text-2xl text-foreground/80 [writing-mode:vertical-rl] rotate-180 uppercase tracking-widest">
                    {campaign?.title}
                </h2>
            </div>
            
            <div className="flex-1 md:p-8 z-10">
                 
                <div className="md:hidden text-center h-20 flex items-center justify-center bg-leather-column drop-shadow-2xl mb-8">
                    <h2 className="font-body text-2xl text-foreground/80 uppercase tracking-widest">
                        {campaign?.title}
                    </h2>
                </div>
                
                <div className="p-4 md:p-0 min-h-[calc(100vh-10rem)]">
                    <div className="text-center mb-8 md:mb-12">
                        <h1 className="text-4xl md:text-7xl font-headline uppercase tracking-widest">
                            {activeThread.title}
                        </h1>
                        {activeThread.audioUrl && (
                            <div className="mt-4 flex justify-center items-center">
                                <audio ref={audioRef} src={activeThread.audioUrl} onEnded={handleAudioEnded} />
                                <RusticIconButton
                                    tooltip={isPlaying ? 'Pausar' : 'Reproducir'}
                                    onClick={togglePlayPause}
                                    className="w-24 h-24 text-white/90 hover:text-white"
                                >
                                    {isPlaying ? <Pause size={48} /> : <Play size={48} />}
                                </RusticIconButton>
                            </div>
                        )}
                    </div>

                    <div className="prose prose-xl prose-invert max-w-none text-foreground/90 leading-relaxed">
                        <div 
                            className="relative aspect-[4/3] md:w-3/5 image-mask-squared float-left mr-8 mb-4"
                            data-ai-hint={activeThread.imageAiHint || "fantasy scene"}
                        >
                             <Image
                                src={imageUrl}
                                alt={activeThread.title}
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover"
                            />
                        </div>
                        <div dangerouslySetInnerHTML={{ __html: activeThread.content }} />
                    </div>
                </div>

                <div className="mt-12">
                     <InteractiveSection title={t('narrativePlayerResponses')} backgroundColor="hsl(var(--secondary) / 0.5)">
                        <ThreadComments comments={activeThreadComments} t={t} />
                    </InteractiveSection>
                </div>
                
                <div className="mt-8">
                    <div className='backdrop-blur-lg rounded-lg'>
                       <CommentForm onSubmit={handleAddComment} character={playerCharacter} t={t} />
                    </div>
                </div>

                <div className="h-24" />
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
                
                {(canGoPrev || canGoNext) && <div className="h-6 w-px bg-white/20" />}

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
                    <SheetHeader className="p-4">
                        <SheetTitle className="font-headline text-2xl text-white">{campaign?.title}</SheetTitle>
                    </SheetHeader>
                    <div className="p-2">
                       { isMaster ? 
                         <GmSidebarContent onClick={() => setIsMenuSheetOpen(false)} /> : 
                         <PlayerSidebarContent onClick={() => setIsMenuSheetOpen(false)} />
                       }
                    </div>
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


const GmControls = ({ isAITurn, isGenerating, onGenerate, onRedo, onRestart, lastPrompt, activePlayers, commentingPlayers, hasThreads, t }: { 
    isAITurn: boolean;
    isGenerating: boolean;
    onGenerate: () => void;
    onRedo: () => void;
    onRestart: () => void;
    lastPrompt: any;
    activePlayers: Character[];
    commentingPlayers: Set<string>;
    hasThreads: boolean;
    t: (key: string) => string
}) => (
    <div className="p-4 rounded-lg bg-card/50 backdrop-blur-sm sticky bottom-4 space-y-4">
        <div className="flex gap-2">
            <Button onClick={onGenerate} disabled={!isAITurn || isGenerating} className="flex-1">
                <Bot className="mr-2"/>
                {isGenerating ? t('narrativeGenerating') : t('narrativeGenerateNext')}
            </Button>
            <Dialog>
                <DialogTrigger asChild>
                    <RusticIconButton tooltip={t('narrativeAddManually')} className="text-white/90 hover:text-white">
                        <Plus size={24} />
                    </RusticIconButton>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('narrativeNotImplemented')}</DialogTitle>
                        <DialogDescription>
                            {t('narrativeNotImplementedDesc')}
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
        <div className="flex justify-between items-center">
            {!isAITurn && hasThreads && (
                <p className="text-sm text-white/60 self-center">
                    {t('narrativeWaitingFor', { players: activePlayers.filter(p => !commentingPlayers.has(p.userId)).map(p => p.name).join(', ') })}
                </p>
            )}
            <div className="flex gap-2 ml-auto">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm" disabled={!lastPrompt}>
                            <FileText className="mr-2"/> {t('narrativeViewPrompt')}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-3xl">
                        <DialogHeader>
                            <DialogTitle className="font-headline">{t('narrativeLastPrompt')}</DialogTitle>
                            <DialogDescription>{t('narrativeLastPromptDesc')}</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 max-h-[60vh] overflow-y-auto p-4 bg-muted/50 rounded-md">
                            <div>
                                <h4 className="font-bold text-lg">{t('narrativeSystemPrompt')}</h4>
                                <pre className="text-xs whitespace-pre-wrap font-mono bg-background/50 p-2 rounded">{lastPrompt?.systemPrompt}</pre>
                            </div>
                            <div>
                                <h4 className="font-bold text-lg">{t('narrativeCampaignId')}</h4>
                                <pre className="text-xs whitespace-pre-wrap font-mono bg-background/50 p-2 rounded">{lastPrompt?.campaignId}</pre>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
                <Button variant="outline" size="sm" onClick={onRedo} disabled={isGenerating || !hasThreads}>
                    <RotateCcw className="mr-2"/> {t('narrativeRedo')}
                </Button>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" disabled={isGenerating || !hasThreads}>
                            <Trash2 className="mr-2"/> {t('narrativeRestart')}
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>{t('narrativeRestartConfirm')}</AlertDialogTitle>
                            <AlertDialogDescription>
                                {t('narrativeRestartConfirmDesc')}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>{t('charactersCancel')}</AlertDialogCancel>
                            <AlertDialogAction onClick={onRestart}>{t('narrativeRestart')}</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    </div>
);



