
"use client";

import { useEffect, useState, useMemo, useRef } from 'react';
import { useAuth } from '@/context/auth-context';
import { useCampaign } from '@/context/campaign-context';
import { Unsubscribe } from 'firebase/firestore';
import type { Character } from '@/lib/firebase/types';
import { addCharacterComment, listenToCharacterComments, CharacterComment } from '@/lib/firebase/comments';
import { listenToCharacterNarrative, getLatestNarrativeNode, NarrativeNode } from '@/lib/firebase/narrative';
import { getCharactersByCampaign } from '@/lib/firebase/characters';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, ArrowRight, Menu, User as UserIcon, X, Plus, Trash2, Play, Pause, Wand2, Loader2, Volume2, AlertCircle, MessagesSquare } from 'lucide-react';
import { RusticIconButton } from '@/components/ui/rustic-icon-button';
import { useI18n } from '@/context/i18n-context';
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import Image from 'next/image';
import { CommentForm } from './CommentForm';
import { useToast } from '@/hooks/use-toast';
import { CharacterSheet } from './CharacterSheet';
import { PartyMembers } from './PartyMembers';
import { CharacterPanel } from './CharacterPanel';
import { ChatPanel } from '../components/ChatPanel';
import { useChatUnread } from '@/hooks/use-chat-unread';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogTrigger, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { GmSidebarContent, PlayerSidebarContent } from '../layout';
import { useRouter } from 'next/navigation';


