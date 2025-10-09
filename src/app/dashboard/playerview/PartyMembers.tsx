import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Character } from '@/lib/firebase/types';
import Image from 'next/image';
import { Users, MapPin, Heart } from 'lucide-react';

interface PartyMembersProps {
    characters: Character[];
    currentCharacterId?: string;
    t: (key: string) => string;
}

export function PartyMembers({ characters, currentCharacterId, t }: PartyMembersProps) {
    // Filter out the current character to show only other party members
    const partyMembers = characters.filter(c =>
        c.id !== currentCharacterId && c.isActive
    );

    if (partyMembers.length === 0) {
        return null; // Don't show the section if no party members
    }

    return (
        <Card className="bg-stone-gradient border-0 mt-8">
            <CardHeader>
                <CardTitle className="font-headline text-2xl uppercase tracking-widest text-center flex items-center justify-center gap-2">
                    <Users className="w-6 h-6" />
                    {t('partyMembersTitle')}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {partyMembers.map((member) => (
                        <div
                            key={member.id}
                            className="bg-background/30 rounded-lg p-4 border border-foreground/10 hover:border-foreground/20 transition-colors"
                        >
                            {/* Character Portrait */}
                            <div className="flex items-start gap-3 mb-3">
                                {member.visualPreset && (
                                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-amber-600 flex-shrink-0">
                                        <Image
                                            src={`/characters/VisualPreset/${member.visualPreset}/portrait.png`}
                                            alt={member.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-headline text-lg text-amber-400 truncate">
                                        {member.name}
                                    </h3>
                                    {member.race && (
                                        <p className="text-sm text-foreground/70">
                                            {member.race}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Character Stats */}
                            <div className="space-y-2 text-sm">
                                {/* Class/Level */}
                                {member.class && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-foreground/60">{t('partyMemberClass')}:</span>
                                        <span className="text-foreground/90 font-medium">
                                            {member.class} {member.level && `(${t('partyMemberLevel')} ${member.level})`}
                                        </span>
                                    </div>
                                )}

                                {/* Health/Wounds */}
                                {member.enriched_context?.stats && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-foreground/60 flex items-center gap-1">
                                            <Heart className="w-4 h-4" />
                                            Heridas:
                                        </span>
                                        <span className="text-foreground/90 font-medium">
                                            {member.enriched_context.stats.wounds}/3
                                        </span>
                                    </div>
                                )}

                                {/* Location */}
                                <div className="flex items-center gap-1 pt-2 border-t border-foreground/10">
                                    <MapPin className="w-4 h-4 text-foreground/60" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-foreground/60">
                                            {t('partyMemberLocation')}:
                                        </p>
                                        <p className="text-sm text-foreground/90 truncate">
                                            {member.enriched_context?.location_name ? (
                                                <span className="font-medium">{member.enriched_context.location_name}</span>
                                            ) : member.location_name ? (
                                                <span className="font-medium">{member.location_name}</span>
                                            ) : member.cell_id ? (
                                                <span className="font-medium">{member.cell_id}</span>
                                            ) : (
                                                <span className="italic">{t('partyMemberUnknownLocation')}</span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {partyMembers.length === 0 && (
                    <p className="text-center text-foreground/60 py-4">
                        {t('partyMembersEmpty')}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
