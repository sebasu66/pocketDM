
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
  
  if (!items || items.length === 0) {
    return null;
  }
  
  const orderedItems = useMemo(() => {
    if (activeIndex < 0 || activeIndex >= items.length) {
      return [];
    }
    const activeItem = items[activeIndex];
    const otherItems = items.filter((_, i) => i !== activeIndex);
    return [...otherItems, activeItem];
  }, [items, activeIndex]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative w-[300px] h-[450px] scale-125">
        {orderedItems.map((item, index) => {
          const originalIndex = items.findIndex(i => i.id === item.id);
          const isActive = index === orderedItems.length - 1;
          const zIndex = index;
          const distance = orderedItems.length - 1 - index;
          
          return (
            <div
              key={item.id}
              onClick={() => handleCardClick(originalIndex)}
              className={cn(
                "absolute w-full h-full rounded-lg shadow-2xl transition-all duration-500 ease-in-out cursor-pointer",
                isActive 
                  ? "drop-shadow-[0_25px_25px_rgba(0,0,0,0.5)]" 
                  : "blur-[1px] opacity-70 hover:-translate-y-2"
              )}
              style={{
                zIndex: zIndex,
                transform: `translateY(${isActive ? 0 : distance * 40}px) scale(${1 - distance * 0.05})`,
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
