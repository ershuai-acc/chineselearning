'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WordTooltipProps {
  hanzi: string;
  pinyin: string;
  meaning?: string;
  className?: string;
  children?: React.ReactNode;
}

export function WordTooltip({ hanzi, pinyin, meaning, className = '', children }: WordTooltipProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!showTooltip) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setShowTooltip(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showTooltip]);

  // Don't show tooltip for punctuation or empty meaning
  const isPunctuation = /^[，。！？：、；""''（）,.!?:;]$/.test(hanzi);
  if (isPunctuation || (!meaning && !pinyin)) {
    return <span className={className}>{children || hanzi}</span>;
  }

  return (
    <button
      ref={ref}
      onClick={() => setShowTooltip(!showTooltip)}
      className={`relative inline-block cursor-pointer ${className}`}
    >
      {children || hanzi}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap"
          >
            <div className="bg-duo-eel text-white px-3 py-2 rounded-lg shadow-lg text-center min-w-[80px]">
              <p className="text-xs font-bold text-duo-bee mb-0.5">{pinyin}</p>
              <p className="text-sm font-bold">{hanzi}</p>
              {meaning && <p className="text-xs text-gray-300 mt-0.5">{meaning}</p>}
            </div>
            {/* Arrow */}
            <div className="w-2 h-2 bg-duo-eel rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-1" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
