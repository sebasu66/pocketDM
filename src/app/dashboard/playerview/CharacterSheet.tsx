
"use client";

import { Sparkles } from "lucide-react";
import type { Character } from "@/lib/firebase/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { ReferenceItem } from "@/components/ui/ReferenceItem";

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
                    <p className="text-lg text-white/70">
                        {t('charactersLevel')} {character.level}{' '}
                        <ReferenceItem term={character.race || 'Unknown'} collection="razas">
                            <span className="underline decoration-dotted cursor-pointer">{character.race}</span>
                        </ReferenceItem>
                        {' '}/{' '}
                        <ReferenceItem term={character.class || 'Adventurer'} collection="characterCategories">
                            <span className="underline decoration-dotted cursor-pointer">{character.class}</span>
                        </ReferenceItem>
                    </p>
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
                        <StatDisplay label="AGI" value={character.attributes?.agility} />
                        <StatDisplay label="SMA" value={character.attributes?.smarts} />
                        <StatDisplay label="SPI" value={character.attributes?.spirit} />
                        <StatDisplay label="STR" value={character.attributes?.strength} />
                        <StatDisplay label="VIG" value={character.attributes?.vigor} />
                    </div>
                </div>

                {character.skills && (
                    <>
                        <Separator className="bg-white/20" />
                        <div>
                            <h2 className="font-headline text-2xl tracking-wider mb-4">Habilidades</h2>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                {Object.entries(character.skills).map(([skill, value]) => (
                                    <div key={skill} className="flex justify-between">
                                        <ReferenceItem term={skill} collection="habilidades" />
                                        <span>{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                 {character.edges && character.edges.length > 0 && (
                    <>
                        <Separator className="bg-white/20" />
                        <div>
                            <h2 className="font-headline text-2xl tracking-wider mb-4">Ventajas</h2>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                                {character.edges.map((edge) => (
                                    <li key={edge}><ReferenceItem term={edge} collection="edges" /></li>
                                ))}
                            </ul>
                        </div>
                    </>
                )}
                
                {character.hindrances && character.hindrances.length > 0 && (
                    <>
                        <Separator className="bg-white/20" />
                        <div>
                            <h2 className="font-headline text-2xl tracking-wider mb-4">Desventajas</h2>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                                {character.hindrances.map((hindrance) => (
                                     <li key={hindrance}><ReferenceItem term={hindrance} collection="hindrances" /></li>
                                ))}
                            </ul>
                        </div>
                    </>
                )}

                {character.inventory && character.inventory.length > 0 && (
                     <>
                        <Separator className="bg-white/20" />
                        <div>
                            <h2 className="font-headline text-2xl tracking-wider mb-4">Inventario</h2>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                                {character.inventory.map((item, index) => (
                                    <li key={index}>
                                        <ReferenceItem term={item.item} collection="hellfrost_items" />
                                        {item.quantity > 1 && ` (x${item.quantity})`}
                                        {item.notes && <span className="text-white/70 italic"> - {item.notes}</span>}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </>
                )}

                <div className="pb-20"></div>

            </div>
        </ScrollArea>
    );
}


const StatDisplay = ({ label, value }: { label: string; value?: string | number }) => (
    <div className="flex flex-col items-center p-2 rounded-lg bg-black/20 border border-white/10">
        <span className="text-xs font-bold text-white/60">{label}</span>
        <span className="text-2xl font-bold font-headline">{value || 'd4'}</span>
    </div>
);
