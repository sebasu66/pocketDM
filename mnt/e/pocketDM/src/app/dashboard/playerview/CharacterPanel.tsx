"use client";

import { Character } from "@/lib/firebase/types";
import Image from "next/image";
import { Coins, Backpack, ScrollText, Heart, Zap, Award, Target, Users, Scroll } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useEffect, useRef, useState } from "react";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";

interface CharacterPanelProps {
  character: Character;
  t: (key: string) => string;
}

export function CharacterPanel({ character, t }: CharacterPanelProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);
  const [isVideoPaused, setIsVideoPaused] = useState(false);

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

  // Get inventory directly from character (Firestore data)
  const inventory = character.inventory || [];

  // Money - using gold field
  const money = character.gold || 0;

  // Get enriched context for stats, quests, NPCs, objectives
  const context = character.enriched_context;

  // Video loop with 2-second pause
  useEffect(() => {
    const video = videoRef.current;
    if (!video || videoError) return;

    const handleVideoEnd = () => {
      setIsVideoPaused(true);
      setTimeout(() => {
        setIsVideoPaused(false);
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current.play().catch(err => {
            console.error("Error playing video:", err);
            setVideoError(true);
          });
        }
      }, 2000); // 2 second pause
    };

    video.addEventListener('ended', handleVideoEnd);

    return () => {
      if (video) {
        video.removeEventListener('ended', handleVideoEnd);
      }
    };
  }, [videoError]);

  return (
    <div className="h-full w-full overflow-y-auto relative bg-slate-900">
      {/* Full-width Video Background - Upper Section */}
      <div className="relative w-full h-[50vh] md:h-[55vh] overflow-hidden">
        {!videoError ? (
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            muted
            playsInline
            onError={() => setVideoError(true)}
          >
            <source
              src={`/characters/VisualPreset/${encodeURIComponent(character.visualPreset)}/${encodeURIComponent(character.visualPreset)}_live.mp4`}
              type="video/mp4"
            />
          </video>
        ) : (
          <ImageWithFallback
            baseSrc={`/characters/VisualPreset/${encodeURIComponent(character.visualPreset)}/portrait`}
            alt={character.name}
            fill
            className="object-cover"
            priority
          />
        )}

        {/* Dark gradient overlay at bottom of video */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/80" />

        {/* Character Name - Positioned over video */}
        <div className="absolute bottom-8 left-0 right-0 text-center z-10">
          <h2 className="font-headline text-3xl md:text-5xl uppercase tracking-wider text-amber-100 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
            {character.name}
          </h2>
          <p className="text-sm md:text-lg text-amber-200/90 mt-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            {character.race} • {t('charactersLevel')} {character.level || 1}
          </p>
        </div>
      </div>

      {/* Parchment Paper Stats Section - Overlapping bottom of video */}
      <div className="relative -mt-16 px-3 md:px-6 pb-6 z-20">
        <div
          className="relative bg-[url('/ui/parchment.jpg')] bg-cover bg-center rounded-lg shadow-2xl border-2 border-amber-900/50"
          style={{
            backgroundBlendMode: 'multiply',
            backgroundColor: 'rgba(245, 222, 179, 0.95)'
          }}
        >
          <div className="p-4 md:p-6">
            {/* Stats Summary from enriched_context */}
            {context?.stats && (
              <>
                <div className="mb-6">
                  <h3 className="font-headline text-xl uppercase tracking-wide text-stone-900 mb-3 flex items-center gap-2">
                    <Award size={20} />
                    Estado del Personaje
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="bg-amber-900/10 rounded px-3 py-2 border border-amber-900/20">
                      <div className="text-xs uppercase text-stone-600 font-semibold">Rango</div>
                      <div className="text-xl font-bold text-stone-900 capitalize">{context.stats.rank}</div>
                    </div>
                    <div className="bg-amber-900/10 rounded px-3 py-2 border border-amber-900/20">
                      <div className="text-xs uppercase text-stone-600 font-semibold flex items-center gap-1">
                        <Heart size={12} /> Heridas
                      </div>
                      <div className="text-xl font-bold text-red-700">{context.stats.wounds}/3</div>
                    </div>
                    <div className="bg-amber-900/10 rounded px-3 py-2 border border-amber-900/20">
                      <div className="text-xs uppercase text-stone-600 font-semibold flex items-center gap-1">
                        <Zap size={12} /> Fatiga
                      </div>
                      <div className="text-xl font-bold text-yellow-700">{context.stats.fatigue}</div>
                    </div>
                    <div className="bg-amber-900/10 rounded px-3 py-2 border border-amber-900/20">
                      <div className="text-xs uppercase text-stone-600 font-semibold">Bennies</div>
                      <div className="text-xl font-bold text-blue-700">{context.stats.bennies}</div>
                    </div>
                    <div className="bg-amber-900/10 rounded px-3 py-2 border border-amber-900/20">
                      <div className="text-xs uppercase text-stone-600 font-semibold">Gloria</div>
                      <div className="text-xl font-bold text-purple-700">{context.stats.glory}</div>
                    </div>
                    <div className="bg-amber-900/10 rounded px-3 py-2 border border-amber-900/20">
                      <div className="text-xs uppercase text-stone-600 font-semibold">XP</div>
                      <div className="text-xl font-bold text-green-700">{context.stats.experience_points}</div>
                    </div>
                  </div>
                </div>
                <Separator className="my-4 bg-amber-900/30" />
              </>
            )}

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
              {inventory.length > 0 ? (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {inventory.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="bg-amber-900/10 rounded px-3 py-2 border border-amber-900/20"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-stone-900">
                            {item.item || item.name || 'Item'}
                          </div>
                          {item.notes && (
                            <div className="text-xs text-stone-600 mt-1">{item.notes}</div>
                          )}
                        </div>
                        {item.quantity > 1 && (
                          <div className="text-xs bg-amber-900/20 px-2 py-1 rounded ml-2">
                            x{item.quantity}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-stone-600 italic">Sin objetos en inventario</p>
              )}
            </div>

            {/* Active Quests */}
            {context?.active_quests && context.active_quests.length > 0 && (
              <>
                <Separator className="my-4 bg-amber-900/30" />
                <div className="mb-6">
                  <h3 className="font-headline text-lg uppercase tracking-wide text-stone-900 mb-3 flex items-center gap-2">
                    <Target size={18} />
                    Misiones Activas
                  </h3>
                  <div className="space-y-3">
                    {context.active_quests.map((quest) => (
                      <div key={quest.id} className="bg-amber-900/10 rounded px-3 py-3 border border-amber-900/20">
                        <h4 className="font-headline text-base text-amber-900 mb-1">{quest.name}</h4>
                        {quest.description && (
                          <p className="text-sm text-stone-700 mb-2">{quest.description}</p>
                        )}
                        {quest.progress && (
                          <div className="mt-2 pt-2 border-t border-amber-900/20">
                            <p className="text-xs text-stone-600 mb-1">Progreso:</p>
                            <p className="text-sm text-stone-900 italic">{quest.progress}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Known NPCs */}
            {context?.known_npcs && context.known_npcs.length > 0 && (
              <>
                <Separator className="my-4 bg-amber-900/30" />
                <div className="mb-6">
                  <h3 className="font-headline text-lg uppercase tracking-wide text-stone-900 mb-3 flex items-center gap-2">
                    <Users size={18} />
                    NPCs Conocidos
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {context.known_npcs.map((npc) => (
                      <div key={npc.id} className="bg-amber-900/10 rounded px-3 py-2 border border-amber-900/20">
                        <h4 className="font-headline text-sm text-amber-900">{npc.name}</h4>
                        {npc.title && (
                          <p className="text-xs text-stone-600 italic">{npc.title}</p>
                        )}
                        {npc.role && (
                          <p className="text-sm text-stone-800 mt-1">{npc.role}</p>
                        )}
                        {npc.location && (
                          <p className="text-xs text-stone-600 mt-1">📍 {npc.location}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Current Objectives */}
            {context?.current_objectives && context.current_objectives.length > 0 && (
              <>
                <Separator className="my-4 bg-amber-900/30" />
                <div className="mb-6">
                  <h3 className="font-headline text-lg uppercase tracking-wide text-stone-900 mb-3 flex items-center gap-2">
                    <Scroll size={18} />
                    Objetivos Actuales
                  </h3>
                  <div className="space-y-2">
                    {context.current_objectives.map((obj, idx) => (
                      <div key={idx} className="bg-amber-900/10 rounded px-3 py-2 border border-amber-900/20">
                        <p className="text-xs text-amber-900 font-headline mb-1">{obj.quest_name}</p>
                        <p className="text-sm text-stone-900">{obj.objective}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Context Update Timestamp */}
            {context?.context_updated_at && (
              <p className="text-center text-xs text-stone-500 mt-4">
                Actualizado: {new Date(context.context_updated_at).toLocaleString('es-ES')}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
