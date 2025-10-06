
"use client";

import { useEffect, useState, useMemo, useRef } from 'react';
import { useAuth } from '@/context/auth-context';
import { Unsubscribe } from 'firebase/firestore';
import type { Character } from '@/lib/firebase/types';
import { addCharacterComment } from '@/lib/firebase/comments';
import { listenToCharacterNarrative, getLatestNarrativeNode, NarrativeNode } from '@/lib/firebase/narrative';
import { getCharactersByCampaign } from '@/lib/firebase/characters';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, ArrowRight, Menu, User as UserIcon, X, Plus, Trash2, Play, Pause } from 'lucide-react';
import { RusticIconButton } from '@/components/ui/rustic-icon-button';
import { useI18n } from '@/context/i18n-context';
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import Image from 'next/image';
import { CommentForm } from './CommentForm';
import { useToast } from '@/hooks/use-toast';
import { CharacterSheet } from './CharacterSheet';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogTrigger, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { GmSidebarContent, PlayerSidebarContent } from '../layout';
import { useRouter } from 'next/navigation';


export default function PlayerViewPage() {
    const { user, campaign, isLoading: isAuthLoading, activeRole } = useAuth();
    const { t, locale } = useI18n();
    const { toast } = useToast();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [narrativeNodes, setNarrativeNodes] = useState<NarrativeNode[]>([]);
    const [activeNodeIndex, setActiveNodeIndex] = useState(0);
    const [isMenuSheetOpen, setIsMenuSheetOpen] = React.useState(false);
    const [isCharacterSheetOpen, setIsCharacterSheetOpen] = React.useState(false);
    const [playerCharacter, setPlayerCharacter] = useState<Character | null>(null);
    const [allCharacters, setAllCharacters] = useState<Character[]>([]);
    
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const isInitialLoad = useRef(true);

    const isMaster = activeRole === 'gm';

    const activePlayers = useMemo(() => allCharacters.filter(c => c.isActive), [allCharacters]);

    const activeNode = useMemo(() => {
        return narrativeNodes.length > 0 ? narrativeNodes[activeNodeIndex] : null;
    }, [narrativeNodes, activeNodeIndex]);

    // Effect to fetch characters and set up narrative listener
    useEffect(() => {
        if (!campaign || !user) return;
        let unsubscribe: Unsubscribe | undefined;

        const setup = async () => {
            setIsLoading(true);
            try {
                const characters = await getCharactersByCampaign(campaign.id);
                setAllCharacters(characters);

                const userChar = characters.find(c => c.userId === user.id);
                setPlayerCharacter(userChar || null);

                if (!isMaster && !userChar && !isAuthLoading && user.role.isPlayer) {
                    toast({
                        title: "Character Needed",
                        description: "You must create a character before viewing the narrative.",
                        variant: "destructive"
                    });
                    router.push('/dashboard/characters');
                    return;
                }

                // Listen to character_narrative for player's character
                if (userChar) {
                    unsubscribe = listenToCharacterNarrative(
                        userChar.id,
                        (nodes) => {
                            const oldNodeCount = narrativeNodes.length;
                            setNarrativeNodes(nodes);

                            if (isInitialLoad.current) {
                                setActiveNodeIndex(nodes.length - 1); // Show latest node
                                isInitialLoad.current = false;
                            } else if (nodes.length > oldNodeCount) {
                                setActiveNodeIndex(nodes.length - 1); // Jump to new node
                            }
                            setIsLoading(false);
                        },
                        20 // Limit to 20 nodes
                    );
                } else {
                    setIsLoading(false);
                }

            } catch (error) {
                console.error("Error setting up playerview:", error);
                toast({
                    variant: "destructive",
                    title: "Error de Conexión",
                    description: "No se pudieron cargar los nodos narrativos. Verifica la consola para más detalles."
                });
                setIsLoading(false);
            }
        };

        setup();

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [campaign?.id, user?.id]);
    
    // Effect to reset audio when node changes
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setIsPlaying(false);
        }
    }, [activeNode]);

    const latestNode = useMemo(() => narrativeNodes.length > 0 ? narrativeNodes[narrativeNodes.length - 1] : null, [narrativeNodes]);

    // Players can respond if they're on the latest node and their character is active
    const canPlayerRespond = !isMaster && playerCharacter?.isActive && latestNode && activeNodeIndex === narrativeNodes.length - 1;

    const handlePrev = () => {
        setActiveNodeIndex(prev => Math.max(0, prev - 1));
    };

    const handleNext = () => {
        setActiveNodeIndex(prev => Math.min(narrativeNodes.length - 1, prev + 1));
    };
    
    const handleAddComment = async (text: string) => {
        if (!user || !playerCharacter || !latestNode) return;

        try {
          await addCharacterComment({
            character_id: playerCharacter.id,
            player_id: user.id,
            text: text,
            current_node_id: latestNode.node_id,
            location_id: playerCharacter.location_cell_id
          });
          toast({
            title: t('narrativeCommentSubmitted'),
            description: t('waitingForDM')
          });
        } catch (error) {
          toast({ variant: "destructive", title: "Error", description: t('narrativeErrorPost')});
        }
    };
    
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

  const handleRestart = async () => {
    if (!campaign) return;
    toast({ title: t('narrativeRestarting'), description: t('narrativeRestartingDesc')});
    // TODO: Implement narrative restart for character_narrative structure
    toast({ variant: "destructive", title: "Not Implemented", description: "Restart functionality needs to be updated for new architecture" });
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
    
    if (!activeNode) {
        return (
             <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
                <h1 className="text-4xl font-headline uppercase tracking-widest">{t('notFoundTitle')}</h1>
                <p className="mt-4 text-foreground/70">{t('narrativeNotStarted')}</p>
                 {isMaster && (
                    <div className="mt-8">
                        <GmControls
                            onRestart={handleRestart}
                            hasNodes={narrativeNodes.length > 0}
                            t={t}
                        />
                    </div>
                )}
            </div>
        )
    }

    const canGoNext = activeNodeIndex < narrativeNodes.length - 1;
    const canGoPrev = activeNodeIndex > 0;

    const imageUrl = '/locations/default_location.jpg'; // TODO: Get image from location data

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
                            {activeNode.location.location_name}
                        </h1>
                        {activeNode.audio_url && activeNode.audio_status === 'ready' && (
                            <div className="mt-4 flex justify-center items-center">
                                <audio ref={audioRef} src={activeNode.audio_url} onEnded={handleAudioEnded} />
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
                            data-ai-hint="fantasy scene"
                        >
                             <Image
                                src={imageUrl}
                                alt={activeNode.location.location_name}
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover"
                            />
                        </div>
                        <div dangerouslySetInnerHTML={{ __html: activeNode.narrative_html }} />
                    </div>
                </div>

                <div className="mt-8">
                    {canPlayerRespond && (
                        <div className='backdrop-blur-lg rounded-lg'>
                           <CommentForm
                                onSubmit={handleAddComment}
                                character={playerCharacter}
                                quickOptions={activeNode.quick_options.map(opt => opt.text)}
                                t={t}
                            />
                        </div>
                    )}
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


const GmControls = ({ onRestart, hasNodes, t }: {
    onRestart: () => void;
    hasNodes: boolean;
    t: (key: string) => string
}) => (
    <div className="p-4 rounded-lg bg-card/50 backdrop-blur-sm sticky bottom-4 space-y-4">
        <div className="flex justify-between items-center">
             <p className="text-sm text-white/60 self-center">
                Waiting for player actions or new remote narrative posts.
            </p>
            <div className="flex gap-2 ml-auto">
                <Dialog>
                    <DialogTrigger asChild>
                         <Button variant="outline" size="sm">
                            <Plus className="mr-2"/> Add Manual Post
                        </Button>
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

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" disabled={!hasNodes}>
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
