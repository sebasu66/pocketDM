
"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useAuth } from "@/context/auth-context";
import type { Character, NarrativeThread, EnrichedComment } from "@/lib/firebase/types";
import { getCharactersByCampaign } from "@/lib/firebase/characters";
import { getCommentsByThreadId, addNarrativeComment } from "@/lib/firebase/comments";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { ArrowLeft, ArrowRight, ChevronsRight } from "lucide-react";
import { RusticIconButton } from "@/components/ui/rustic-icon-button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { initialMonsters } from "@/app/dashboard/monsters/page";
import { ThreadComments } from "./ThreadComments";

const ExpectedFile = ({ name }: { name: string }) => (
    <div className="absolute top-2 right-2 bg-black/50 text-white text-xs p-1 rounded font-mono z-20">
        /public/{name}
    </div>
  );

export default function DesignTestPage() {
  const { user, campaign, isLoading: isAuthLoading } = useAuth();
  const [character, setCharacter] = useState<Character | null>(null);
  const [narrativeThreads, setNarrativeThreads] = useState<NarrativeThread[]>([]);
  const [comments, setComments] = useState<Record<string, EnrichedComment[]>>({});
  const [activePlayers, setActivePlayers] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeThreadIndex, setActiveThreadIndex] = useState(0);

  const mockEnemy = initialMonsters[1];

  const fetchCommentsForThread = useCallback(async (threadId: string) => {
    const threadComments = await getCommentsByThreadId(threadId);
    setComments(prev => ({ ...prev, [threadId]: threadComments }));
  }, []);


  useEffect(() => {
    if (isAuthLoading || !user || !campaign) return;

    setIsLoading(true);
    
    getCharactersByCampaign(campaign.id).then(allChars => {
        setActivePlayers(allChars.filter(c => c.isActive));
        const userChar = allChars.find(c => c.userId === user.id);
        if (userChar) {
            setCharacter(userChar);
        }
    }).catch(error => {
        console.error("Failed to fetch characters:", error);
    });

    const narrativeQuery = query(
        collection(db, "narrativeThreads"),
        where("campaignId", "==", campaign.id),
        orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(narrativeQuery, async (snapshot) => {
        if (!snapshot.empty) {
            const threads = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NarrativeThread));
            setNarrativeThreads(threads);
            setActiveThreadIndex(threads.length - 1);
            
            const newComments: Record<string, EnrichedComment[]> = {};
            for (const thread of threads) {
                const threadComments = await getCommentsByThreadId(thread.id);
                newComments[thread.id] = threadComments;
            }
            setComments(newComments);

        }
        setIsLoading(false);
    }, (error) => {
        console.error("Failed to fetch narrative threads:", error);
        setIsLoading(false);
    });

    return () => unsubscribe();

  }, [user, campaign, isAuthLoading, fetchCommentsForThread]);

  const activeThread = useMemo(() => {
      return narrativeThreads.length > 0 ? narrativeThreads[activeThreadIndex] : null;
  }, [narrativeThreads, activeThreadIndex]);
  
  const activeThreadComments = useMemo(() => {
    return activeThread ? comments[activeThread.id] || [] : [];
  }, [activeThread, comments]);

  const lastThread = useMemo(() => narrativeThreads.length > 0 ? narrativeThreads[narrativeThreads.length - 1] : null, [narrativeThreads]);
  
  const lastThreadComments = useMemo(() => {
      if (!lastThread) return [];
      return comments[lastThread.id] || [];
  }, [lastThread, comments]);

  const hasPlayerRespondedToLastThread = useMemo(() => {
    if (!user || !lastThreadComments) return false;
    return lastThreadComments.some(c => c.authorId === user.id);
  }, [user, lastThreadComments]);

  const allActivePlayersResponded = useMemo(() => {
      if (!activePlayers.length || !lastThreadComments) return false;
      const respondedPlayerIds = new Set(lastThreadComments.map(c => c.authorId));
      return activePlayers.every(p => respondedPlayerIds.has(p.userId));
  }, [activePlayers, lastThreadComments]);

  const isPlayerTurn = lastThread && !hasPlayerRespondedToLastThread && !allActivePlayersResponded;

  const handlePrevThread = () => {
    setActiveThreadIndex(prev => Math.max(0, prev - 1));
  };
  const handleNextThread = () => {
    setActiveThreadIndex(prev => Math.min(narrativeThreads.length - 1, prev + 1));
  };
  const handleGoToLatest = () => {
    setActiveThreadIndex(narrativeThreads.length - 1);
  };
  
  const handleAddComment = async (text: string, hiddenText: string) => {
      if (!user || !character || !lastThread) return;
      await addNarrativeComment({
          threadId: lastThread.id,
          authorId: user.id,
          characterId: character.id,
          text,
          hiddenText,
          createdAt: Date.now(),
      });
      await fetchCommentsForThread(lastThread.id);
  };


  if (isLoading || isAuthLoading) {
      return (
        <div className="relative min-h-[calc(100vh-10rem)] w-full p-4 md:p-6 bg-cover bg-center">
            <div className="relative h-[85vh]">
                <Skeleton className="absolute left-0 top-0 w-[38%] h-full" />
                <Skeleton className="absolute left-1/2 -translate-x-1/2 w-[25%] h-full z-10" />
                <Skeleton className="absolute right-0 top-0 w-[45%] h-[48%]" />
                <Skeleton className="absolute right-0 bottom-0 w-[45%] h-[48%]" />
            </div>
        </div>
      )
  }

  return (
    <div className="min-w-[1280px]">
        <div 
            className="relative min-h-[calc(100vh-10rem)] w-full p-4 md:p-6 bg-cover bg-center overflow-hidden"
            style={{ backgroundImage: "url('/ui/backgrounds/dark-wood-texture.jpg')" }}
            data-ai-hint="dark wood texture"
        >
            <div className="relative h-[85vh]">
                {/* Left Panel: Narrative */}
                <div className="absolute top-0 left-0 h-full w-[38%] p-4">
                    <Card className="h-full bg-cover bg-center border-0 relative flex flex-col" style={{ backgroundImage: "url('/ui/backgrounds/parchment.jpg')"}}>
                        <div className="flex-1 pt-[10%] p-8 text-black font-serif space-y-8 overflow-hidden">
                            {activeThread ? (
                                <ScrollArea className="w-full h-full whitespace-nowrap">
                                    <div className="pr-8 space-y-4 inline-block w-full">
                                        <CardTitle className="text-4xl font-headline text-center mb-2 whitespace-normal">{activeThread.title}</CardTitle>
                                        <CardDescription className="text-center text-lg text-black mb-6 whitespace-normal">
                                            Posted on {new Date(activeThread.createdAt).toLocaleDateString()} (Post {activeThreadIndex + 1}/{narrativeThreads.length})
                                        </CardDescription>
                                        <div className="space-y-4 text-justify leading-relaxed prose prose-lg prose-black whitespace-normal" dangerouslySetInnerHTML={{ __html: activeThread.content }}/>
                                    </div>
                                    <ScrollBar orientation="horizontal" />
                                </ScrollArea>
                            ) : (
                                <CardContent className="p-8 text-black font-serif">
                                    <CardTitle className="text-4xl font-headline text-center mb-2">No Narrative Yet</CardTitle>
                                </CardContent>
                            )}
                        </div>
                        <CardContent className="p-4 border-t-2 border-black/10 flex justify-center items-center gap-4">
                            <RusticIconButton tooltip="Previous Post" onClick={handlePrevThread} disabled={activeThreadIndex <= 0}>
                                <ArrowLeft />
                            </RusticIconButton>
                            <RusticIconButton tooltip="Go to Latest Post" onClick={handleGoToLatest} disabled={activeThreadIndex === narrativeThreads.length - 1}>
                            <ChevronsRight />
                            </RusticIconButton>
                            <RusticIconButton tooltip="Next Post" onClick={handleNextThread} disabled={activeThreadIndex >= narrativeThreads.length - 1}>
                            <ArrowRight />
                            </RusticIconButton>
                        </CardContent>
                    </Card>
                </div>
                
                {/* Center Floating Panel */}
                <div 
                    className="absolute left-1/2 -translate-x-1/2 w-[25%] h-full z-10 flex flex-col gap-6 p-4 bg-cover bg-center drop-shadow-2xl"
                    style={{ backgroundImage: "url('/ui/backgrounds/red-column-bkg.jpg')"}}
                    data-ai-hint="old red leather texture"
                >
                    <Card 
                        className="flex-1 border-2 border-stone-600 p-4 flex items-center justify-center bg-cover bg-center relative overflow-hidden"
                        style={{ backgroundImage: "url('/ui/backgrounds/stone-panel-background.jpg')"}}
                        data-ai-hint="dark stone texture"
                    >
                        <div className="relative w-full h-full border-4 border-stone-500 shadow-lg">
                            <Image 
                                src={activeThread?.imageUrl || '/locations/default_location.jpg'} 
                                alt={activeThread?.title || 'Default Location'} 
                                fill 
                                className="object-cover" 
                                data-ai-hint={activeThread?.imageAiHint || "fantasy landscape"}
                            />
                            {!activeThread?.imageUrl && <ExpectedFile name="locations/default_location.jpg" />}
                            <div className="absolute bottom-2 left-2 right-2 bg-black/50 p-2 text-center">
                                <p className="font-headline text-lg text-white drop-shadow-md">{activeThread?.title || 'A Quiet Place'}</p>
                            </div>
                        </div>
                    </Card>
                    <Card 
                        className="flex-1 border-2 border-stone-600 p-4 flex items-center justify-center bg-cover bg-center relative overflow-hidden"
                        style={{ backgroundImage: "url('/ui/backgrounds/stone-panel-background.jpg')"}}
                        data-ai-hint="dark stone texture"
                    >
                        <div className="relative w-full h-full" style={{
                            maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 60%, transparent 100%)',
                            WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 60%, transparent 100%)'
                        }}>
                            <Image src={mockEnemy.image} alt={mockEnemy.name} fill className="object-contain" data-ai-hint={mockEnemy.aiHint}/>
                            <div className="absolute bottom-2 left-2 right-2 bg-black/50 p-2 text-center">
                                <p className="font-headline text-lg text-white drop-shadow-md">{mockEnemy.name}</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right Side Panels */}
                <div className="absolute top-0 right-0 h-full w-[45%] flex flex-col gap-y-4">
                    {character ? (
                        <Card
                            className="h-[48%] border-0 backdrop-blur-sm relative overflow-hidden bg-contain bg-no-repeat bg-center"
                            style={{ backgroundImage: "url('/ui/backgrounds/player-panel-background.jpg')"}}
                            data-ai-hint="leather texture"
                        >
                            <div className="relative h-full flex flex-col justify-between p-6 text-white">
                                <CardHeader className="p-0">
                                    <CardTitle className="font-headline text-5xl tracking-widest text-right">{character.name.toUpperCase()}</CardTitle>
                                </CardHeader>
                                <CardContent className="p-0 text-right space-y-4">
                                    <div>
                                        <h4 className="font-headline text-2xl tracking-wider">STATS:</h4>
                                        <ul className="font-mono text-lg grid grid-cols-3 gap-x-4">
                                            <li>STR: {character.strength}</li>
                                            <li>DEX: {character.dexterity}</li>
                                            <li>CON: {character.constitution}</li>
                                            <li>INT: {character.intelligence}</li>
                                            <li>WIS: {character.wisdom}</li>
                                            <li>CHA: {character.charisma}</li>
                                        </ul>
                                    </div>
                                    {character.archetype && (
                                        <div>
                                            <h4 className="font-headline text-2xl tracking-wider">ARCHETYPE:</h4>
                                            <p className="text-lg font-bold">{character.archetype}</p>
                                            <p className="text-base text-stone-300 italic">"{character.archetypeDescription}"</p>
                                        </div>
                                    )}
                                </CardContent>
                            </div>
                        </Card>
                    ): (
                        <Card className="h-[48%] border-0 backdrop-blur-sm relative overflow-hidden bg-contain bg-no-repeat bg-center">
                            <CardContent><p className="text-white">No active character for this user.</p></CardContent>
                        </Card>
                    )}
                    
                    <Card 
                        className="h-[48%] border-0 bg-contain bg-no-repeat bg-center relative p-4 flex" 
                        style={{ backgroundImage: "url('/ui/backgrounds/tabs-panel-background.jpg')"}}
                        data-ai-hint="old paper"
                    >
                        <Tabs defaultValue="comments" className="flex-1 flex" orientation="vertical">
                            <div className="flex-1 h-full">
                                <TabsContent value="chat" className="mt-0 h-full">
                                    <p className="text-black/80">Chat content goes here.</p>
                                </TabsContent>
                                <TabsContent value="notes" className="mt-0 h-full">
                                    <p className="text-black/80">Player notes go here.</p>
                                </TabsContent>
                                <TabsContent value="comments" className="mt-0 h-full overflow-y-auto">
                                    <ThreadComments 
                                        comments={activeThreadComments}
                                        activePlayers={activePlayers}
                                        character={character}
                                        user={user}
                                        canRespond={activeThreadIndex === narrativeThreads.length - 1 && isPlayerTurn}
                                        allActivePlayersResponded={allActivePlayersResponded}
                                        onAddComment={handleAddComment}
                                    />
                                </TabsContent>
                            </div>
                            <TabsList className="flex-col h-auto bg-transparent w-32 items-stretch justify-start gap-2 pl-4">
                                <TabsTrigger value="chat" className="bookmark bookmark-chat">
                                    <span className="[writing-mode:vertical-lr]">CHAT</span>
                                </TabsTrigger>
                                <TabsTrigger value="notes" className="bookmark bookmark-notes">
                                    <span className="[writing-mode:vertical-lr]">NOTES</span>
                                </TabsTrigger>
                                <TabsTrigger value="comments" className="bookmark bookmark-comments relative">
                                    {isPlayerTurn && (
                                        <span className="absolute top-1 right-1 flex h-3 w-3">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                                        </span>
                                    )}
                                    <span className="[writing-mode:vertical-lr]">COMMENTS</span>
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </Card>
                </div>
            </div>
        </div>
    </div>
  );
}

    