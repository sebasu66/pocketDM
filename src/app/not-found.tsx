
"use client";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { useI18n } from '@/context/i18n-context';

export default function NotFound() {
  const { t } = useI18n();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat p-4" style={{backgroundImage: "url('https://picsum.photos/1920/1080?grayscale&blur=5&random=1')"}} data-ai-hint="fantasy landscape">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      <div className="w-full max-w-lg z-10 text-center text-white">
        <div className="flex justify-center mb-4">
            <Logo className="w-24 h-24 text-destructive" />
        </div>
        <h1 className="text-6xl font-headline drop-shadow-lg">404</h1>
        <p className="text-2xl text-white/80 mt-4">{t('notFoundTitle')}</p>
        <p className="text-md text-white/70 mt-2">
            {t('notFoundDescription')}
        </p>
        <div className="mt-8">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/">{t('notFoundReturnHome')}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

    