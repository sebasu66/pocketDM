
"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface FlippingAvatarProps {
  playerImage: string;
  characterImage: string;
  characterFaceImage?: string;
  playerHint: string;
  characterHint: string;
  className?: string;
}

export function FlippingAvatar({
  playerImage,
  characterImage,
  characterFaceImage,
  playerHint,
  characterHint,
  className,
}: FlippingAvatarProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFlipped((prev) => !prev);
    }, 10000); // Flip every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={cn("w-18 h-18 perspective-1000", className)}>
      <div
        className={cn(
          "relative w-full h-full transform-style-3d transition-transform duration-1000",
          isFlipped ? "rotate-y-180" : ""
        )}
      >
        {/* Player Face */}
        <div className="absolute w-full h-full backface-hidden rounded-full overflow-hidden border-2 border-primary/50">
          <Image
            src={playerImage}
            alt="Player"
            width={72}
            height={72}
            className="w-full h-full object-cover"
            data-ai-hint={playerHint}
          />
        </div>
        {/* Character Face */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 rounded-full overflow-hidden border-2 border-accent/50">
          <Image
            src={characterFaceImage || characterImage}
            alt="Character"
            width={72}
            height={72}
            className="w-full h-full object-cover"
            data-ai-hint={characterHint}
          />
        </div>
      </div>
    </div>
  );
}
