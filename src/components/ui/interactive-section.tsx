
"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface InteractiveSectionProps {
    title: string;
    children: React.ReactNode;
    className?: string;
    backgroundImage?: string;
    backgroundColor?: string;
    borderImage?: string;
}

export function InteractiveSection({
    title,
    children,
    className,
    backgroundImage,
    backgroundColor, // Removed default value to make it explicit
    borderImage = `url('/ui/borders/gothic-frame.png')`,
}: InteractiveSectionProps) {
    
    // Default background if none is provided
    const finalBackgroundColor = backgroundColor || 'hsl(var(--card) / 0.5)';

    const containerStyle: React.CSSProperties = {
        '--border-image-source': borderImage,
        '--border-image-slice': '20',
        '--border-image-width': '20px',
        '--border-image-outset': '5px',
    } as React.CSSProperties;

    // Separate style for background to ensure override
    const backgroundStyle: React.CSSProperties = {
        backgroundColor: finalBackgroundColor,
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
    };

    return (
        <div 
            className={cn(
                "relative p-5 bg-cover bg-center",
                "border-[20px] border-solid border-transparent",
                "shadow-lg",
                className
            )} 
            style={{ ...containerStyle, ...backgroundStyle }}
        >
             {backgroundImage && <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />}
            <div className="relative z-10">
                <h2 className="font-medieval text-2xl uppercase tracking-widest text-foreground/90 mb-4">
                    {title}
                </h2>
                {children}
            </div>
        </div>
    );
}
