
"use client";

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const images = [
    'https://picsum.photos/seed/bg1/1920/1080',
    'https://picsum.photos/seed/bg2/1920/1080',
    'https://picsum.photos/seed/bg3/1920/1080',
    'https://picsum.photos/seed/bg4/1920/1080'
];

const particles = Array.from({ length: 50 });

export function BackgroundSlideshow() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        // Render a static fallback on the server to prevent hydration mismatch
        return (
             <div className="fixed inset-0 z-0 overflow-hidden">
                 <div className="slideshow">
                    <div
                        className="slideshow-image"
                        style={{
                            backgroundImage: `url(${images[0]})`,
                            opacity: 1, // Show only the first image statically
                        }}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-0 overflow-hidden">
             <div className="slideshow">
                {images.map((src, index) => (
                    <div
                        key={src}
                        className="slideshow-image"
                        style={{
                            backgroundImage: `url(${src})`,
                            animationDelay: `${index * 8}s` 
                        }}
                    />
                ))}
            </div>
            <div className="absolute inset-0 z-10 pointer-events-none">
                {particles.map((_, i) => (
                    <div
                        key={i}
                        className="absolute bg-white/30 rounded-full"
                        style={{
                            width: `${Math.random() * 3}px`,
                            height: `${Math.random() * 3}px`,
                            left: `${Math.random() * 100}%`,
                            animation: `particleAnimation ${Math.random() * 20 + 10}s linear infinite`,
                            animationDelay: `-${Math.random() * 30}s`,
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
