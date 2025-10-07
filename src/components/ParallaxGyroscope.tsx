"use client";

import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';

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
  const requestRef = useRef<number>();
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;
    const element = elementRef.current;
    if (!element) return;

    // Parallax intensity multiplier based on layer
    const layerMultiplier = layer === 'foreground' ? 1 : 0.5;
    const finalIntensity = intensity * layerMultiplier;

    // Check if DeviceOrientation is supported
    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {

      // Request permission on iOS 13+
      const requestPermission = async () => {
        if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
          try {
            const permission = await (DeviceOrientationEvent as any).requestPermission();
            if (permission !== 'granted') {
              console.log('DeviceOrientation permission denied');
              return false;
            }
          } catch (error) {
            console.error('Error requesting DeviceOrientation permission:', error);
            return false;
          }
        }
        return true;
      };

      const handleOrientation = (event: DeviceOrientationEvent) => {
        if (!element) return;

        // Get device orientation
        const beta = event.beta || 0;  // Front-to-back tilt (-180 to 180)
        const gamma = event.gamma || 0; // Left-to-right tilt (-90 to 90)

        // Calculate movement (normalize to -1 to 1 range)
        const x = (gamma / 90) * finalIntensity;
        const y = (beta / 180) * finalIntensity;

        // Animate with GSAP for smooth transitions
        gsap.to(element, {
          x: x,
          y: y,
          duration: 0.5,
          ease: 'power2.out',
          force3D: true // GPU acceleration
        });
      };

      // Initialize
      isInitialized.current = true;
      requestPermission().then((granted) => {
        if (granted) {
          window.addEventListener('deviceorientation', handleOrientation, true);
        }
      });

      // Cleanup
      return () => {
        isInitialized.current = false;
        window.removeEventListener('deviceorientation', handleOrientation, true);
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current);
        }
      };
    } else {
      // Fallback: Mouse parallax for desktop
      const handleMouseMove = (event: MouseEvent) => {
        if (!element) return;

        const { clientX, clientY } = event;
        const { innerWidth, innerHeight } = window;

        // Calculate movement relative to center (-1 to 1)
        const x = ((clientX / innerWidth) - 0.5) * 2 * finalIntensity;
        const y = ((clientY / innerHeight) - 0.5) * 2 * finalIntensity;

        gsap.to(element, {
          x: x,
          y: y,
          duration: 0.8,
          ease: 'power2.out',
          force3D: true
        });
      };

      isInitialized.current = true;
      window.addEventListener('mousemove', handleMouseMove);

      return () => {
        isInitialized.current = false;
        window.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, []);

  return (
    <div ref={elementRef} style={{ willChange: 'transform' }}>
      {children}
    </div>
  );
}
