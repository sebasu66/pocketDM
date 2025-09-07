
"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock Data - In a real implementation, this would come from your context or API
const mockCharacter = {
    name: "Elara Nightshade",
    portraitUrl: "https://picsum.photos/400/600?random=15",
    portraitHint: "fantasy elf rogue",
    stats: { FUE: 12, AGI: 18, CAR: 16, INT: 14, SAB: 10 },
    story: "Orphaned and raised on the streets of a sprawling metropolis, Elara honed her skills in the shadows, surviving by her wits and quick fingers. She trusts few and keeps her motives close to her chest."
};

const mockLocation = {
    name: "Winter's Reach",
    imageUrl: "https://picsum.photos/600/800?random=25",
    imageHint: "snowy mountain city"
};

const mockEnemy = {
    name: "Crawling Horror",
    imageUrl: "https://picsum.photos/600/800?random=35",
    imageHint: "skeletal monster sketch"
}

export default function DesignTestPage() {
  return (
    <div 
        className="relative min-h-[calc(100vh-10rem)] w-full p-4 md:p-6 bg-cover bg-center"
        style={{ backgroundImage: "url('/dark-wood-texture.jpg')" }}
        data-ai-hint="dark wood texture"
    >
        {/* We use a grid to define the main areas, and then absolute positioning for layering */}
        <div className="grid grid-cols-[35%_minmax(0,1fr)_35%] grid-rows-[40%_minmax(0,1fr)] h-full gap-6">

            {/* Column 1: Narrative Panel */}
            <div className="row-span-2">
                <Card className="h-full bg-cover bg-center border-0" style={{ backgroundImage: "url('/parchment.jpg')"}}>
                    <ScrollArea className="h-full rounded-md">
                        <CardContent className="p-8 text-black font-serif">
                            <CardTitle className="text-4xl font-headline text-center mb-2">BOTÁNICA OCULTA</CardTitle>
                            <CardDescription className="text-center text-lg text-black mb-6">BELLADONA</CardDescription>

                            <div className="flex justify-center my-6">
                                <Image src="https://picsum.photos/300/200?random=45" width={300} height={200} alt="Belladona" data-ai-hint="botanical illustration" className="border-2 border-black/20" />
                            </div>
                            
                            <h3 className="text-xl font-bold font-headline mb-4">La Belladona y el Vuelo de las Brujas</h3>
                            <div className="space-y-4 text-justify leading-relaxed">
                                <p>
                                    Ha sido históricamente referida como el "elixir de las brujas" debido a sus propiedades altamente tóxicas y alucinógenas.
                                </p>
                                <p>
                                    En la Edad Media, era usada por las Brujas en sus ungüentos y pociones para inducir estados de trance y visiones.
                                </p>
                                <p>
                                    Los alcaloides presentes en la belladona, pueden causar delirios, alucinaciones y una sensación de vuelo, lo que alimentó su reputación mística y su asociación con prácticas mágicas y ocultas.
                                </p>
                            </div>
                        </CardContent>
                    </ScrollArea>
                </Card>
            </div>
            
            {/* Column 2: Empty Spacer for the floating panel */}
            <div className="col-start-2 row-span-2 relative">
                {/* Floating Red Panel */}
                <div className="absolute inset-x-[-12.5%] h-full w-[125%] z-10 flex flex-col gap-6">
                    <Card 
                        className="flex-1 border-2 border-stone-600 p-4 flex items-center justify-center bg-cover bg-center"
                        style={{ backgroundImage: "url('/stone-panel-background.jpg')"}}
                        data-ai-hint="dark stone texture"
                    >
                         <div className="relative w-full h-full border-4 border-stone-500 shadow-lg">
                            <Image src={mockLocation.imageUrl} alt={mockLocation.name} fill className="object-cover" data-ai-hint={mockLocation.imageHint}/>
                            <div className="absolute bottom-2 left-2 right-2 bg-black/50 p-2 text-center">
                                <p className="font-headline text-lg text-white drop-shadow-md">{mockLocation.name}</p>
                            </div>
                        </div>
                    </Card>
                     <Card 
                        className="flex-1 border-2 border-stone-600 p-4 flex items-center justify-center bg-cover bg-center"
                        style={{ backgroundImage: "url('/stone-panel-background.jpg')"}}
                        data-ai-hint="dark stone texture"
                    >
                        <div className="relative w-full h-full" style={{
                            maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 60%, transparent 100%)',
                            WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 60%, transparent 100%)'
                        }}>
                            <Image src={mockEnemy.imageUrl} alt={mockEnemy.name} fill className="object-contain" data-ai-hint={mockEnemy.imageHint}/>
                            <div className="absolute bottom-2 left-2 right-2 bg-black/50 p-2 text-center">
                                <p className="font-headline text-lg text-white drop-shadow-md">{mockEnemy.name}</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Column 3, Row 1: Character Panel */}
            <div className="col-start-3">
                 <Card 
                    className="h-full border-2 border-stone-500 backdrop-blur-sm relative overflow-hidden bg-cover bg-center"
                    style={{ backgroundImage: "url('/player-panel-background.jpg')"}}
                    data-ai-hint="leather texture"
                 >
                    <Image src={mockCharacter.portraitUrl} alt={mockCharacter.name} fill className="object-cover object-top opacity-30" data-ai-hint={mockCharacter.portraitHint} />
                    <div className="relative h-full flex flex-col justify-between p-6 text-white">
                        <CardHeader className="p-0">
                            <CardTitle className="font-headline text-5xl tracking-widest text-right">CHARACTER</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 text-right space-y-4">
                            <div>
                                <h4 className="font-headline text-2xl tracking-wider">STATS:</h4>
                                <ul className="font-mono text-lg">
                                    {Object.entries(mockCharacter.stats).map(([key, value]) => (
                                        <li key={key}>{key}: {value}</li>
                                    ))}
                                </ul>
                            </div>
                             <div>
                                <h4 className="font-headline text-2xl tracking-wider">STORY:</h4>
                                <p className="text-base text-stone-300 italic">"{mockCharacter.story}"</p>
                            </div>
                        </CardContent>
                    </div>
                </Card>
            </div>
            
            {/* Column 3, Row 2: Tabs Panel */}
            <div className="col-start-3 row-start-2">
                <Card 
                    className="h-full border-2 border-amber-800/50 bg-cover bg-center" 
                    style={{ backgroundImage: "url('/tabs-panel-background.jpg')"}}
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
