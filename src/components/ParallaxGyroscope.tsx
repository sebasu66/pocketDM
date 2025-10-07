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
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current || !elementRef.current) return;

    let cleanup: () => void = () => {};

    import('gsap').then(gsapModule => {
      if (!isInitialized.current && elementRef.current) {
        isInitialized.current = true;
        const gsap = gsapModule.default;
        const element = elementRef.current;

        const layerMultiplier = layer === 'foreground' ? 1 : 0.5;
        const finalIntensity = intensity * layerMultiplier;

        if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
          const requestPermission = async () => {
            if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
              try {
                const permission = await (DeviceOrientationEvent as any).requestPermission();
                return permission === 'granted';
              } catch (error) {
                console.error('Error requesting DeviceOrientation permission:', error);
                return false;
              }
            }
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
            }
          });

        } else {
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
        }
      }
    });

    return () => {
        isInitialized.current = false;
        cleanup();
    };
  }, [intensity, layer]);

  return (
    <div ref={elementRef} style={{ willChange: 'transform' }}>
      {children}
    </div>
  );
}
