'use client';

import { useState, useMemo, useEffect } from 'react';
import { Volume2, SkipForward } from 'lucide-react';
import { motion } from 'framer-motion';

interface Word { id: string; hanzi: string; pinyin: string; }
interface Sentence { id: string; text: string; pinyin: string; translation: string; words: Word[]; }

interface Props {
  sentence: Sentence;
  allSentences: Sentence[];
  onComplete: () => void;
  onSkip: () => void;
}

export function ListenChoose({ sentence, allSentences, onComplete, onSkip }: Props) {
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const contentWords = useMemo(() => 
    sentence.words.filter(w => !/^[，。！？：、；""''（）]$/.test(w.hanzi) && w.hanzi.length >= 2),
    [sentence]
  );

  // Pick a random target word
  const target = useMemo(() => {
    if (!mounted) {
      const pool = contentWords.length > 0 ? contentWords : sentence.words.filter(w => !/^[，。！？：、；""''（）]$/.test(w.hanzi));
      return pool[0];
    }
    const pool = contentWords.length > 0 ? contentWords : sentence.words.filter(w => !/^[，。！？：、；""''（）]$/.test(w.hanzi));
    return pool[Math.floor(Math.random() * pool.length)];
  }, [contentWords, sentence, mounted]);

  // Generate options
  const options = useMemo(() => {
    if (!mounted || !target) return [];
    const distractors: Word[] = [];
    const usedHanzi = new Set([target.hanzi]);

    for (const s of allSentences) {
      for (const w of s.words) {
        if (!usedHanzi.has(w.hanzi) && !/^[，。！？：、；""''（）]$/.test(w.hanzi) && w.hanzi.length >= 1) {
          distractors.push(w);
          usedHanzi.add(w.hanzi);
          if (distractors.length >= 3) break;
        }
      }
      if (distractors.length >= 3) break;
    }

    return [target, ...distractors].sort(() => Math.random() - 0.5);
  }, [target, allSentences, mounted]);

  // Auto-play target on mount
  useEffect(() => {
    if (!mounted || !target) return;
    const timer = setTimeout(() => playWord(target.hanzi), 500);
    return () => clearTimeout(timer);
  }, [mounted, target]);

  const playWord = (text: string) => {
    if (typeof window === 'undefined') return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'zh-CN';
    u.rate = 0.75;
    speechSynthesis.speak(u);
  };

  const handleSelect = (word: Word) => {
    if (feedback || !target) return;
    setSelectedWord(word);
    setFeedback(word.hanzi === target.hanzi ? 'correct' : 'wrong');
  };

  if (!mounted || !target) {
    return <div className="flex items-center justify-center flex-1"><div className="animate-spin w-6 h-6 border-3 border-duo-macaw border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="flex flex-col flex-1">
      {/* Prompt */}
      <div className="bg-white rounded-2xl border-2 border-b-4 border-duo-swan p-6 mb-5 text-center">
        <p className="text-sm text-duo-hare font-bold mb-4">What word do you hear?</p>
        <button
          onClick={() => playWord(target.hanzi)}
          className="w-20 h-20 rounded-full bg-duo-macaw/10 border-2 border-duo-macaw flex items-center justify-center mx-auto hover:bg-duo-macaw/20 transition-colors active:scale-95"
        >
          <Volume2 className="w-8 h-8 text-duo-macaw" />
        </button>
        <p className="text-xs text-duo-hare mt-3">Tap to play again</p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {options.map(word => {
          const isSelected = selectedWord?.id === word.id;
          const isCorrectAnswer = word.hanzi === target.hanzi;
          let classes = 'border-duo-swan bg-white text-duo-eel hover:border-duo-macaw';

          if (feedback && isSelected && feedback === 'correct') {
            classes = 'border-duo-green bg-duo-green/10 text-duo-green-dark';
          } else if (feedback && isSelected && feedback === 'wrong') {
            classes = 'border-duo-cardinal bg-duo-cardinal/10 text-duo-cardinal';
          } else if (feedback && isCorrectAnswer) {
            classes = 'border-duo-green bg-duo-green/5 text-duo-green-dark';
          }

          return (
            <button
              key={word.id}
              onClick={() => handleSelect(word)}
              disabled={feedback !== null}
              className={`flex flex-col items-center p-4 rounded-xl border-2 border-b-4 font-bold transition-all active:border-b-2 ${classes}`}
            >
              <span className="text-xl mb-1">{word.hanzi}</span>
              <span className="text-[11px] text-duo-macaw">{word.pinyin}</span>
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {feedback === 'correct' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-duo-green/10 border-2 border-duo-green rounded-xl p-3 text-center mb-4">
          <p className="font-extrabold text-duo-green-dark">✓ Correct! — {target.hanzi} ({target.pinyin})</p>
        </motion.div>
      )}
      {feedback === 'wrong' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-duo-cardinal/10 border-2 border-duo-cardinal rounded-xl p-3 text-center mb-4">
          <p className="font-bold text-duo-cardinal">✗ The answer is: <span className="text-duo-eel">{target.hanzi}</span> ({target.pinyin})</p>
        </motion.div>
      )}

      <div className="flex-1" />

      {/* Bottom */}
      <div className="pb-6">
        {feedback ? (
          <button onClick={onComplete} className="w-full py-4 rounded-xl bg-duo-green border-b-4 border-duo-green-dark text-white font-extrabold text-lg active:border-b-2 transition-all">
            Continue
          </button>
        ) : (
          <button onClick={onSkip} className="w-full py-3 rounded-xl border-2 border-duo-swan text-duo-hare font-bold flex items-center justify-center gap-2 hover:border-duo-wolf">
            <SkipForward className="w-4 h-4" /> Skip
          </button>
        )}
      </div>
    </div>
  );
}
