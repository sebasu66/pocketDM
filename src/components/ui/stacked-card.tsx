
"use client";

import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { GripVertical } from 'lucide-react';

interface StackedCardProps<T> {
  items: T[];
  renderItem: (item: T, isActive: boolean) => React.ReactNode;
}

export function StackedCard<T extends { id: string; name: string }>({ items, renderItem }: StackedCardProps<T>) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleCardClick = (index: number) => {
    setActiveIndex(index);
  };
  
  if (!items || items.length === 0) {
    return null;
  }
  
  const activeItem = items[activeIndex];
  const itemsToShow = [...items.filter((_, i) => i !== activeIndex), activeItem];


  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative w-[400px] h-[600px]">
        {itemsToShow.map((item, index) => {
          const originalIndex = items.findIndex(i => i.id === item.id);
          const isActive = index === itemsToShow.length - 1;
          const zIndex = index;
          const offset = itemsToShow.length - 1 - index;
          

          return (
            <div
              key={item.id}
              onClick={() => handleCardClick(originalIndex)}
              className={cn(
                "absolute w-full h-full rounded-lg bg-card shadow-2xl transition-all duration-500 ease-in-out cursor-pointer",
                isActive ? "shadow-primary/30" : "hover:-translate-y-2"
              )}
              style={{
                zIndex: zIndex,
                transform: isActive 
                    ? 'translateY(0px) translateX(0px) scale(1) rotate(0deg)' 
                    : `translateY(${offset * 30}px) translateX(${offset * 30}px) scale(${1 - offset * 0.05}) rotate(0deg)`,
              }}
            >
              <div className="w-full h-full">
                  {renderItem(item, isActive)}
              </div>
               {!isActive && (
                 <div 
                    className={cn(
                        "absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-[80%] h-12 bg-card rounded-b-lg border-x border-b border-border/50",
                        "flex items-center justify-center",
                    )}
                  >
                     <h3 className="font-headline text-center truncate px-4 text-black bg-white/70">
                        {item.name}
                     </h3>
                  </div>
               )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
