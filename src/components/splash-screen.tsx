'use client';

import { ThumbForgeIcon } from './icons';

export function SplashScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-primary transition-opacity duration-1000 animate-fade-in">
      <div className="relative">
        <div className="absolute -inset-0.5 animate-pulse rounded-lg bg-white/30 blur-xl"></div>
        <div className="relative flex items-center justify-center gap-4 rounded-lg bg-primary p-6">
          <ThumbForgeIcon className="h-12 w-12 animate-pulse text-white" />
          <h1 className="font-headline text-5xl font-bold text-white">
            Thumnailer AI
          </h1>
        </div>
      </div>
    </div>
  );
}
