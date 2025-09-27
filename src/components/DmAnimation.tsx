
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const images = [
  '/ui/home/DM_frames/front-1.png',
  '/ui/home/DM_frames/front-2.png',
  '/ui/home/DM_frames/front-3.png',
  '/ui/home/DM_frames/front-4.png',
  '/ui/home/DM_frames/front-5.png',
  '/ui/home/DM_frames/front-6.png',
];

const FRAME_DURATION = 4000; // 4 seconds per frame

function AnimatedImages() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, FRAME_DURATION);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {images.map((src, index) => (
        <Image
          key={src}
          src={src}
          alt={`The Narrator frame ${index + 1}`}
          fill
          className={cn(
            'absolute inset-0 object-contain drop-shadow-[0_8px_8px_rgba(0,0,0,0.7)] transition-opacity duration-1000 ease-in-out',
            currentIndex === index ? 'opacity-100 animate-dm-fade-in' : 'opacity-0'
          )}
          priority={index === 0}
        />
      ))}
    </>
  );
}

export function DmAnimation() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="relative w-full h-full">
      {isMounted ? <AnimatedImages /> : (
        // Render a placeholder or the first image statically to avoid layout shift
        <Image
          src={images[0]}
          alt="The Narrator"
          fill
          className="absolute inset-0 object-contain drop-shadow-[0_8px_8px_rgba(0,0,0,0.7)]"
          priority
        />
      )}
    </div>
  );
}
