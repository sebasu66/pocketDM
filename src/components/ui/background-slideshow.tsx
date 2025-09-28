
"use client";

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const images = [
    '/ui/home/DM_frames/front-1.png',
    '/ui/home/DM_frames/front-2.png',
    '/ui/home/DM_frames/front-3.png',
    '/ui/home/DM_frames/front-4.png',
];

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
                            backgroundImage: `url(${images[0]})`,
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
                {images.map((src, index) => (
                    <div
                        key={src}
                        className="slideshow-image"
                        style={{
                            backgroundImage: `url(${src})`,
                            animationDelay: `${index * 8}s` 
                        }}
                        data-ai-hint="fantasy landscape"
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
