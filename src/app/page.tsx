
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { useI18n } from "@/context/i18n-context";
import Image from "next/image";
import { DmAnimation } from "@/components/DmAnimation";
import { BackgroundSlideshow } from "@/components/ui/background-slideshow";
import dynamic from 'next/dynamic';

const ParallaxGyroscope = dynamic(() => import('@/components/ParallaxGyroscope').then(mod => mod.ParallaxGyroscope), {
  ssr: false,
});


export default function HomePage() {
  const { t } = useI18n();

  return (
    <div className="font-serif flex flex-col items-center justify-center min-h-screen p-4 overflow-hidden bg-[radial-gradient(ellipse_at_center,_#1a1a2e_0%,_#16213e_50%,_#0f0f23_100%)]">
      {/* Background layer - animated */}
      <BackgroundSlideshow />

      {/* Content with foreground parallax */}
      <ParallaxGyroscope layer="foreground" intensity={25}>
         <div className="relative z-10 flex flex-col items-center text-center text-white">
            <div className="relative w-[50vh] h-[50vh] md:w-[65vh] md:h-[65vh] -mb-12">
                <div className="absolute inset-0 rounded-full bg-black/10 backdrop-blur-md"
                     style={{
                         boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3), inset 0 1px 0 0 rgba(255,255,255,0.05)'
                     }}
                />
                <DmAnimation />
            </div>

            <div className="flex items-center gap-4">
                <Logo className="w-16 h-16 hidden md:block"/>
                <h1 className="text-6xl md:text-8xl font-bold drop-shadow-lg text-shadow">
                    <span className="font-serif">Pocket</span> <span className="font-heavy-rain">DM</span>
                </h1>
            </div>

            <p className="text-2xl md:text-3xl font-headline font-bold text-white mt-6 max-w-3xl mx-auto tracking-wide"
               style={{
                 textShadow: '0 0 20px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.9), 0 4px 8px rgba(0,0,0,0.7), 0 0 40px rgba(139,92,46,0.5)',
                 WebkitTextStroke: '1px rgba(0,0,0,0.3)'
               }}>
                {t('homeSubtitle')}
            </p>

            <div className="mt-8">
                 <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-shadow">
                    <Link href="/login">{t('goToLoginButton')}</Link>
                </Button>
            </div>
          </div>
      </ParallaxGyroscope>
    </div>
  );
}
