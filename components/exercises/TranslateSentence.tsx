'use client';

import { useState, useMemo, useEffect } from 'react';
import { SkipForward } from 'lucide-react';
import { motion } from 'framer-motion';

interface Word { id: string; hanzi: string; pinyin: string; }
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
    return [...contentWords, ...distractors].sort(() => Math.random() - 0.5);
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
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'zh-CN';
    u.rate = 0.8;
    speechSynthesis.speak(u);
  };

  const isOptionUsed = (word: Word) => selected.some(w => w.id === word.id);

  if (!mounted) {
    return <div className="flex items-center justify-center flex-1"><div className="animate-spin w-6 h-6 border-3 border-duo-macaw border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="flex flex-col flex-1">
      {/* English prompt */}
      <div className="bg-white rounded-2xl border-2 border-b-4 border-duo-swan p-5 mb-4 text-center">
        <p className="text-sm text-duo-hare font-bold mb-2">Translate to Chinese:</p>
        <p className="text-lg font-bold text-duo-eel">{sentence.translation}</p>
      </div>

      {/* Selected words (answer area) */}
      <div className="min-h-[60px] bg-duo-polar rounded-xl border-2 border-dashed border-duo-swan p-3 mb-4 flex flex-wrap gap-2 items-center justify-center">
        {selected.length === 0 && (
          <span className="text-duo-hare text-sm">Tap words below to build the sentence</span>
        )}
        {selected.map((word, idx) => (
          <motion.button
            key={`${word.id}-${idx}`}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            onClick={() => handleOptionClick(word)}
            className={`px-3 py-1.5 rounded-lg border-2 border-b-4 font-bold text-sm transition-all ${
              feedback === 'wrong' ? 'border-duo-cardinal bg-duo-cardinal/10 text-duo-cardinal'
              : feedback === 'correct' ? 'border-duo-green bg-duo-green/10 text-duo-green-dark'
              : 'border-duo-macaw bg-duo-macaw/10 text-duo-eel'
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
          <button
            key={word.id}
            onClick={() => { handleOptionClick(word); playWord(word.hanzi); }}
            disabled={isOptionUsed(word) || feedback !== null}
            className={`px-3 py-2 rounded-lg border-2 border-b-4 font-bold text-sm transition-all ${
              isOptionUsed(word)
                ? 'border-transparent bg-duo-polar text-duo-polar'
                : 'border-duo-swan bg-white text-duo-eel hover:border-duo-macaw active:border-b-2'
            }`}
          >
            <span className="text-[10px] text-duo-macaw block">{word.pinyin}</span>
            {word.hanzi}
          </button>
        ))}
      </div>

      {/* Feedback */}
      {feedback === 'correct' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-duo-green/10 border-2 border-duo-green rounded-xl p-3 text-center mb-4">
          <p className="font-extrabold text-duo-green-dark">✓ Correct!</p>
        </motion.div>
      )}
      {feedback === 'wrong' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-duo-cardinal/10 border-2 border-duo-cardinal rounded-xl p-3 text-center mb-4">
          <p className="font-extrabold text-duo-cardinal mb-1">✗ Not quite</p>
          <p className="text-sm text-duo-eel">{contentWords.map(w => w.hanzi).join('')}</p>
        </motion.div>
      )}

      <div className="flex-1" />

      {/* Bottom buttons */}
      <div className="pb-6">
        {feedback ? (
          <button onClick={onComplete} className="w-full py-4 rounded-xl bg-duo-green border-b-4 border-duo-green-dark text-white font-extrabold text-lg active:border-b-2 transition-all">
            Continue
          </button>
        ) : (
          <div className="flex gap-3">
            <button onClick={onSkip} className="px-5 py-3 rounded-xl border-2 border-duo-swan text-duo-hare font-bold flex items-center gap-1 hover:border-duo-wolf">
              <SkipForward className="w-4 h-4" /> Skip
            </button>
            <button
              onClick={handleCheck}
              disabled={selected.length === 0}
              className={`flex-1 py-3 rounded-xl font-extrabold text-lg border-b-4 transition-all ${
                selected.length > 0
                  ? 'bg-duo-macaw border-duo-macaw-dark text-white active:border-b-2'
                  : 'bg-duo-swan border-duo-hare text-white cursor-not-allowed'
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
