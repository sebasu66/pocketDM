
"use client";

import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface StackedCardProps<T> {
  items: T[];
  renderItem: (item: T, isActive: boolean) => React.ReactNode;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}

export function StackedCard<T extends { id: string; name: string }>({ items, renderItem, activeIndex, setActiveIndex }: StackedCardProps<T>) {
  
  const handleCardClick = (index: number) => {
    setActiveIndex(index);
  };
  
  const orderedItems = useMemo(() => {
    if (!items || items.length === 0 || activeIndex < 0 || activeIndex >= items.length) {
      return [];
    }

    const itemsWithRotation = items.map(item => ({
      ...item,
      rotation: Math.random() * 2 - 1, 
    }));
    
    const activeItem = itemsWithRotation[activeIndex];
    const otherItems = itemsWithRotation.filter((_, i) => i !== activeIndex);
    
    return [...otherItems, activeItem];
  }, [items, activeIndex]);

  if (orderedItems.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative w-[300px] h-[450px] scale-[1.25]">
        {orderedItems.map((item, index) => {
          if (!item) return null;
          const originalIndex = items.findIndex(i => i.id === item.id);
          const isActive = index === orderedItems.length - 1;
          const zIndex = index;
          const distance = orderedItems.length - 1 - index;
          
          return (
            <div
              key={item.id}
              onClick={() => handleCardClick(originalIndex)}
              className={cn(
                "absolute w-full h-full rounded-lg transition-all duration-500 ease-in-out cursor-pointer",
                isActive 
                  ? "drop-shadow-[0_4px_3px_rgba(0,0,0,0.5)]" 
                  : "opacity-80 hover:-translate-y-2 blur-[1px]"
              )}
              style={{
                zIndex: zIndex,
                transform: `translateX(${isActive ? 0 : distance * 20}px) translateY(${isActive ? 0 : distance * 20}px) rotate(${item.rotation}deg)`,
              }}
            >
              <div className="w-full h-full relative">
                  {renderItem(item, isActive)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
