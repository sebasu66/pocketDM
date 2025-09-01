
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

  const cardOrder = useMemo(() => {
    if (!items || items.length === 0) return [];
    const order = [...items];
    const activeItem = order.splice(activeIndex, 1)[0];
    order.push(activeItem);
    return order;
  }, [items, activeIndex]);

  if (!items || items.length === 0) {
    return null;
  }
  
  return (
    <div className="relative w-full aspect-[4/3] max-w-2xl mx-auto">
      {cardOrder.map((item, index) => {
        const isActive = index === cardOrder.length - 1;
        const zIndex = index;
        const scale = 1 - (cardOrder.length - 1 - index) * 0.05;
        const translateY = (cardOrder.length - 1 - index) * -40; // Increased spacing
        const opacity = isActive ? 1 : 0.8;

        return (
          <div
            key={item.id}
            onClick={() => {
                const originalIndex = items.findIndex(i => i.id === item.id);
                handleCardClick(originalIndex);
            }}
            className={cn(
              "absolute w-full h-full origin-bottom rounded-t-lg border-x border-t border-border/50 bg-card shadow-lg transition-all duration-300 ease-in-out cursor-pointer",
              !isActive && "hover:-translate-y-2"
            )}
            style={{
              transform: `translateY(${translateY}px) scale(${scale})`,
              zIndex: zIndex,
              opacity: opacity,
            }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full w-[80%]">
                 <div className="relative h-10">
                    <div className="absolute inset-0 bg-card border-t border-x border-border/50 rounded-t-lg"></div>
                    <h3 className="absolute inset-0 flex items-center justify-center text-lg font-headline text-center truncate px-4">
                        {item.name}
                    </h3>
                 </div>
            </div>
            <div className="w-full h-full">
                {renderItem(item, isActive)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
