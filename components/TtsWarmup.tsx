'use client';

import { useEffect } from 'react';
import { initTtsOnInteraction } from '@/lib/tts';

export function TtsWarmup() {
  useEffect(() => {
    let warmed = false;

    const warmup = () => {
      if (warmed) return;
      warmed = true;
      initTtsOnInteraction();
      window.removeEventListener('pointerdown', warmup);
      window.removeEventListener('touchstart', warmup);
      window.removeEventListener('keydown', warmup);
    };

    window.addEventListener('pointerdown', warmup, { passive: true });
    window.addEventListener('touchstart', warmup, { passive: true });
    window.addEventListener('keydown', warmup);

    return () => {
      window.removeEventListener('pointerdown', warmup);
      window.removeEventListener('touchstart', warmup);
      window.removeEventListener('keydown', warmup);
    };
  }, []);

  return null;
}
