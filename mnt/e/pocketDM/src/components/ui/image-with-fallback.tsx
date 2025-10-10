
"use client";

import Image, { ImageProps } from 'next/image';
import { useState, useEffect } from 'react';

type ImageWithFallbackProps = Omit<ImageProps, 'src'> & {
  baseSrc: string;
  fallbackSrc?: string;
  alt: string;
};

export function ImageWithFallback({ baseSrc, fallbackSrc = 'https://picsum.photos/400/600', alt, ...props }: ImageWithFallbackProps) {
  // Start by assuming the .png version is the one we want.
  const preferredSrc = `${baseSrc}.png`;
  const [imgSrc, setImgSrc] = useState(preferredSrc);

  useEffect(() => {
    // When the baseSrc changes, reset our image source to the preferred one.
    setImgSrc(`${baseSrc}.png`);
  }, [baseSrc]);

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={() => {
        // If the preferredSrc (.png) fails to load, switch to the generic fallback.
        // This check prevents an infinite loop if the fallbackSrc itself is also invalid.
        if (imgSrc !== fallbackSrc) {
            setImgSrc(fallbackSrc);
        }
      }}
    />
  );
}
