
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
  const [imgSrc, setImgSrc] = useState<string>(baseSrc); // Start with the preferred source
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    let isMounted = true;
    let found = false;

    const checkImage = async (path: string) => {
        try {
            const res = await fetch(path, { method: 'HEAD' });
            if (res.ok) {
                return true;
            }
            return false;
        } catch (error) {
            return false;
        }
    };
    
    const findImage = async () => {
        // First try the baseSrc as is, in case it already has an extension
        if (await checkImage(baseSrc)) {
            if (isMounted) {
                setImgSrc(baseSrc);
                found = true;
            }
        } else {
            // If not, try with extensions
            for (const ext of extensions) {
                const path = `${baseSrc}.${ext}`;
                if (await checkImage(path)) {
                    if (isMounted) {
                        setImgSrc(path);
                        found = true;
                    }
                    break;
                }
            }
        }

        if (isMounted && !found) {
            setImgSrc(fallbackSrc);
        }
        if (isMounted) {
             setIsLoading(false);
        }
    };

    findImage();

    return () => {
        isMounted = false;
    };
    
  }, [baseSrc, fallbackSrc]);

  if (isLoading) {
    // You can return a loading skeleton here if you want
    return null; 
  }

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={() => {
        // Final fallback in case the found image fails to load
        setImgSrc(fallbackSrc);
      }}
    />
  );
}
