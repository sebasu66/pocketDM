
"use client";

import { Sparkles } from "lucide-react";
import type { Character } from "@/lib/firebase/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";

interface CharacterSheetProps {
    character: Character;
    t: (key: string) => string;
}

export function CharacterSheet({ character, t }: CharacterSheetProps) {

    return (
        <ScrollArea className="h-full w-full">
            <div className="p-6 space-y-6 text-white">
                <div className="relative aspect-[2/3] w-full rounded-lg overflow-hidden border-2 border-primary/30">
                    <ImageWithFallback
                        baseSrc={`/characters/VisualPreset/${character.visualPreset}/portrait`}
                        alt={character.name}
                        fill
                        className="object-cover"
                        data-ai-hint="fantasy portrait"
                    />
                </div>
                <div>
                    <h1 className="text-4xl font-headline tracking-wider">{character.name}</h1>
                    <p className="text-lg text-white/70">{t('charactersLevel')} {character.level} {character.class}</p>
                </div>

                <Separator className="bg-white/20" />

                <div>
                    <h2 className="font-headline text-2xl tracking-wider mb-2">{t('charactersDescription')}</h2>
                    <p className="text-white/80 leading-relaxed">{character.description}</p>
                </div>
                
                {character.archetype && (
                    <div>
                        <h2 className="font-headline text-2xl tracking-wider flex items-center gap-2"><Sparkles className="w-5 h-5 text-accent" />{t('charactersArchetype')}: {character.archetype}</h2>
                        <p className="text-white/80 italic">"{character.archetypeDescription}"</p>
                    </div>
                )}
                
                <Separator className="bg-white/20" />

                <div>
                    <h2 className="font-headline text-2xl tracking-wider mb-4">{t('charactersAttributes')}</h2>
                    <div className="grid grid-cols-3 gap-4">
                        <StatDisplay label="STR" value={character.strength} />
                        <StatDisplay label="DEX" value={character.dexterity} />
                        <StatDisplay label="CON" value={character.constitution} />
                        <StatDisplay label="INT" value={character.intelligence} />
                        <StatDisplay label="WIS" value={character.wisdom} />
                        <StatDisplay label="CHA" value={character.charisma} />
                    </div>
                </div>

                 <Separator className="bg-white/20" />

                <div className="space-y-4">
                    <h2 className="font-headline text-2xl tracking-wider">{t('charactersBehaviorProfile')}</h2>
                    <BehaviorDetail label={t('charactersPosition')} value={`${character.position || 0}/100`} description={`${t('charactersBackline')} <-> ${t('charactersFrontline')}`} />
                    <BehaviorDetail label={t('charactersResolve')} value={`${character.resolve || 0}/100`} description={`${t('charactersFlee')} <-> ${t('charactersFight')}`} />
                    <BehaviorDetail label={t('charactersAltruism')} value={`${character.altruism || 0}/100`} description={`${t('charactersSelfish')} <-> ${t('charactersGroupFirst')}`} />
                    <BehaviorDetail label={t('charactersDiscipline')} value={`${character.discipline || 0}/100`} description={`${t('charactersReckless')} <-> ${t('charactersTactical')}`} />
                </div>
                
                <div className="pb-20"></div>


            </div>
        </ScrollArea>
    );
}


const StatDisplay = ({ label, value }: { label: string; value: number }) => (
    <div className="flex flex-col items-center p-2 rounded-lg bg-black/20 border border-white/10">
        <span className="text-xs font-bold text-white/60">{label}</span>
        <span className="text-2xl font-bold font-headline">{value || 0}</span>
    </div>
);

const BehaviorDetail = ({ label, value, description }: {label: string, value: string, description: string}) => (
    <div>
        <div className="flex justify-between items-baseline">
            <h4 className="font-bold">{label}</h4>
            <p className="font-mono text-white/70">{value}</p>
        </div>
        <p className="text-xs text-white/60">{description}</p>
    </div>
)
