
"use client";

import { useState, useCallback } from 'react';
import { useI18n } from '@/context/i18n-context';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { searchReference } from '@/lib/firebase/reference';
import { Concepto } from '@/lib/firebase/types';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen } from 'lucide-react';
import { GameModal, GameModalContent, GameModalHeader, GameModalTitle } from '@/components/ui/game-modal';

export default function LorePage() {
  const { t } = useI18n();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Concepto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Concepto | null>(null);

  const handleSearch = useCallback(async (term: string) => {
    setSearchTerm(term);
    if (term.length < 3) {
      setResults([]);
      return;
    }
    setIsLoading(true);
    const searchResults = await searchReference(term);
    setResults(searchResults);
    setIsLoading(false);
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
                    placeholder={t('loreSearchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                />
                 <div className="mt-6 space-y-4">
                    {isLoading ? (
                        <>
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                        </>
                    ) : results.length > 0 ? (
                        results.map(item => (
                            <div key={`${item.collection}-${item.id}`} onClick={() => setSelectedItem(item)} className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                                <p className="font-bold">{item.name || item.nombre}</p>
                                <p className="text-xs text-muted-foreground capitalize">{item.collection?.replace(/_/g, ' ')}</p>
                            </div>
                        ))
                    ) : searchTerm.length >= 3 ? (
                        <p className="text-center text-muted-foreground">{t('loreNoResults')}</p>
                    ): null}
                </div>
            </CardContent>
        </Card>
        
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
    </>
  );
}
