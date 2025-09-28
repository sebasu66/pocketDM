"use client";

import React, { useEffect, useState } from 'react';

const particles = Array.from({ length: 50 });

export function BackgroundSlideshow() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return null; // Render nothing on the server to avoid hydration mismatch
    }

    return (
        <div className="fixed inset-0 z-0 overflow-hidden">
            <div className="bg-slideshow" />
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