export default function PlayerViewPage() {
    const { user, isLoading: isAuthLoading, activeRole } = useAuth();
    const { campaign } = useCampaign();
    const { t, locale } = useI18n();
    const { toast } = useToast();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [narrativeNodes, setNarrativeNodes] = useState<NarrativeNode[]>([]);
    const [activeNodeIndex, setActiveNodeIndex] = useState(0);
    const [isMenuSheetOpen, setIsMenuSheetOpen] = React.useState(false);
    const [isCharacterSheetOpen, setIsCharacterSheetOpen] = React.useState(false);
    const [currentPanel, setCurrentPanel] = useState<'character' | 'narrative' | 'map'>('narrative');
    const [playerCharacter, setPlayerCharacter] = useState<Character | null>(null);
    const [allCharacters, setAllCharacters] = useState<Character[]>([]);
    const [characterComments, setCharacterComments] = useState<CharacterComment[]>([]);

    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [hasBeenPlayed, setHasBeenPlayed] = useState(false);
    const isInitialLoad = useRef(true);
    const [animationTick, setAnimationTick] = useState(0);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const { unreadCount, markAsRead } = useChatUnread(campaign?.id, user?.id);

    const isMaster = activeRole === 'gm';

    const activePlayers = useMemo(() => allCharacters.filter(c => c.isActive), [allCharacters]);

    const activeNode = useMemo(() => {
        return narrativeNodes.length > 0 ? narrativeNodes[activeNodeIndex] : null;
    }, [narrativeNodes, activeNodeIndex]);

    const memoizedQuickOptions = useMemo(() => {
        return activeNode?.quick_options || [];
    }, [activeNode?.quick_options]);

    // Effect to fetch characters and set up narrative listener
    useEffect(() => {
        console.log("[PlayerView] Setup effect triggered. campaign:", campaign?.id, "user:", user?.id);
        if (!campaign || !user) {
            console.log("[PlayerView] Missing campaign or user, skipping setup");
            return;
        }
        let unsubscribe: Unsubscribe | undefined;
        let commentsUnsubscribe: Unsubscribe | undefined;

        const setup = async () => {
            console.log("[PlayerView] Starting setup...");
            setIsLoading(true);
            try {
                const characters = await getCharactersByCampaign(campaign.id);
                console.log("[PlayerView] Fetched characters:", characters.length, characters);
                setAllCharacters(characters);

                const userChar = characters.find(c => c.player_id === user.id);
                console.log("[PlayerView] Looking for player_id:", user.id);
                console.log("[PlayerView] User character:", userChar?.name || "none");
                setPlayerCharacter(userChar || null);

                // Listen to character_narrative for player's character
                if (userChar) {
                    console.log("[PlayerView] Setting up narrative listener for character:", userChar.id);
                    unsubscribe = listenToCharacterNarrative(
                        userChar.id,
                        (nodes) => {
                            console.log("[PlayerView] Narrative nodes updated:", nodes.length, "nodes");
                            const oldNodeCount = narrativeNodes.length;
                            setNarrativeNodes(nodes);

                            if (isInitialLoad.current) {
                                console.log("[PlayerView] Initial load, showing latest node");
                                setActiveNodeIndex(nodes.length - 1); // Show latest node
                                isInitialLoad.current = false;
                            } else if (nodes.length > oldNodeCount) {
                                console.log("[PlayerView] New node detected, jumping to latest");
                                setActiveNodeIndex(nodes.length - 1); // Jump to new node
                            }
                            setIsLoading(false);
                        },
                        20 // Limit to 20 nodes
                    );

                    // Listen to character_comments for the player's character
                    console.log("[PlayerView] Setting up comments listener for character:", userChar.id);
                    commentsUnsubscribe = listenToCharacterComments(
                        userChar.id,
                        (comments) => {
                            console.log("[PlayerView] Character comments updated:", comments.length, "comments");
                            setCharacterComments(comments);
                        }
                    );
                } else {
                    console.log("[PlayerView] No character found, showing campaign status");
                    // No character - show campaign status for both GMs and Players
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
            if (commentsUnsubscribe) {
                commentsUnsubscribe();
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

    // Animation ticker for loading frames
    useEffect(() => {
        if (campaign?.status === 'initializing') {
            const interval = setInterval(() => {
                setAnimationTick(t => t + 1);
            }, 500);
            return () => clearInterval(interval);
        }
    }, [campaign?.status]);

    const latestNode = useMemo(() => narrativeNodes.length > 0 ? narrativeNodes[narrativeNodes.length - 1] : null, [narrativeNodes]);

    // Players can respond if they're on the latest node and their character is active
    const canPlayerRespond = !isMaster && playerCharacter?.isActive && latestNode && activeNodeIndex === narrativeNodes.length - 1;

    // Process wiki tags [[term]] -> clickable links
    const processWikiTags = (html: string): string => {
        return html.replace(/\[\[([^\]]+)\]\]/g, (match, term) => {
            return `<a href="#" class="wiki-link text-amber-400 hover:text-amber-300 underline decoration-dotted cursor-pointer" data-wiki-term="${term}" title="Wiki: ${term}" onclick="event.preventDefault(); alert('Wiki: ${term.replace(/'/g, "\\'")} - Funcionalidad próximamente');">${term}</a>`;
        });
    };

    // Get status indicator based on campaign/node state
    const getStatusIndicator = () => {
        if (!activeNode) return null;

        const audioStatus = activeNode.audio_status;
        const audioUrl = activeNode.audio_url;
        const campaignStatus = campaign?.status;

        // Fix: If has audio_url, treat as ready regardless of status
        if (audioUrl && audioStatus !== 'failed') {
            return null; // Audio ready, no indicator needed
        }

        // Priority: audio_status first, then campaign status
        if (audioStatus === 'pending') {
            return { image: '/ui/status/tts.png', text: 'Generando audio...', className: 'animate-pulse' };
        }
        if (audioStatus === 'failed') {
            return { image: '/ui/status/error.png', text: 'Error en audio', className: '' };
        }
        if (campaignStatus === 'initializing') {
            // Cycle through loading animations
            const loadingFrame = (animationTick % 4) + 1;
            return { image: `/ui/status/loading${loadingFrame}.png`, text: 'Preparando...', className: '' };
        }
        if (campaignStatus === 'narrative_failed') {
            return { image: '/ui/status/error.png', text: 'Error en narrativa', className: '' };
        }

        return null; // No status to show when everything is ready
    };

    const statusIndicator = getStatusIndicator();

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
            location_id: playerCharacter.cell_id
          });

          // Optimistically update the latest node with the player's comment
          setNarrativeNodes(prev => {
            const updated = [...prev];
            const latestIndex = updated.length - 1;
            if (latestIndex >= 0) {
              updated[latestIndex] = {
                ...updated[latestIndex],
                player_comment: {
                  text: text,
                  timestamp: { toMillis: () => Date.now() } as any
                }
              };
            }
            return updated;
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
                setHasBeenPlayed(true); // Stop pulsing once played
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleAudioEnded = () => {
        setIsPlaying(false);
    };

    // Reset audio state when node changes
    useEffect(() => {
        setIsPlaying(false);
        setHasBeenPlayed(false);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    }, [activeNodeIndex]);

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
        // Show animated status based on campaign status
        const getCampaignStatusIndicator = () => {
            const campaignStatus = campaign?.status;

            if (campaignStatus === 'waiting_for_character') {
                return {
                    image: '/ui/status/loading1.png',
                    text: 'Esperando creación de personaje...',
                    className: 'animate-pulse'
                };
            }
            if (campaignStatus === 'ready' || campaignStatus === 'initializing') {
                // Cycle through loading animations
                const loadingFrame = (animationTick % 4) + 1;
                return {
                    image: `/ui/status/loading${loadingFrame}.png`,
                    text: 'Preparando campaña...',
                    className: ''
                };
            }
            if (campaignStatus === 'generating_narrative') {
                const loadingFrame = (animationTick % 4) + 1;
                return {
                    image: `/ui/status/loading${loadingFrame}.png`,
                    text: 'Generando narrativa inicial...',
                    className: ''
                };
            }
            if (campaignStatus === 'narrative_failed') {
                return {
                    image: '/ui/status/error.png',
                    text: 'Error al generar narrativa',
                    className: ''
                };
            }

            // Default: waiting
            return {
                image: '/ui/status/loading1.png',
                text: 'Iniciando campaña...',
                className: 'animate-pulse'
            };
        };

        const campaignStatusIndicator = getCampaignStatusIndicator();

        return (
             <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
                <h1 className="text-4xl font-headline uppercase tracking-widest mb-6">{campaign?.title || t('notFoundTitle')}</h1>

                {/* Animated Status Indicator */}
                <div className={`flex flex-col items-center justify-center gap-6 my-8 ${campaignStatusIndicator.className}`}>
                    <Image
                        src={campaignStatusIndicator.image}
                        alt={campaignStatusIndicator.text}
                        width={200}
                        height={200}
                        className="object-contain"
                    />
                    <p className="text-xl font-medium text-foreground/80">{campaignStatusIndicator.text}</p>
                </div>

                <p className="mt-4 text-foreground/70">{t('narrativeNotStarted')}</p>

                {/* Show create character button if user has no character */}
                {!playerCharacter && (
                    <div className="mt-8">
                        <Button
                            onClick={() => router.push('/dashboard/characters')}
                            size="lg"
                            className="bg-amber-600 hover:bg-amber-700 text-white"
                        >
                            {t('charactersCreate') || 'Create Character'}
                        </Button>
                        <p className="mt-3 text-sm text-foreground/60">
                            {t('narrativeNeedCharacter') || 'You need a character to start your adventure'}
                        </p>
                    </div>
                )}
            </div>
        )
    }

    const canGoNext = activeNodeIndex < narrativeNodes.length - 1;
    const canGoPrev = activeNodeIndex > 0;

    const imageUrl = '/locations/default_location.jpg'; // TODO: Get image from location data

    return (
        <div className="w-full h-screen flex overflow-hidden">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

            {/* Desktop: Side-by-side panels */}
            <div className="hidden lg:flex w-full h-full">
                {/* Character Panel - Left Side (Desktop) */}
                {playerCharacter && (
                    <div className="w-80 xl:w-96 min-w-[320px] max-w-[400px] h-full z-20 bg-slate-900 shadow-2xl overflow-hidden">
                        <CharacterPanel character={playerCharacter} t={t} />
                    </div>
                )}

                {/* Campaign Title Column */}
                <div className="flex items-center justify-center p-4 z-10 bg-leather-column drop-shadow-2xl">
                    <h2 className="font-headline text-2xl text-foreground/80 [writing-mode:vertical-rl] rotate-180 uppercase tracking-widest">
                        {campaign?.title}
                    </h2>
                </div>

                {/* Main Narrative Panel */}
                <div className="flex-1 md:p-8 z-10 overflow-y-auto min-w-0">

                <div className="p-4 md:p-0 min-h-[calc(100vh-10rem)]">
                    <div className="text-center mb-8 md:mb-12">
                        <h1 className="text-4xl md:text-7xl font-headline uppercase tracking-widest">
                            {activeNode.location.location_name}
                        </h1>

                        {/* Status Indicator */}
                        {statusIndicator && (
                            <div className={`flex items-center justify-center gap-3 mt-3 ${statusIndicator.className}`}>
                                <Image
                                    src={statusIndicator.image}
                                    alt={statusIndicator.text}
                                    width={32}
                                    height={32}
                                    className="object-contain"
                                />
                                <span className="text-sm font-medium text-foreground/80">{statusIndicator.text}</span>
                            </div>
                        )}

                        {/* Hidden audio element */}
                        {activeNode.audio_url && (
                            <audio ref={audioRef} src={activeNode.audio_url} onEnded={handleAudioEnded} />
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
                        <div dangerouslySetInnerHTML={{ __html: processWikiTags(activeNode.narrative_html) }} />
                    </div>
                </div>

                <div className="mt-8">
                    {activeNode?.player_comment ? (
                        <Card className="bg-stone-gradient border-0">
                            <CardHeader>
                                <CardTitle className="font-headline text-2xl uppercase tracking-widest text-center">
                                    {t('narrativeYourAction')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-background/30 rounded-lg p-4 border border-foreground/10">
                                    <p className="text-foreground/90 italic">"{activeNode.player_comment.text}"</p>
                                    <p className="text-xs text-foreground/50 mt-2">
                                        {new Date(activeNode.player_comment.timestamp.toMillis()).toLocaleString()}
                                    </p>
                                </div>
                                <p className="text-center text-sm text-foreground/60 mt-4">
                                    {t('waitingForDM')}
                                </p>
                            </CardContent>
                        </Card>
                    ) : canPlayerRespond && (
                        <div className='backdrop-blur-lg rounded-lg'>
                           <CommentForm
                                onSubmit={handleAddComment}
                                character={playerCharacter}
                                quickOptions={memoizedQuickOptions}
                                t={t}
                            />
                        </div>
                    )}
                </div>

                {/* Party Members Section */}
                <PartyMembers
                    characters={allCharacters}
                    currentCharacterId={playerCharacter?.id}
                    t={t}
                />

                <div className="h-24" />
                </div>
            </div>

            {/* Mobile: Swipe horizontal between panels */}
            <div className="lg:hidden w-full h-full flex overflow-x-hidden relative">
                {/* Mobile Campaign Title Header */}
                <div className="absolute top-0 left-0 right-0 z-20 text-center h-16 flex items-center justify-center bg-leather-column drop-shadow-2xl">
                    <h2 className="font-body text-xl text-foreground/80 uppercase tracking-widest">
                        {campaign?.title}
                    </h2>
                </div>

                {/* Swipeable Container */}
                <div
                    className="flex transition-transform duration-300 ease-out h-full w-full pt-16"
                    style={{
                        transform: currentPanel === 'character' ? 'translateX(0%)' :
                                   currentPanel === 'narrative' ? 'translateX(-100%)' :
                                   'translateX(-200%)',
                        width: '300%' // 3 panels
                    }}
                >
                    {/* Character Panel */}
                    {playerCharacter && (
                        <div className="w-1/3 h-full overflow-y-auto">
                            <CharacterPanel character={playerCharacter} t={t} />
                        </div>
                    )}

                    {/* Narrative Panel (duplicated content from desktop) */}
                    <div className="w-1/3 h-full overflow-y-auto p-4">
                        <div className="min-h-[calc(100vh-10rem)]">
                            <div className="text-center mb-8">
                                <h1 className="text-3xl md:text-5xl font-headline uppercase tracking-widest">
                                    {activeNode.location.location_name}
                                </h1>

                                {statusIndicator && (
                                    <div className={`flex items-center justify-center gap-3 mt-3 ${statusIndicator.className}`}>
                                        <Image
                                            src={statusIndicator.image}
                                            alt={statusIndicator.text}
                                            width={32}
                                            height={32}
                                            className="object-contain"
                                        />
                                        <span className="text-sm font-medium text-foreground/80">{statusIndicator.text}</span>
                                    </div>
                                )}

                                {activeNode.audio_url && activeNode.audio_status === 'ready' && (
                                    <div className="mt-4 flex justify-center items-center">
                                        <audio ref={audioRef} src={activeNode.audio_url} onEnded={handleAudioEnded} />
                                        <RusticIconButton
                                            tooltip={isPlaying ? 'Pausar' : 'Reproducir'}
                                            onClick={togglePlayPause}
                                            className="w-20 h-20 text-white/90 hover:text-white"
                                        >
                                            {isPlaying ? <Pause size={36} /> : <Play size={36} />}
                                        </RusticIconButton>
                                    </div>
                                )}
                            </div>

                            <div className="prose prose-lg prose-invert max-w-none text-foreground/90 leading-relaxed">
                                <div
                                    className="relative aspect-[4/3] w-full image-mask-squared float-left mr-4 mb-4"
                                    data-ai-hint="fantasy scene"
                                >
                                    <Image
                                        src={imageUrl}
                                        alt={activeNode.location.location_name}
                                        fill
                                        sizes="100vw"
                                        className="object-cover"
                                    />
                                </div>
                                <div dangerouslySetInnerHTML={{ __html: processWikiTags(activeNode.narrative_html) }} />
                            </div>

                            <div className="mt-8">
                                {activeNode?.player_comment ? (
                                    <Card className="bg-stone-gradient border-0">
                                        <CardHeader>
                                            <CardTitle className="font-headline text-xl uppercase tracking-widest text-center">
                                                {t('narrativeYourAction')}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="bg-background/30 rounded-lg p-4 border border-foreground/10">
                                                <p className="text-foreground/90 italic">"{activeNode.player_comment.text}"</p>
                                                <p className="text-xs text-foreground/50 mt-2">
                                                    {new Date(activeNode.player_comment.timestamp.toMillis()).toLocaleString()}
                                                </p>
                                            </div>
                                            <p className="text-center text-sm text-foreground/60 mt-4">
                                                {t('waitingForDM')}
                                            </p>
                                        </CardContent>
                                    </Card>
                                ) : canPlayerRespond && (
                                    <div className='backdrop-blur-lg rounded-lg'>
                                        <CommentForm
                                            onSubmit={handleAddComment}
                                            character={playerCharacter}
                                            quickOptions={memoizedQuickOptions}
                                            t={t}
                                        />
                                    </div>
                                )}
                            </div>

                            <PartyMembers
                                characters={allCharacters}
                                currentCharacterId={playerCharacter?.id}
                                t={t}
                            />

                            <div className="h-24" />
                        </div>
                    </div>

                    {/* Map Panel (placeholder for now) */}
                    <div className="w-1/3 h-full overflow-y-auto p-4 flex items-center justify-center">
                        <div className="text-center">
                            <h2 className="text-2xl font-headline text-foreground/80">MAP</h2>
                            <p className="text-foreground/60 mt-2">Próximamente</p>
                        </div>
                    </div>
                </div>

                {/* Panel Navigation Indicators */}
                <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-30 flex gap-2">
                    {playerCharacter && (
                        <button
                            onClick={() => setCurrentPanel('character')}
                            className={`w-2 h-2 rounded-full transition-all ${
                                currentPanel === 'character' ? 'bg-amber-400 w-6' : 'bg-white/30'
                            }`}
                            aria-label="Character panel"
                        />
                    )}
                    <button
                        onClick={() => setCurrentPanel('narrative')}
                        className={`w-2 h-2 rounded-full transition-all ${
                            currentPanel === 'narrative' ? 'bg-amber-400 w-6' : 'bg-white/30'
                        }`}
                        aria-label="Narrative panel"
                    />
                    <button
                        onClick={() => setCurrentPanel('map')}
                        className={`w-2 h-2 rounded-full transition-all ${
                            currentPanel === 'map' ? 'bg-amber-400 w-6' : 'bg-white/30'
                        }`}
                        aria-label="Map panel"
                    />
                </div>
            </div>

            {/* Top Right Character Icon */}
            <div className="fixed top-6 right-6 z-30">
                <RusticIconButton
                    tooltip={t('charactersViewEditSheet')}
                    onClick={() => setIsCharacterSheetOpen(true)}
                    className="text-white/90 hover:text-white bg-black/20 backdrop-blur-sm"
                    disabled={!playerCharacter}
                >
                    <UserIcon />
                </RusticIconButton>
            </div>

            {/* Bottom Right Controls */}
            <div className="fixed bottom-6 right-6 z-30 flex h-14 items-center gap-2 rounded-full bg-black/20 p-2 backdrop-blur-sm">
                {/* Audio Button */}
                {activeNode?.audio_url && (
                    <>
                        <RusticIconButton
                            tooltip={
                                activeNode.audio_status === 'generating'
                                    ? 'Generando audio...'
                                    : isPlaying
                                        ? 'Pausar'
                                        : 'Reproducir'
                            }
                            onClick={togglePlayPause}
                            className={`
                                ${activeNode.audio_status === 'ready' && !hasBeenPlayed ? 'animate-pulse' : ''}
                                ${activeNode.audio_status === 'ready' ? 'text-green-500 hover:text-green-400' : 'text-white/90 hover:text-white'}
                            `}
                            disabled={activeNode.audio_status !== 'ready'}
                        >
                            {isPlaying ? <Pause /> : <Volume2 />}
                        </RusticIconButton>
                        <div className="h-6 w-px bg-white/20" />
                    </>
                )}

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

                <div className="relative">
                    <RusticIconButton
                        tooltip="Chat"
                        onClick={() => setIsChatOpen(true)}
                        className="text-white/90 hover:text-white"
                    >
                        <MessagesSquare />
                    </RusticIconButton>
                    {unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </div>
                    )}
                </div>

                <div className="h-6 w-px bg-white/20" />

                <RusticIconButton
                    tooltip="Toggle Menu"
                    onClick={() => setIsMenuSheetOpen(true)}
                    className="text-white/90 hover:text-white"
                >
                    <Menu />
                </RusticIconButton>
            </div>

            {/* Chat Panel */}
            {isChatOpen && (
                <ChatPanel
                    onClose={() => setIsChatOpen(false)}
                    onOpen={markAsRead}
                />
            )}

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
