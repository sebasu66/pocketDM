
"use client";

import Image, { ImageProps } from 'next/image';
import { useState, useEffect } from 'react';

type ImageWithFallbackProps = Omit<ImageProps, 'src'> & {
  baseSrc: string;
  fallbackSrc?: string;
  alt: string;
};

const extensions = ['png', 'jpg', 'webp'];

export function ImageWithFallback({ baseSrc, fallbackSrc = 'https://picsum.photos/400/600', alt, ...props }: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    let found = false;
    let attempts = 0;

    const tryImage = (index: number) => {
      if (index >= extensions.length) {
        if (!found) {
            setError(true);
            setImgSrc(fallbackSrc);
        }
        return;
      }
      
      const path = `${baseSrc}.${extensions[index]}`;
      const img = new window.Image();
      img.src = path;
      img.onload = () => {
        if (!found) {
          found = true;
          setImgSrc(path);
        }
      };
      img.onerror = () => {
        tryImage(index + 1);
      };
    };

    tryImage(0);
    
  }, [baseSrc, fallbackSrc]);

  if (!imgSrc) {
    // You can return a loading skeleton here if you want
    return null; 
  }

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      // If you want to handle errors on the Image component itself, though the effect above should handle it
      onError={() => {
        if (!error) { // prevent infinite loop
            setError(true);
            setImgSrc(fallbackSrc);
        }
      }}
    />
  );
}
