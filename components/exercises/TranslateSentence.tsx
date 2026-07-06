'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { WordTooltip } from '../WordTooltip';
import { speak } from '@/lib/tts';
import { stableShuffle } from '@/lib/stable-shuffle';

interface Word { id: string; hanzi: string; pinyin: string; meaning?: string; }
interface Sentence { id: string; text: string; pinyin: string; translation: string; words: Word[]; }

interface Props {
  sentence: Sentence;
  allSentences: Sentence[];
  onComplete: () => void;
  onSkip: () => void;
}

export function TranslateSentence({ sentence, allSentences, onComplete, onSkip }: Props) {
  const [selected, setSelected] = useState<Word[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const contentWords = useMemo(() =>
    sentence.words.filter(w => !/^[，。！？：、；""''（）]$/.test(w.hanzi)),
    [sentence]
  );

  const options = useMemo(() => {
    if (!mounted) return contentWords;
    const distractors: Word[] = [];
    const usedHanzi = new Set(contentWords.map(w => w.hanzi));
    for (const s of allSentences) {
      if (s.id === sentence.id) continue;
      for (const w of s.words) {
        if (!usedHanzi.has(w.hanzi) && !/^[，。！？：、；""''（）]$/.test(w.hanzi)) {
          distractors.push(w);
          usedHanzi.add(w.hanzi);
          if (distractors.length >= 3) break;
        }
      }
      if (distractors.length >= 3) break;
    }
    return stableShuffle([...contentWords, ...distractors], `${sentence.id}:translate`);
  }, [sentence, allSentences, contentWords, mounted]);

  const handleOptionClick = (word: Word) => {
    if (feedback) return;
    const idx = selected.findIndex(w => w.id === word.id);
    if (idx >= 0) {
      setSelected(prev => prev.filter((_, i) => i !== idx));
    } else {
      setSelected(prev => [...prev, word]);
    }
  };

  const handleCheck = () => {
    const selectedText = selected.map(w => w.hanzi).join('');
    const correctText = contentWords.map(w => w.hanzi).join('');
    setFeedback(selectedText === correctText ? 'correct' : 'wrong');
  };

  const playWord = (text: string) => {
    if (typeof window === 'undefined') return;
    speak({ text, lang: 'zh-CN', rate: 0.8 });
  };

  const isOptionUsed = (word: Word) => selected.some(w => w.id === word.id);

  if (!mounted) {
    return <div className="flex items-center justify-center flex-1"><div className="animate-spin w-6 h-6 border-3 border-duo-macaw border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="flex min-h-full flex-col">
      {/* English prompt */}
      <div className="bg-ios-surface rounded-ios-xl shadow-ios p-5 mb-3 text-center">
        <p className="text-xs text-ios-gray font-semibold mb-2 uppercase tracking-wide">Translate</p>
        <p className="text-base font-semibold text-ios-dark">{sentence.translation}</p>
      </div>

      {/* Selected words (answer area) */}
      <div className="min-h-[56px] bg-ios-bg rounded-ios-xl border border-dashed border-ios-sep p-3 mb-3 flex flex-wrap gap-2 items-center justify-center">
        {selected.length === 0 && (
          <span className="text-ios-light text-sm">Tap words to build the sentence</span>
        )}
        {selected.map((word, idx) => (
          <motion.button
            key={`${word.id}-${idx}`}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            onClick={() => handleOptionClick(word)}
            className={`px-3 py-1.5 rounded-lg font-semibold text-sm transition-all ${
              feedback === 'wrong' ? 'bg-red-50 text-ios-red'
              : feedback === 'correct' ? 'bg-duo-green/10 text-duo-green-dark'
              : 'bg-ios-surface text-ios-dark'
            }`}
          >
            <span className="text-[10px] text-duo-macaw block">{word.pinyin}</span>
            {word.hanzi}
          </motion.button>
        ))}
      </div>

      {/* Options pool */}
      <div className="flex flex-wrap gap-2 justify-center mb-4">
        {options.map(word => (
          <div key={word.id} className="relative">
            <WordTooltip hanzi={word.hanzi} pinyin={word.pinyin} meaning={word.meaning}>
              <button
                onClick={(e) => { e.stopPropagation(); handleOptionClick(word); playWord(word.hanzi); }}
                disabled={isOptionUsed(word) || feedback !== null}
                className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
                  isOptionUsed(word)
                    ? 'opacity-0 pointer-events-none'
                    : 'bg-ios-surface shadow-ios text-ios-dark active:bg-duo-green/10 active:text-duo-green-dark'
                }`}
              >
                <span className="text-[10px] text-duo-macaw block">{word.pinyin}</span>
                {word.hanzi}
              </button>
            </WordTooltip>
          </div>
        ))}
      </div>

      {/* Feedback */}
      {feedback === 'correct' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-2 py-1 text-center mb-3">
          <p className="font-semibold text-duo-green-dark">Correct</p>
        </motion.div>
      )}
      {feedback === 'wrong' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-2 py-1 text-center mb-3">
          <p className="font-semibold text-ios-red mb-1">Not quite</p>
          <p className="text-sm text-ios-dark">{contentWords.map(w => w.hanzi).join('')}</p>
        </motion.div>
      )}

      {/* Bottom buttons */}
      <div className="sticky bottom-0 mt-auto bg-[#F2F2F7] pt-2 pb-[max(var(--sab),1rem)]">
        {feedback ? (
          <button onClick={onComplete} className="w-full py-3.5 rounded-ios-xl bg-duo-green text-white font-semibold text-base shadow-ios active:bg-duo-green-dark active:scale-[0.98] transition-all">
            Continue
          </button>
        ) : (
          <div className="flex gap-3">
            <button onClick={onSkip} className="px-5 py-3.5 rounded-ios-xl bg-ios-surface shadow-ios text-ios-gray font-semibold flex items-center gap-1.5 active:bg-ios-bg transition-all">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 4 15 12 5 20 5 4"/>
                <line x1="19" y1="5" x2="19" y2="19"/>
              </svg>
              Skip
            </button>
            <button
              onClick={handleCheck}
              disabled={selected.length === 0}
              className={`flex-1 py-3.5 rounded-ios-xl font-semibold text-base transition-all ${
                selected.length > 0
                  ? 'bg-duo-green text-white shadow-ios active:bg-duo-green-dark active:scale-[0.98]'
                  : 'bg-ios-surface text-ios-gray shadow-ios'
              }`}
            >
              Check
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
