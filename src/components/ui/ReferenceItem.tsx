
"use client";

import { useState } from 'react';
import { GameModal, GameModalContent, GameModalHeader, GameModalTitle, GameModalDescription, GameModalTrigger } from './game-modal';
import { getReferenceItem } from '@/lib/firebase/reference';
import { Concepto } from '@/lib/firebase/types';
import { Skeleton } from './skeleton';

interface ReferenceItemProps {
  term: string;
  collection: string;
  className?: string;
  children?: React.ReactNode;
}

const formatId = (term: string) => {
  return term.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
};

export function ReferenceItem({ term, collection, className, children }: ReferenceItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<Concepto | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpen = async () => {
    if (!data) {
      setIsLoading(true);
      const itemId = formatId(term);
      const itemData = await getReferenceItem(collection, itemId);
      setData(itemData);
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>;
    }
    if (!data) {
      return <div>No se encontró la definición para &quot;{term}&quot;.</div>;
    }

    return (
      <>
        <GameModalHeader>
          <GameModalTitle>{data.nombre || data.name || term}</GameModalTitle>
        </GameModalHeader>
        <div className="prose prose-sm max-h-[60vh] overflow-y-auto text-black/90">
            {data.descripcion && <p>{data.descripcion}</p>}
            {data.efecto && <p><strong>Efecto:</strong> {data.efecto}</p>}
            {data.caracteristicas_raciales && (
                <div>
                    <strong>Características Raciales:</strong>
                    <ul>
                        {data.caracteristicas_raciales.map((c: string, i: number) => <li key={i}>{c.replace(/\*\*/g, '')}</li>)}
                    </ul>
                </div>
            )}
            {data.requirements && <p><strong>Requisitos:</strong> {data.requirements}</p>}
        </div>
      </>
    );
  };


  return (
    <GameModal open={isOpen} onOpenChange={setIsOpen}>
      <GameModalTrigger asChild onClick={handleOpen}>
        {children || <span className={`underline decoration-dotted cursor-pointer hover:text-accent ${className}`}>{term}</span>}
      </GameModalTrigger>
      <GameModalContent>
        {renderContent()}
      </GameModalContent>
    </GameModal>
  );
}
