
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
    setActiveIndex(index);
  };
  
  if (!items || items.length === 0) {
    return null;
  }
  
  const orderedItems = useMemo(() => {
    if (!items[activeIndex]) return [];
    const active = items[activeIndex];
    const others = items.filter((_, i) => i !== activeIndex);
    return [...others, active];
  }, [items, activeIndex]);


  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative w-[400px] h-[600px]">
        {orderedItems.map((item, index) => {
          if (!item) return null;
          
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
                    ? 'translateY(0px) translateX(0px) scale(1)' 
                    : `translateY(${offset * 40}px) translateX(${offset * 40}px) scale(${1 - offset * 0.05})`,
              }}
            >
              <div className="w-full h-full relative">
                  {renderItem(item, isActive)}
                  {!isActive && (
                    <div 
                        className={cn(
                            "absolute bottom-0 left-1/2 -translate-x-1/2 w-full flex items-center justify-center",
                        )}
                      >
                        <h3 className="font-headline text-center truncate px-4 text-black bg-white/70 py-0.5 rounded-t">
                            {item.name}
                        </h3>
                      </div>
                  )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
