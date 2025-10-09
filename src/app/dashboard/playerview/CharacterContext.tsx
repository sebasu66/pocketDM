import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Character } from '@/lib/firebase/types';
import { Scroll, Users, Target, Package, Heart, Award, Zap } from 'lucide-react';

interface CharacterContextProps {
    character: Character;
    t: (key: string) => string;
}

export function CharacterContext({ character, t }: CharacterContextProps) {
    const context = character.enriched_context;

    if (!context) {
        return null; // No enriched context yet
    }

    return (
        <div className="space-y-6 mt-8">
            {/* Stats Summary */}
            <Card className="bg-stone-gradient border-0">
                <CardHeader>
                    <CardTitle className="font-headline text-xl uppercase tracking-widest text-center flex items-center justify-center gap-2">
                        <Award className="w-5 h-5" />
                        Estado del Personaje
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="bg-background/30 rounded-lg p-3 border border-foreground/10">
                            <p className="text-xs text-foreground/60 mb-1">Rango</p>
                            <p className="text-lg font-headline text-amber-400 capitalize">{context.stats.rank}</p>
                        </div>
                        <div className="bg-background/30 rounded-lg p-3 border border-foreground/10">
                            <p className="text-xs text-foreground/60 mb-1 flex items-center gap-1">
                                <Heart className="w-3 h-3" /> Heridas
                            </p>
                            <p className="text-lg font-headline text-red-400">{context.stats.wounds}/3</p>
                        </div>
                        <div className="bg-background/30 rounded-lg p-3 border border-foreground/10">
                            <p className="text-xs text-foreground/60 mb-1 flex items-center gap-1">
                                <Zap className="w-3 h-3" /> Fatiga
                            </p>
                            <p className="text-lg font-headline text-yellow-400">{context.stats.fatigue}</p>
                        </div>
                        <div className="bg-background/30 rounded-lg p-3 border border-foreground/10">
                            <p className="text-xs text-foreground/60 mb-1">Bennies</p>
                            <p className="text-lg font-headline text-blue-400">{context.stats.bennies}</p>
                        </div>
                        <div className="bg-background/30 rounded-lg p-3 border border-foreground/10">
                            <p className="text-xs text-foreground/60 mb-1">Gloria</p>
                            <p className="text-lg font-headline text-purple-400">{context.stats.glory}</p>
                        </div>
                        <div className="bg-background/30 rounded-lg p-3 border border-foreground/10">
                            <p className="text-xs text-foreground/60 mb-1">XP</p>
                            <p className="text-lg font-headline text-green-400">{context.stats.experience_points}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Active Quests */}
            {context.active_quests.length > 0 && (
                <Card className="bg-stone-gradient border-0">
                    <CardHeader>
                        <CardTitle className="font-headline text-xl uppercase tracking-widest text-center flex items-center justify-center gap-2">
                            <Target className="w-5 h-5" />
                            Misiones Activas
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {context.active_quests.map((quest) => (
                                <div
                                    key={quest.id}
                                    className="bg-background/30 rounded-lg p-4 border border-foreground/10"
                                >
                                    <h4 className="font-headline text-lg text-amber-400 mb-1">{quest.name}</h4>
                                    {quest.description && (
                                        <p className="text-sm text-foreground/70 mb-2">{quest.description}</p>
                                    )}
                                    {quest.progress && (
                                        <div className="mt-2 pt-2 border-t border-foreground/10">
                                            <p className="text-xs text-foreground/60 mb-1">Progreso:</p>
                                            <p className="text-sm text-foreground/90 italic">{quest.progress}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Known NPCs */}
            {context.known_npcs.length > 0 && (
                <Card className="bg-stone-gradient border-0">
                    <CardHeader>
                        <CardTitle className="font-headline text-xl uppercase tracking-widest text-center flex items-center justify-center gap-2">
                            <Users className="w-5 h-5" />
                            NPCs Conocidos
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {context.known_npcs.map((npc) => (
                                <div
                                    key={npc.id}
                                    className="bg-background/30 rounded-lg p-3 border border-foreground/10"
                                >
                                    <h4 className="font-headline text-base text-amber-400">{npc.name}</h4>
                                    {npc.title && (
                                        <p className="text-xs text-foreground/60 italic">{npc.title}</p>
                                    )}
                                    {npc.role && (
                                        <p className="text-sm text-foreground/80 mt-1">{npc.role}</p>
                                    )}
                                    {npc.location && (
                                        <p className="text-xs text-foreground/60 mt-1">📍 {npc.location}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Inventory */}
            {context.inventory.length > 0 && (
                <Card className="bg-stone-gradient border-0">
                    <CardHeader>
                        <CardTitle className="font-headline text-xl uppercase tracking-widest text-center flex items-center justify-center gap-2">
                            <Package className="w-5 h-5" />
                            Inventario
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {context.inventory.map((item, idx) => (
                                <div
                                    key={idx}
                                    className={`bg-background/30 rounded-lg p-3 border ${
                                        item.equipped
                                            ? 'border-amber-600/50 bg-amber-900/10'
                                            : 'border-foreground/10'
                                    }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h4 className="font-medium text-foreground/90 flex items-center gap-2">
                                                {item.name}
                                                {item.equipped && (
                                                    <span className="text-xs bg-amber-600 text-white px-2 py-0.5 rounded">
                                                        Equipado
                                                    </span>
                                                )}
                                            </h4>
                                            <p className="text-xs text-foreground/60 capitalize">{item.type}</p>
                                            {item.description && (
                                                <p className="text-sm text-foreground/70 mt-1">{item.description}</p>
                                            )}
                                        </div>
                                        {item.quantity > 1 && (
                                            <span className="text-sm font-medium text-foreground/80 ml-2">
                                                x{item.quantity}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Current Objectives */}
            {context.current_objectives.length > 0 && (
                <Card className="bg-stone-gradient border-0">
                    <CardHeader>
                        <CardTitle className="font-headline text-xl uppercase tracking-widest text-center flex items-center justify-center gap-2">
                            <Scroll className="w-5 h-5" />
                            Objetivos Actuales
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {context.current_objectives.map((obj, idx) => (
                                <div
                                    key={idx}
                                    className="bg-background/30 rounded-lg p-3 border border-foreground/10"
                                >
                                    <p className="text-xs text-amber-400 font-headline mb-1">{obj.quest_name}</p>
                                    <p className="text-sm text-foreground/90">{obj.objective}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            <p className="text-center text-xs text-foreground/40">
                Actualizado: {new Date(context.context_updated_at).toLocaleString('es-ES')}
            </p>
        </div>
    );
}
