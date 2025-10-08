"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronRight, Lock } from "lucide-react";

interface AnimatedPanelProps {
  title: string;
  subtitle: string;
  contextLabel?: string;
  images?: string[];
  videoUrl?: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  panelStyle?: 'character' | 'adventure' | 'manual';
}

export function AnimatedPanel({
  title,
  subtitle,
  contextLabel,
  images = [],
  videoUrl,
  onClick,
  disabled = false,
  className = "",
  panelStyle = 'character'
}: AnimatedPanelProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-cycle through images
  useEffect(() => {
    if (images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 4000); // Change image every 4 seconds

      return () => clearInterval(interval);
    }
  }, [images.length]);

  // Panel-specific styles
  const panelStyles = {
    character: {
      gradient: "from-amber-900/40 via-amber-800/30 to-orange-900/40",
      border: "border-amber-600/30",
      accentColor: "bg-amber-500",
      textColor: "text-amber-100",
      shadowColor: "shadow-amber-900/50"
    },
    adventure: {
      gradient: "from-red-900/40 via-purple-900/30 to-indigo-900/40",
      border: "border-purple-600/30",
      accentColor: "bg-purple-500",
      textColor: "text-purple-100",
      shadowColor: "shadow-purple-900/50"
    },
    manual: {
      gradient: "from-slate-900/40 via-blue-900/30 to-cyan-900/40",
      border: "border-cyan-600/30",
      accentColor: "bg-cyan-500",
      textColor: "text-cyan-100",
      shadowColor: "shadow-cyan-900/50"
    }
  };

  const style = panelStyles[panelStyle];

  return (
    <div
      className={`
        relative overflow-hidden rounded-lg border-2 ${style.border}
        transition-all duration-500 ease-out
        ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:scale-[1.02] hover:shadow-2xl'}
        ${isHovered && !disabled ? `${style.shadowColor} shadow-2xl` : 'shadow-lg'}
        ${className}
      `}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Media Layer */}
      <div className="absolute inset-0 z-0">
        {videoUrl ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        ) : images.length > 0 ? (
          <div className="relative w-full h-full">
            {images.map((img, index) => (
              <Image
                key={index}
                src={img}
                alt={`${title} background ${index + 1}`}
                fill
                sizes="100vw"
                className={`
                  object-cover transition-opacity duration-1000
                  ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}
                `}
              />
            ))}
          </div>
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${style.gradient}`} />
        )}

        {/* Dark overlay gradient */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent`} />

        {/* Animated scan lines effect */}
        <div className="absolute inset-0 bg-[url('/ui/noise.png')] opacity-5 mix-blend-overlay animate-scan" />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 p-6 md:p-8 h-full flex flex-col justify-between min-h-[200px]">
        {/* Top Section: Context Label */}
        {contextLabel && (
          <div className="flex items-center justify-between mb-4">
            <span
              className={`
                px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full
                ${style.accentColor} ${style.textColor}
                animate-pulse
              `}
            >
              {contextLabel}
            </span>
            {disabled && (
              <div className="flex items-center gap-2 text-white/70">
                <Lock size={16} />
                <span className="text-xs uppercase">Locked</span>
              </div>
            )}
          </div>
        )}

        {/* Middle Section: Title & Subtitle */}
        <div className="flex-1 flex flex-col justify-center">
          <h2
            className={`
              text-4xl md:text-5xl font-headline uppercase tracking-wider
              text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]
              transition-all duration-300
              ${isHovered && !disabled ? 'translate-x-2' : ''}
            `}
          >
            {title}
          </h2>
          <p
            className={`
              mt-2 text-lg md:text-xl text-white/90 font-light
              drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]
              transition-all duration-300
              ${isHovered && !disabled ? 'translate-x-2' : ''}
            `}
          >
            {subtitle}
          </p>
        </div>

        {/* Bottom Section: Action Indicator */}
        {!disabled && (
          <div className="flex items-center justify-end mt-4">
            <div
              className={`
                flex items-center gap-2 text-white/80
                transition-all duration-300
                ${isHovered ? 'translate-x-2 text-white' : ''}
              `}
            >
              <span className="text-sm uppercase font-semibold tracking-wide">Enter</span>
              <ChevronRight
                size={24}
                className={`transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`}
              />
            </div>
          </div>
        )}
      </div>

      {/* Hover Glow Effect */}
      {isHovered && !disabled && (
        <div
          className={`
            absolute inset-0 z-0
            bg-gradient-to-r ${style.gradient}
            opacity-30 animate-pulse
          `}
        />
      )}

      {/* Disabled Overlay */}
      {disabled && (
        <div className="absolute inset-0 z-20 bg-black/40 backdrop-blur-[2px]" />
      )}
    </div>
  );
}
