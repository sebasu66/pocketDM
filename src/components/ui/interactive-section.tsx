
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
    backgroundColor = 'hsl(var(--card) / 0.5)',
    borderImage = `url('/ui/borders/gothic-frame.png')`,
}: InteractiveSectionProps) {
    
    const containerStyle: React.CSSProperties = {
        '--background-image': backgroundImage ? `url(${backgroundImage})` : 'none',
        '--background-color': backgroundColor,
        '--border-image-source': borderImage,
        '--border-image-slice': '20',
        '--border-image-width': '20px',
        '--border-image-outset': '5px',
    } as React.CSSProperties;

    return (
        <div 
            className={cn(
                "relative p-5 bg-[var(--background-color)] bg-cover bg-center",
                "border-[20px] border-solid border-transparent",
                "shadow-lg",
                className
            )} 
            style={{
                borderImageSource: 'var(--border-image-source)',
                borderImageSlice: 'var(--border-image-slice)',
                borderImageWidth: 'var(--border-image-width)',
                borderImageOutset: 'var(--border-image-outset)',
                backgroundImage: 'var(--background-image)',
            }}
        >
             {backgroundImage && <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />}
            <div className="relative z-10">
                <h2 className="font-medieval text-2xl uppercase tracking-widest text-foreground/90 absolute -top-2 left-2">
                    {title}
                </h2>
                <div className="pt-8">
                    {children}
                </div>
            </div>
        </div>
    );
}
