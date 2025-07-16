'use client';
import { useState, useEffect } from 'react';
import { SplashScreen } from '@/components/splash-screen';
import { MainApp } from '@/components/main-app';

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main>
      {loading && <SplashScreen />}
      <div className={loading ? 'opacity-0' : 'opacity-100 transition-opacity duration-1000'}>
        <MainApp />
      </div>
    </main>
  );
}
