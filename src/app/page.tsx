'use client';
import { useState, useEffect } from 'react';
import { SplashScreen } from '@/components/splash-screen';
import { MainApp } from '@/components/main-app';

export default function Home() {
  const [loading, setLoading] = useState(true);

  // This state ensures that we don't try to render MainApp on the server,
  // which could cause hydration issues with localStorage.
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isClient) {
    return <SplashScreen />;
  }

  return (
    <main>
      {loading && <SplashScreen />}
      <div className={loading ? 'opacity-0' : 'opacity-100 transition-opacity duration-1000'}>
        <MainApp />
      </div>
    </main>
  );
}
