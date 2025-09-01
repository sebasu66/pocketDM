
"use client";

import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';

interface StackedCardProps<T> {
  items: T[];
  renderItem: (item: T, isActive: boolean) => React.ReactNode;
}

export function StackedCard<T extends { id: string; name: string }>({ items, renderItem }: StackedCardProps<T>) {
  const [activeIndex, setActiveIndex] = useState(0);

  const randomTransforms = useMemo(() => {
    return items.map(() => ({
      rotate: Math.random() * 4 - 2, // -2 to 2 degrees
      x: Math.random() * 16 - 8, // -8px to 8px
    }));
  }, [items]);


  const handleCardClick = (index: number) => {
    setActiveIndex(index);
  };
  
  if (!items || items.length === 0) {
    return null;
  }
  
  // The active item is always the last one to be rendered so it's on top.
  const activeItem = items[activeIndex];
  const itemsToShow = [...items.filter((_, i) => i !== activeIndex), activeItem];


  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative w-[400px] h-[600px]">
        {itemsToShow.map((item, index) => {
          const originalIndex = items.findIndex(i => i.id === item.id);
          const isActive = index === itemsToShow.length - 1;
          const zIndex = index;
          
          const { rotate, x } = randomTransforms[originalIndex];

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
                    ? 'translateY(0px) scale(1) rotate(0deg)' 
                    : `translateY(${index * -20}px) translateX(${x}px) scale(${1 - (itemsToShow.length - 1 - index) * 0.05}) rotate(${rotate}deg)`,
              }}
            >
              <div className="w-full h-full">
                  {renderItem(item, isActive)}
              </div>
               {/* Clickable Tab at the bottom */}
               <div 
                className={cn(
                    "absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[95%] w-[80%] h-10 bg-card rounded-b-lg border-x border-b border-border/50",
                    "flex items-center justify-center",
                    isActive && "opacity-0" // Hide tab for active card
                )}
              >
                 <h3 className="font-headline text-center truncate px-4 text-muted-foreground">
                    {item.name}
                 </h3>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
