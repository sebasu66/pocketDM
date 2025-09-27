
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { useI18n } from "@/context/i18n-context";
import Image from "next/image";
import { DmAnimation } from "@/components/DmAnimation";

export default function HomePage() {
  const { t } = useI18n();

  return (
    <div className="font-serif flex flex-col items-center justify-center min-h-screen p-4 overflow-hidden">
      <div className="bg-slideshow" />
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
      
      <div className="z-10 flex flex-col items-center text-center text-white">
        <div className="relative w-[1024px] h-[1024px] md:w-[1280px] md:h-[1280px] -mb-32">
            <DmAnimation />
        </div>

        <div className="flex items-center gap-4">
            <Logo className="w-16 h-16 hidden md:block"/>
            <h1 className="text-6xl md:text-8xl font-bold drop-shadow-lg text-shadow">
                <span className="font-serif">Pocket</span> <span className="font-headline">DM</span>
            </h1>
        </div>
        
        <p className="text-xl md:text-2xl text-white/80 mt-4 max-w-3xl mx-auto drop-shadow-md">
            {t('homeSubtitle')}
        </p>
        
        <div className="mt-8">
             <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-shadow">
                <Link href="/login">{t('goToLoginButton')}</Link>
            </Button>
        </div>
      </div>
    </div>
  );
}
