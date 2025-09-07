
"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/context/auth-context";
import { Character, NarrativeThread } from "@/lib/firebase/types";
import { getCharactersByCampaign } from "@/lib/firebase/characters";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/config";


// Mock Data - In a real implementation, this would come from your context or API
const mockEnemy = {
    name: "Crawling Horror",
    image: "/monsters/dire-wolf.png",
    aiHint: "skeletal monster sketch"
};

export default function DesignTestPage() {
  const { user, campaign, isLoading: isAuthLoading } = useAuth();
  const [character, setCharacter] = useState<Character | null>(null);
  const [narrativeThreads, setNarrativeThreads] = useState<NarrativeThread[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthLoading || !user || !campaign) return;

    const fetchPageData = async () => {
        setIsLoading(true);
        try {
            // Fetch character
            const userChars = await getCharactersByCampaign(campaign.id, user.id);
            if (userChars.length > 0) {
                setCharacter(userChars[0]);
            }

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
                }
            });

            return () => unsubscribe();
        } catch (error) {
            console.error("Failed to fetch design test data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    fetchPageData();

  }, [user, campaign, isAuthLoading]);

  const lastThread = useMemo(() => {
      return narrativeThreads.length > 0 ? narrativeThreads[narrativeThreads.length - 1] : null;
  }, [narrativeThreads]);

  const ExpectedFile = ({ name }: { name: string }) => (
    <div className="absolute top-2 right-2 bg-black/50 text-white text-xs p-1 rounded font-mono z-20">
        /public/{name}
    </div>
  );

  if (isLoading || isAuthLoading) {
      return <div className="text-white">Loading design test...</div>
  }

  return (
    <div 
        className="relative min-h-[calc(100vh-10rem)] w-full p-4 md:p-6 bg-cover bg-center"
        style={{ backgroundImage: "url('/ui/backgrounds/dark-wood-texture.jpg')" }}
        data-ai-hint="dark wood texture"
    >
        <ExpectedFile name="ui/backgrounds/dark-wood-texture.jpg" />
        {/* We use a grid to define the main areas, and then absolute positioning for layering */}
        <div className="grid grid-cols-[35%_minmax(0,1fr)_35%] grid-rows-[40%_minmax(0,1fr)] h-[85vh] gap-6">

            {/* Column 1: Narrative Panel */}
            <div className="row-span-2">
                <Card className="h-full bg-cover bg-center border-0 relative" style={{ backgroundImage: "url('/ui/backgrounds/parchment.jpg')"}}>
                    <ExpectedFile name="ui/backgrounds/parchment.jpg" />
                    <ScrollArea className="h-full rounded-md">
                        <div className="p-8 text-black font-serif space-y-8">
                            {narrativeThreads.length > 0 ? (
                                narrativeThreads.map((thread) => (
                                    <div key={thread.id} className="space-y-4">
                                        <CardTitle className="text-4xl font-headline text-center mb-2">{thread.title}</CardTitle>
                                        <CardDescription className="text-center text-lg text-black mb-6">
                                            Posted on {new Date(thread.createdAt).toLocaleDateString()}
                                        </CardDescription>
                                        <div className="space-y-4 text-justify leading-relaxed prose prose-lg prose-black" dangerouslySetInnerHTML={{ __html: thread.content }}/>
                                        
                                        {narrativeThreads.indexOf(thread) < narrativeThreads.length - 1 && (
                                            <hr className="border-black/20 my-8" />
                                        )}
                                    </div>
                                ))
                            ) : (
                                <CardContent className="p-8 text-black font-serif">
                                    <CardTitle className="text-4xl font-headline text-center mb-2">No Narrative Yet</CardTitle>
                                </CardContent>
                            )}
                        </div>
                    </ScrollArea>
                </Card>
            </div>
            
            {/* Column 2: Empty Spacer for the floating panel */}
            <div className="col-start-2 row-span-2 relative">
                {/* Floating Red Panel */}
                <div className="absolute inset-x-[-12.5%] h-full w-[125%] z-10 flex flex-col gap-6">
                    <Card 
                        className="flex-1 border-2 border-stone-600 p-4 flex items-center justify-center bg-cover bg-center relative"
                        style={{ backgroundImage: "url('/ui/backgrounds/stone-panel-background.jpg')"}}
                        data-ai-hint="dark stone texture"
                    >
                         <ExpectedFile name="ui/backgrounds/stone-panel-background.jpg" />
                         <div className="relative w-full h-full border-4 border-stone-500 shadow-lg">
                            {lastThread?.imageUrl && (
                                <>
                                    <Image src={lastThread.imageUrl} alt={lastThread.title} fill className="object-cover" data-ai-hint={lastThread.imageAiHint || "fantasy scene"}/>
                                    <div className="absolute bottom-2 left-2 right-2 bg-black/50 p-2 text-center">
                                        <p className="font-headline text-lg text-white drop-shadow-md">{lastThread.title}</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </Card>
                     <Card 
                        className="flex-1 border-2 border-stone-600 p-4 flex items-center justify-center bg-cover bg-center relative"
                        style={{ backgroundImage: "url('/ui/backgrounds/stone-panel-background.jpg')"}}
                        data-ai-hint="dark stone texture"
                    >
                        <ExpectedFile name="ui/backgrounds/stone-panel-background.jpg" />
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
            </div>

            {/* Column 3, Row 1: Character Panel */}
            <div className="col-start-3">
                {character ? (
                     <Card 
                        className="h-full border-2 border-stone-500 backdrop-blur-sm relative overflow-hidden bg-cover bg-center"
                        style={{ backgroundImage: "url('/ui/backgrounds/player-panel-background.jpg')"}}
                        data-ai-hint="leather texture"
                     >
                        <ExpectedFile name="ui/backgrounds/player-panel-background.jpg" />
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
                    <ExpectedFile name="ui/backgrounds/tabs-panel-background.jpg" />
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

