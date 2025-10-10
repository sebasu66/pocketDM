
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
  const [imgSrc, setImgSrc] = useState<string>(fallbackSrc); // Start with fallback to avoid rendering invalid src
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    async function findValidImage() {
        // Try with preferred extensions first
        for (const ext of extensions) {
            const path = `${baseSrc}.${ext}`;
            try {
                // Use fetch with HEAD to check if the image exists without downloading it
                const response = await fetch(path, { method: 'HEAD' });
                if (response.ok) {
                    if (isMounted) {
                        setImgSrc(path);
                        setIsLoading(false);
                    }
                    return; // Found a valid image, exit the loop
                }
            } catch (error) {
                // Network error, continue to the next extension
            }
        }

        // If no extension worked, check if baseSrc itself is a valid full URL
        try {
             const response = await fetch(baseSrc, { method: 'HEAD' });
             if (response.ok) {
                 if (isMounted) {
                     setImgSrc(baseSrc);
                     setIsLoading(false);
                 }
                 return;
             }
        } catch (error) {
           // Not a valid URL
        }


        // If no valid image is found after checking all options, use the fallback
        if (isMounted) {
            setImgSrc(fallbackSrc);
            setIsLoading(false);
        }
    }

    findValidImage();

    return () => {
        isMounted = false;
    };
  }, [baseSrc, fallbackSrc]);

  if (isLoading) {
    // Optionally return a skeleton loader
    return null; 
  }

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      // This final onError handles cases where the image exists but is corrupted,
      // or if there's a network issue during the actual image load by <Image>.
      onError={() => {
        if (imgSrc !== fallbackSrc) {
            setImgSrc(fallbackSrc);
        }
      }}
    />
  );
}
