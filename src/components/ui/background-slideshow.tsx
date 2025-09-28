
"use client";

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import imageData from '@/lib/placeholder-images.json';

const { backgrounds } = imageData;
const particlesCount = 50;

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
                            backgroundImage: `url(${backgrounds[0].src})`,
                            opacity: 1, // Show only the first image statically
                        }}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-0 overflow-hidden" id="particles-js">
             <div className="slideshow">
                {backgrounds.map((image, index) => (
                    <div
                        key={image.src}
                        className="slideshow-image"
                        style={{
                            backgroundImage: `url(${image.src})`,
                            animationDelay: `${index * 8}s` 
                        }}
                        data-ai-hint={image.hint}
                    />
                ))}
            </div>
            <div className="absolute inset-0 z-10 pointer-events-none">
                {Array.from({ length: particlesCount }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute bg-white/30 rounded-full particle"
                        style={{
                            width: `${Math.random() * 3}px`,
                            height: `${Math.random() * 3}px`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `-${Math.random() * 30}s`,
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
