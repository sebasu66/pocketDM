"use client";

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { WikiLocation } from '@/lib/types/wiki';
import { WikiMarkdown } from './WikiMarkdown';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Crown, Hash } from 'lucide-react';

interface LocationDetailDialogProps {
  location: WikiLocation | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLocationClick?: (locationId: string) => void;
  onNpcClick?: (npcId: string) => void;
  onFactionClick?: (factionId: string) => void;
}

export function LocationDetailDialog({
  location,
  open,
  onOpenChange,
  onLocationClick,
  onNpcClick,
  onFactionClick
}: LocationDetailDialogProps) {

  if (!location) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[url('/ui/parchment.jpg')] bg-cover bg-center">
        <div
          className="absolute inset-0 rounded-lg"
          style={{
            backgroundBlendMode: 'multiply',
            backgroundColor: 'rgba(245, 222, 179, 0.95)'
          }}
        />

        <div className="relative z-10">
          <DialogHeader>
            <DialogTitle className="font-headline text-3xl text-stone-900 mb-2">
              {location.name}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Detalles sobre {location.name}
            </DialogDescription>
          </DialogHeader>

          {/* Metadata Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-4">
            {location.type && (
              <div className="bg-amber-900/10 rounded px-3 py-2 border border-amber-900/20">
                <div className="text-xs uppercase text-stone-600 font-semibold flex items-center gap-1">
                  <Hash size={12} />
                  Tipo
                </div>
                <div className="text-sm font-bold text-stone-900 capitalize">{location.type}</div>
              </div>
            )}

            {location.cell_id && (
              <div className="bg-amber-900/10 rounded px-3 py-2 border border-amber-900/20">
                <div className="text-xs uppercase text-stone-600 font-semibold flex items-center gap-1">
                  <MapPin size={12} />
                  Celda
                </div>
                <div className="text-sm font-bold text-stone-900">{location.cell_id}</div>
              </div>
            )}

            {location.population && (
              <div className="bg-amber-900/10 rounded px-3 py-2 border border-amber-900/20">
                <div className="text-xs uppercase text-stone-600 font-semibold flex items-center gap-1">
                  <Users size={12} />
                  Población
                </div>
                <div className="text-sm font-bold text-stone-900">{location.population}</div>
              </div>
            )}

            {location.ruler && (
              <div className="bg-amber-900/10 rounded px-3 py-2 border border-amber-900/20">
                <div className="text-xs uppercase text-stone-600 font-semibold flex items-center gap-1">
                  <Crown size={12} />
                  Gobernante
                </div>
                <div className="text-sm font-bold text-stone-900">{location.ruler}</div>
              </div>
            )}
          </div>

          {/* Tags Section */}
          {(location.nearby_locations.length > 0 || location.npcs.length > 0 || location.factions.length > 0) && (
            <div className="space-y-3 mb-6">
              {location.nearby_locations.length > 0 && (
                <div>
                  <div className="text-xs uppercase text-stone-600 font-semibold mb-2">
                    📍 Locaciones Cercanas
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {location.nearby_locations.map((locId) => (
                      <Badge
                        key={locId}
                        variant="outline"
                        className="cursor-pointer hover:bg-amber-900/20 text-xs"
                        onClick={() => onLocationClick?.(locId)}
                      >
                        {locId}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {location.npcs.length > 0 && (
                <div>
                  <div className="text-xs uppercase text-stone-600 font-semibold mb-2">
                    👤 NPCs
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {location.npcs.map((npcId) => (
                      <Badge
                        key={npcId}
                        variant="outline"
                        className="cursor-pointer hover:bg-amber-900/20 text-xs"
                        onClick={() => onNpcClick?.(npcId)}
                      >
                        {npcId}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {location.factions.length > 0 && (
                <div>
                  <div className="text-xs uppercase text-stone-600 font-semibold mb-2">
                    ⚔️ Facciones
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {location.factions.map((factionId) => (
                      <Badge
                        key={factionId}
                        variant="outline"
                        className="cursor-pointer hover:bg-amber-900/20 text-xs"
                        onClick={() => onFactionClick?.(factionId)}
                      >
                        {factionId}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Markdown Content */}
          <div className="border-t border-amber-900/20 pt-4">
            <WikiMarkdown
              content={location.markdown_content}
              onLocationClick={onLocationClick}
              onNpcClick={onNpcClick}
              onFactionClick={onFactionClick}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
