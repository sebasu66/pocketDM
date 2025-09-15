"use client";

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface TypingEffectProps {
  text: string;
  speed?: number;
  className?: string;
}

export function TypingEffect({ text, speed = 50, className }: TypingEffectProps) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText(''); // Reset when text changes
    let i = 0;
    const intervalId = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(intervalId);
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed]);

  return <p className={cn("prose prose-xl prose-invert max-w-none text-foreground/90 leading-relaxed mt-8 md:mt-0 whitespace-pre-wrap", className)}>{displayedText}</p>;
}
