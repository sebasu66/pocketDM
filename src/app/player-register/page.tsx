"use client";

import { Suspense } from 'react';
import { User as UserIcon, Loader2, AlertCircle } from 'lucide-react';
import { Logo } from '@/components/logo';
import { Skeleton } from '@/components/ui/skeleton';
import { PlayerRegisterForm } from './PlayerRegisterForm';

function PlayerRegisterSkeleton() {
  return (
    <div className="w-full max-w-md z-10">
      <div className="bg-card/90 backdrop-blur-lg rounded-lg p-8 shadow-2xl border border-blue-700/30">
        <div className="flex justify-center mb-6">
          <Logo className="w-20 h-20" />
        </div>
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <UserIcon className="w-8 h-8 text-blue-400" />
            <h1 className="text-4xl font-headline text-blue-400">
              Jugador
            </h1>
          </div>
          <p className="text-foreground/70 text-lg">
            Únete a la aventura
          </p>
        </div>
        <div className="space-y-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
}

export default function PlayerRegisterPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat"
      style={{backgroundImage: "url('https://picsum.photos/1920/1080?grayscale&blur=5&random=1')"}}
      data-ai-hint="fantasy landscape"
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      <Suspense fallback={<PlayerRegisterSkeleton />}>
        <PlayerRegisterForm />
      </Suspense>
    </div>
  );
}
