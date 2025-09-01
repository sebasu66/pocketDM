
"use client";

import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';

interface StackedCardProps<T> {
  items: T[];
  renderItem: (item: T, isActive: boolean) => React.ReactNode;
}

export function StackedCard<T extends { id: string; name: string }>({ items, renderItem }: StackedCardProps<T>) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleCardClick = (index: number) => {
    console.log(`Card clicked. New active index: ${index}`);
    setActiveIndex(index);
  };
  
  if (!items || items.length === 0) {
    console.log("No items to render.");
    return null;
  }
  
  // This logic was flawed before. This is a more robust way to handle the stacking order.
  const orderedItems = useMemo(() => {
    console.log(`Recalculating orderedItems. Active index is ${activeIndex}`);
    const activeItem = items[activeIndex];
    if (!activeItem) {
        // This case should not happen if activeIndex is managed correctly
        console.error(`Error: No active item found at index ${activeIndex}. Defaulting to first item.`);
        setActiveIndex(0);
        return items;
    }
    const otherItems = items.filter((_, i) => i !== activeIndex);
    const newOrder = [...otherItems, activeItem];
    console.log('New order of items to show:', newOrder.map(i => i.id));
    return newOrder;
  }, [items, activeIndex]);


  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative w-[400px] h-[600px]">
        {orderedItems.map((item, index) => {
          // We need the original index to pass back to the click handler
          const originalIndex = items.findIndex(i => i.id === item.id);
          const isActive = index === orderedItems.length - 1;
          const zIndex = index;
          const offset = orderedItems.length - 1 - index;
          

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
