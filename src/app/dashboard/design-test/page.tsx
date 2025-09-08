
"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/context/auth-context";
import { Character, NarrativeThread } from "@/lib/firebase/types";
import { getCharactersByCampaign } from "@/lib/firebase/characters";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { ArrowLeft, ArrowRight, ChevronsRight } from "lucide-react";
import { RusticIconButton } from "@/components/ui/rustic-icon-button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { initialMonsters } from "./../monsters/page";


const ExpectedFile = ({ name }: { name: string }) => (
    <div className="absolute top-2 right-2 bg-black/50 text-white text-xs p-1 rounded font-mono z-20">
        /public/{name}
    </div>
  );

export default function DesignTestPage() {
  const { user, campaign, isLoading: isAuthLoading } = useAuth();
  const [character, setCharacter] = useState<Character | null>(null);
  const [narrativeThreads, setNarrativeThreads] = useState<NarrativeThread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeThreadIndex, setActiveThreadIndex] = useState(0);

  const mockEnemy = initialMonsters[1];

  useEffect(() => {
    if (isAuthLoading || !user || !campaign) return;

    setIsLoading(true);
    
    // Fetch character
    getCharactersByCampaign(campaign.id, user.id).then(userChars => {
        if (userChars.length > 0) {
            setCharacter(userChars[0]);
        }
    }).catch(error => {
        console.error("Failed to fetch character:", error);
    });

    // Fetch narrative threads (real-time)
    const narrativeQuery = query(
        collection(db, "narrativeThreads"),
        where("campaignId", "==", campaign.id),
        orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(narrativeQuery, (snapshot) => {
        if (!snapshot.empty) {
            const threads = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NarrativeThread));
            setNarrativeThreads(threads);
            setActiveThreadIndex(threads.length - 1); // Default to the latest thread
        }
        setIsLoading(false);
    }, (error) => {
        console.error("Failed to fetch narrative threads:", error);
        setIsLoading(false);
    });

    return () => unsubscribe();

  }, [user, campaign, isAuthLoading]);

  const activeThread = useMemo(() => {
      return narrativeThreads.length > 0 ? narrativeThreads[activeThreadIndex] : null;
  }, [narrativeThreads, activeThreadIndex]);

  const handlePrevThread = () => {
    setActiveThreadIndex(prev => Math.max(0, prev - 1));
  };
  const handleNextThread = () => {
    setActiveThreadIndex(prev => Math.min(narrativeThreads.length - 1, prev + 1));
  };
  const handleGoToLatest = () => {
    setActiveThreadIndex(narrativeThreads.length - 1);
  };

  if (isLoading || isAuthLoading) {
      return (
        <div className="relative min-h-[calc(100vh-10rem)] w-full p-4 md:p-6 bg-cover bg-center">
            <div className="grid grid-cols-[35%_minmax(0,1fr)_35%] grid-rows-[40%_minmax(0,1fr)] h-[85vh] gap-6">
                {/* Column 1: Narrative Panel */}
                <div className="row-span-2"><Skeleton className="h-full w-full" /></div>
                {/* Column 2: Center Panel */}
                <div className="col-start-2 row-span-2 relative">
                    <div className="absolute inset-x-[-12.5%] h-full w-[125%] z-10 flex flex-col gap-6">
                        <Skeleton className="flex-1" />
                        <Skeleton className="flex-1" />
                    </div>
                </div>
                 {/* Column 3, Row 1: Character Panel */}
                <div className="col-start-3"><Skeleton className="h-full w-full" /></div>
                {/* Column 3, Row 2: Tabs Panel */}
                <div className="col-start-3 row-start-2"><Skeleton className="h-full w-full" /></div>
            </div>
        </div>
      )
  }

  return (
    <div 
        className="relative min-h-[calc(100vh-10rem)] w-full p-4 md:p-6 bg-cover bg-center"
        style={{ backgroundImage: "url('/ui/backgrounds/dark-wood-texture.jpg')" }}
        data-ai-hint="dark wood texture"
    >
        <div className="relative grid grid-cols-[35%_minmax(0,1fr)_35%] grid-rows-[40%_minmax(0,1fr)] h-[85vh] gap-x-6">

            {/* Column 1: Narrative Panel */}
            <div className="row-span-2">
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
            
            {/* Column 2: Floating Center Panel */}
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
                        <ExpectedFile name="monsters/human-spawn.png" />
                        <div className="absolute bottom-2 left-2 right-2 bg-black/50 p-2 text-center">
                            <p className="font-headline text-lg text-white drop-shadow-md">{mockEnemy.name}</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Column 3, Row 1: Character Panel */}
            <div className="col-start-3">
                {character ? (
                     <Card 
                        className="h-full border-2 border-stone-500 backdrop-blur-sm relative overflow-hidden bg-cover bg-center"
                        style={{ backgroundImage: "url('/ui/backgrounds/player-panel-background.jpg')"}}
                        data-ai-hint="leather texture"
                     >
                        <Image src={character.portrait} alt={character.name} fill className="object-cover object-top opacity-30" data-ai-hint={character.aiHint} />
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
                    <Card className="h-full border-2 border-stone-500 backdrop-blur-sm relative overflow-hidden bg-cover bg-center">
                        <CardContent><p className="text-white">No active character for this user.</p></CardContent>
                    </Card>
                )}
            </div>
            
            {/* Column 3, Row 2: Tabs Panel */}
            <div className="col-start-3 row-start-2">
                <Card 
                    className="h-full border-2 border-amber-800/50 bg-cover bg-center relative" 
                    style={{ backgroundImage: "url('/ui/backgrounds/tabs-panel-background.jpg')"}}
                    data-ai-hint="old paper"
                >
                    <Tabs defaultValue="chat" className="h-full flex flex-col p-4">
                        <TabsList className="bg-transparent justify-start gap-4">
                            <TabsTrigger value="chat" className="text-xl data-[state=active]:bg-black/10 data-[state=active]:shadow-inner text-black/70 data-[state=active]:text-black font-headline">CHAT</TabsTrigger>
                            <TabsTrigger value="notes" className="text-xl data-[state=active]:bg-black/10 data-[state=active]:shadow-inner text-black/70 data-[state=active]:text-black font-headline">NOTES</TabsTrigger>
                            <TabsTrigger value="comments" className="text-xl data-[state=active]:bg-black/10 data-[state=active]:shadow-inner text-black/70 data-[state=active]:text-black font-headline">COMMENTS</TabsTrigger>
                        </TabsList>
                        <TabsContent value="chat" className="flex-1 mt-4">
                            <p className="text-black/80">Chat content goes here.</p>
                        </TabsContent>
                        <TabsContent value="notes" className="flex-1 mt-4">
                             <p className="text-black/80">Player notes go here.</p>
                        </TabsContent>
                        <TabsContent value="comments" className="flex-1 mt-4">
                             <p className="text-black/80">Narrative comments go here.</p>
                        </TabsContent>
                    </Tabs>
                </Card>
            </div>
        </div>
    </div>
  );
}

    