"use client";

import { useEffect, useRef, useCallback } from 'react';

interface ParallaxGyroscopeProps {
  children: React.ReactNode;
  intensity?: number; // How much movement (default 20)
  layer?: 'background' | 'foreground'; // Parallax layer
}

export function ParallaxGyroscope({
  children,
  intensity = 20,
  layer = 'foreground'
}: ParallaxGyroscopeProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const isInitialized = { current: false };
    const element = elementRef.current;
    if (!element) return;

    const layerMultiplier = layer === 'foreground' ? 1 : 0.5;
    const finalIntensity = intensity * layerMultiplier;
    let cleanup: () => void = () => {};

    import('gsap').then(gsapModule => {
      if (isInitialized.current || !elementRef.current) return;
      isInitialized.current = true;
      
      const gsap = gsapModule.default;
      
      if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
        const requestPermission = async () => {
          if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
            try {
              const permission = await (DeviceOrientationEvent as any).requestPermission();
              return permission === 'granted';
            } catch (error) {
              // This can happen if the user denies permission or the environment blocks it.
              // We'll just fall back to mouse movement.
              return false;
            }
          }
          // If requestPermission doesn't exist, assume we have permission (for older browsers/devices).
          return true;
        };

        const handleOrientation = (event: DeviceOrientationEvent) => {
          if (!element) return;
          const beta = event.beta || 0;
          const gamma = event.gamma || 0;
          const x = (gamma / 90) * finalIntensity;
          const y = (beta / 180) * finalIntensity;

          gsap.to(element, { x, y, duration: 0.5, ease: 'power2.out', force3D: true });
        };

        requestPermission().then((granted) => {
          if (granted) {
            window.addEventListener('deviceorientation', handleOrientation, true);
            cleanup = () => window.removeEventListener('deviceorientation', handleOrientation, true);
          } else {
            // Fallback to mouse move if permission is not granted
            addMouseMoveListener();
          }
        });

      } else {
        addMouseMoveListener();
      }

      const addMouseMoveListener = () => {
        const handleMouseMove = (event: MouseEvent) => {
          if (!element) return;
          const { clientX, clientY } = event;
          const { innerWidth, innerHeight } = window;
          const x = ((clientX / innerWidth) - 0.5) * 2 * finalIntensity;
          const y = ((clientY / innerHeight) - 0.5) * 2 * finalIntensity;

          gsap.to(element, { x, y, duration: 0.8, ease: 'power2.out', force3D: true });
        };

        window.addEventListener('mousemove', handleMouseMove);
        cleanup = () => window.removeEventListener('mousemove', handleMouseMove);
      };

    });

    return () => {
        cleanup();
    };
  }, [intensity, layer]);

  return (
    <div ref={elementRef} style={{ willChange: 'transform', zIndex: 10 }}>
      {children}
    </div>
  );
}
