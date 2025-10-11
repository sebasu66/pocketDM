"use client";

import { useState, useCallback, useMemo } from 'react';
import { useI18n } from '@/context/i18n-context';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { searchReference } from '@/lib/firebase/reference';
import { Concepto } from '@/lib/firebase/types';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, MapPin, Hash } from 'lucide-react';
import { GameModal, GameModalContent, GameModalHeader, GameModalTitle } from '@/components/ui/game-modal';
import { WikiLocation } from '@/lib/types/wiki';
import { LocationDetailDialog } from '@/components/wiki/LocationDetailDialog';
import Fuse from 'fuse.js';
import wikiLocationsData from '../../../../public/data/wiki_locations.json';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function LorePage() {
  const { t } = useI18n();
  const [searchTerm, setSearchTerm] = useState('');
  const [firestoreResults, setFirestoreResults] = useState<Concepto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Concepto | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<WikiLocation | null>(null);
  const [activeTab, setActiveTab] = useState<'wiki' | 'reference'>('wiki');

  // Wiki locations data
  const wikiLocations = wikiLocationsData as WikiLocation[];

  // Initialize Fuse.js for wiki search
  const fuse = useMemo(() => {
    return new Fuse(wikiLocations, {
      keys: ['name', 'type', 'cell_id', 'search_terms'],
      threshold: 0.4,
      includeScore: true
    });
  }, []);

  // Wiki search results
  const wikiResults = useMemo(() => {
    if (searchTerm.length < 2) return [];
    return fuse.search(searchTerm).map(result => result.item);
  }, [searchTerm, fuse]);

  const handleSearch = useCallback(async (term: string) => {
    setSearchTerm(term);
    if (term.length < 3) {
      setFirestoreResults([]);
      return;
    }
    setIsLoading(true);
    const searchResults = await searchReference(term);
    setFirestoreResults(searchResults);
    setIsLoading(false);
  }, []);

  const handleLocationClick = useCallback((locationId: string) => {
    const location = wikiLocations.find(loc => loc.id === locationId);
    if (location) {
      setSelectedLocation(location);
    } else {
      console.warn('Location not found:', locationId);
    }
  }, [wikiLocations]);

  const handleNpcClick = useCallback((npcId: string) => {
    console.log('NPC clicked:', npcId);
    // Future: Implement NPC detail dialog
  }, []);

  const handleFactionClick = useCallback((factionId: string) => {
    console.log('Faction clicked:', factionId);
    // Future: Implement Faction detail dialog
  }, []);

  const renderContent = (item: Concepto) => {
    if (!item) return null;
    return (
        <div className="prose prose-sm max-h-[70vh] overflow-y-auto text-black/90">
            {Object.entries(item).map(([key, value]) => {
                if (['id', 'name', 'collection', 'nombre'].includes(key) || !value) return null;
                if (typeof value === 'string') {
                    return <p key={key}><strong>{key.replace(/_/g, ' ')}:</strong> {value}</p>;
                }
                if (Array.isArray(value)) {
                    return (
                        <div key={key}>
                            <strong>{key.replace(/_/g, ' ')}:</strong>
                            <ul>
                                {value.map((v, i) => <li key={i}>{typeof v === 'object' ? JSON.stringify(v) : v}</li>)}
                            </ul>
                        </div>
                    );
                }
                 if (typeof value === 'object') {
                     return (
                        <div key={key}>
                            <strong>{key.replace(/_/g, ' ')}:</strong>
                             <pre className="text-xs whitespace-pre-wrap font-mono bg-stone-200 p-2 rounded">{JSON.stringify(value, null, 2)}</pre>
                        </div>
                    );
                }
                return null;
            })}
        </div>
    );
  };

  return (
    <>
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">{t('loreTitle')}</CardTitle>
                <CardDescription>{t('loreDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
                <Input
                    placeholder="Buscar en Gazetteer de Hellfrost y referencias..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                />

                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'wiki' | 'reference')} className="mt-6">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="wiki" className="flex items-center gap-2">
                      <MapPin size={16} />
                      Gazetteer ({wikiResults.length})
                    </TabsTrigger>
                    <TabsTrigger value="reference" className="flex items-center gap-2">
                      <BookOpen size={16} />
                      Referencias ({firestoreResults.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="wiki" className="space-y-4 mt-4">
                    {wikiResults.length > 0 ? (
                      wikiResults.map(location => (
                        <div
                          key={location.id}
                          onClick={() => setSelectedLocation(location)}
                          className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-bold">{location.name}</p>
                              <p className="text-xs text-muted-foreground capitalize">{location.type}</p>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Hash size={12} />
                              {location.cell_id}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : searchTerm.length >= 2 ? (
                      <p className="text-center text-muted-foreground">No se encontraron locaciones</p>
                    ) : (
                      <p className="text-center text-muted-foreground text-sm">
                        Escribe al menos 2 caracteres para buscar en el Gazetteer de Hellfrost
                      </p>
                    )}
                  </TabsContent>

                  <TabsContent value="reference" className="space-y-4 mt-4">
                    {isLoading ? (
                      <>
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                      </>
                    ) : firestoreResults.length > 0 ? (
                      firestoreResults.map(item => (
                        <div
                          key={`${item.collection}-${item.id}`}
                          onClick={() => setSelectedItem(item)}
                          className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                        >
                          <p className="font-bold">{item.name || item.nombre}</p>
                          <p className="text-xs text-muted-foreground capitalize">{item.collection?.replace(/_/g, ' ')}</p>
                        </div>
                      ))
                    ) : searchTerm.length >= 3 ? (
                      <p className="text-center text-muted-foreground">{t('loreNoResults')}</p>
                    ) : (
                      <p className="text-center text-muted-foreground text-sm">
                        Escribe al menos 3 caracteres para buscar referencias de Firestore
                      </p>
                    )}
                  </TabsContent>
                </Tabs>
            </CardContent>
        </Card>

        {/* Firestore Reference Modal */}
        <GameModal open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
            <GameModalContent>
                {selectedItem && (
                    <>
                        <GameModalHeader>
                            <GameModalTitle>{selectedItem.name || selectedItem.nombre}</GameModalTitle>
                        </GameModalHeader>
                       {renderContent(selectedItem)}
                    </>
                )}
            </GameModalContent>
        </GameModal>

        {/* Wiki Location Dialog */}
        <LocationDetailDialog
          location={selectedLocation}
          open={!!selectedLocation}
          onOpenChange={(open) => !open && setSelectedLocation(null)}
          onLocationClick={handleLocationClick}
          onNpcClick={handleNpcClick}
          onFactionClick={handleFactionClick}
        />
    </>
  );
}
