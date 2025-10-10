"use client";

import { Character } from "@/lib/firebase/types";
import Image from "next/image";
import { Coins, Backpack, ScrollText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface CharacterPanelProps {
  character: Character;
  t: (key: string) => string;
}

export function CharacterPanel({ character, t }: CharacterPanelProps) {
  // Parse Savage Worlds attributes
  const attributes = character.attributes || {
    agility: 'd4',
    smarts: 'd4',
    spirit: 'd4',
    strength: 'd4',
    vigor: 'd4'
  };

  // Parse skills
  const skills = character.skills || {};

  // Parse inventory from enriched_context or fallback to character.inventory
  const inventory = character.enriched_context?.inventory || character.inventory || [];
  const equippedItems = inventory.filter((item: any) => item.equipped || item.is_equipped);

  // Money - using gold field
  const money = character.gold || 0;

  return (
    <div className="h-full w-full overflow-y-auto bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Background atmospheric image */}
      <div className="relative w-full h-48 md:h-64 overflow-hidden">
        <Image
          src="/locations/character-bg.jpg"
          alt="Character background"
          fill
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900" />
      </div>

      {/* Character Portrait - Overlapping background */}
      <div className="relative -mt-24 md:-mt-32 px-4 md:px-6">
        <div className="relative w-48 h-64 md:w-56 md:h-80 mx-auto rounded-lg overflow-hidden border-4 border-amber-700/50 shadow-2xl">
          <Image
            src={`/characters/VisualPreset/${character.visualPreset}/portrait.jpg`}
            alt={character.name}
            fill
            className="object-cover"
            onError={(e) => {
              // Fallback to PNG if JPG fails
              const target = e.target as HTMLImageElement;
              target.src = `/characters/VisualPreset/${character.visualPreset}/portrait.png`;
            }}
          />
        </div>

        {/* Character Name */}
        <div className="text-center mt-4">
          <h2 className="font-headline text-3xl md:text-4xl uppercase tracking-wider text-amber-100 drop-shadow-lg">
            {character.name}
          </h2>
          <p className="text-sm md:text-base text-amber-200/70 mt-1">
            {character.race} • {t('charactersLevel')} {character.level || 1}
          </p>
        </div>
      </div>

      {/* Parchment Paper Stats Section */}
      <div className="relative mt-6 px-3 md:px-6 pb-6">
        <div
          className="relative bg-[url('/ui/parchment.jpg')] bg-cover bg-center rounded-lg shadow-2xl border-2 border-amber-900/50"
          style={{
            backgroundBlendMode: 'multiply',
            backgroundColor: 'rgba(245, 222, 179, 0.95)'
          }}
        >
          <div className="p-4 md:p-6">
            {/* Attributes Section */}
            <div className="mb-6">
              <h3 className="font-headline text-xl uppercase tracking-wide text-stone-900 mb-3 flex items-center gap-2">
                <ScrollText size={20} />
                {t('charactersAttributes')}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(attributes).map(([key, value]) => (
                  <div key={key} className="bg-amber-900/10 rounded px-3 py-2 border border-amber-900/20">
                    <div className="text-xs uppercase text-stone-600 font-semibold">{key}</div>
                    <div className="text-2xl font-bold text-stone-900">{String(value)}</div>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="my-4 bg-amber-900/30" />

            {/* Skills Section */}
            {Object.keys(skills).length > 0 && (
              <>
                <div className="mb-6">
                  <h3 className="font-headline text-lg uppercase tracking-wide text-stone-900 mb-3">
                    {t('characterSkills')}
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(skills).slice(0, 6).map(([skillName, skillValue]) => (
                      <div key={skillName} className="flex justify-between items-center text-sm">
                        <span className="text-stone-700 font-medium">{skillName}</span>
                        <span className="text-stone-900 font-bold bg-amber-900/10 px-2 py-1 rounded">
                          {String(skillValue)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <Separator className="my-4 bg-amber-900/30" />
              </>
            )}

            {/* Money Section */}
            <div className="mb-6">
              <h3 className="font-headline text-lg uppercase tracking-wide text-stone-900 mb-2 flex items-center gap-2">
                <Coins size={18} />
                Dinero
              </h3>
              <div className="bg-amber-900/10 rounded px-3 py-2 border border-amber-900/20">
                <div className="text-2xl font-bold text-amber-900">{money} mo</div>
              </div>
            </div>

            <Separator className="my-4 bg-amber-900/30" />

            {/* Inventory Section */}
            <div>
              <h3 className="font-headline text-lg uppercase tracking-wide text-stone-900 mb-3 flex items-center gap-2">
                <Backpack size={18} />
                {t('characterInventory')}
              </h3>
              {equippedItems.length > 0 ? (
                <div className="space-y-2">
                  {equippedItems.slice(0, 5).map((item: any, index: number) => (
                    <div
                      key={index}
                      className="bg-amber-900/10 rounded px-3 py-2 border border-amber-900/20"
                    >
                      <div className="text-sm font-medium text-stone-900">
                        {item.custom_name || item.name}
                      </div>
                      {item.category && (
                        <div className="text-xs text-stone-600">{item.category}</div>
                      )}
                    </div>
                  ))}
                  {equippedItems.length > 5 && (
                    <p className="text-xs text-stone-600 text-center mt-2">
                      +{equippedItems.length - 5} más...
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-stone-600 italic">Sin objetos equipados</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
