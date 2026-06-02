'use client';

import { useState, useMemo, useEffect } from 'react';
import { SkipForward } from 'lucide-react';
import { motion } from 'framer-motion';
import { WordTooltip } from '../WordTooltip';

interface Word { id: string; hanzi: string; pinyin: string; meaning?: string; }
interface Sentence { id: string; text: string; pinyin: string; translation: string; words: Word[]; }

interface Props {
  sentence: Sentence;
  allSentences: Sentence[];
  onComplete: () => void;
  onSkip: () => void;
}

export function FillBlank({ sentence, allSentences, onComplete, onSkip }: Props) {
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const contentWords = useMemo(() => 
    sentence.words.filter(w => !/^[，。！？：、；""''（）]$/.test(w.hanzi)),
    [sentence]
  );

  // Pick a random word to blank out (prefer content words > 1 char)
  const blankTarget = useMemo(() => {
    if (!mounted) return contentWords[0]; // SSR fallback
    const candidates = contentWords.filter(w => w.hanzi.length >= 2);
    const pool = candidates.length > 0 ? candidates : contentWords;
    return pool[Math.floor(Math.random() * pool.length)];
  }, [contentWords, mounted]);

  // Generate options: correct + distractors
  const options = useMemo(() => {
    if (!mounted || !blankTarget) return [];
    const distractors: Word[] = [];
    const usedHanzi = new Set([blankTarget.hanzi]);

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

    return [blankTarget, ...distractors].sort(() => Math.random() - 0.5);
  }, [blankTarget, allSentences, mounted]);

  const handleSelect = (word: Word) => {
    if (feedback || !blankTarget) return;
    setSelectedWord(word);
    const isCorrect = word.hanzi === blankTarget.hanzi;
    setFeedback(isCorrect ? 'correct' : 'wrong');
  };

  const playWord = (text: string) => {
    if (typeof window === 'undefined') return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'zh-CN';
    u.rate = 0.8;
    speechSynthesis.speak(u);
  };

  if (!mounted || !blankTarget) {
    return <div className="flex items-center justify-center flex-1"><div className="animate-spin w-6 h-6 border-3 border-duo-macaw border-t-transparent rounded-full" /></div>;
  }

  // Build sentence display with blank
  const renderSentence = () => {
    return sentence.words.map(w => {
      if (w.id === blankTarget.id) {
        if (feedback && selectedWord) {
          return (
            <span key={w.id} className={`inline-block px-2 py-0.5 rounded font-bold ${
              feedback === 'correct' ? 'bg-duo-green/20 text-duo-green-dark' : 'bg-duo-cardinal/20 text-duo-cardinal'
            }`}>
              {selectedWord.hanzi}
            </span>
          );
        }
        return (
          <span key={w.id} className="inline-block w-16 h-8 border-b-2 border-duo-macaw mx-1 align-bottom" />
        );
      }
      return <span key={w.id} className="text-duo-eel">{w.hanzi}</span>;
    });
  };

  return (
    <div className="flex flex-col flex-1">
      {/* Sentence with blank */}
      <div className="bg-white rounded-2xl border-2 border-b-4 border-duo-swan p-6 mb-4 text-center">
        <p className="text-sm text-duo-hare font-bold mb-3">Fill in the blank:</p>
        <p className="text-2xl font-bold leading-relaxed">
          {renderSentence()}
        </p>
        <p className="text-sm text-duo-wolf mt-3 italic">{sentence.translation}</p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {options.map(word => {
          const isSelected = selectedWord?.id === word.id;
          const isCorrectAnswer = word.hanzi === blankTarget.hanzi;
          let borderClass = 'border-duo-swan bg-white text-duo-eel hover:border-duo-macaw';
          
          if (feedback && isSelected && feedback === 'correct') {
            borderClass = 'border-duo-green bg-duo-green/10 text-duo-green-dark';
          } else if (feedback && isSelected && feedback === 'wrong') {
            borderClass = 'border-duo-cardinal bg-duo-cardinal/10 text-duo-cardinal';
          } else if (feedback && isCorrectAnswer) {
            borderClass = 'border-duo-green bg-duo-green/5 text-duo-green-dark';
          }

          return (
            <WordTooltip key={word.id} hanzi={word.hanzi} pinyin={word.pinyin} meaning={word.meaning}>
              <button
                onClick={(e) => { e.stopPropagation(); playWord(word.hanzi); handleSelect(word); }}
                disabled={feedback !== null}
                className={`flex flex-col items-center p-3 rounded-xl border-2 border-b-4 font-bold transition-all active:border-b-2 w-full ${borderClass}`}
              >
                <span className="text-[11px] text-duo-macaw mb-0.5">{word.pinyin}</span>
                <span className="text-xl">{word.hanzi}</span>
              </button>
            </WordTooltip>
          );
        })}
      </div>

      {/* Feedback */}
      {feedback === 'wrong' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-duo-cardinal/10 border-2 border-duo-cardinal rounded-xl p-3 text-center mb-4">
          <p className="text-sm text-duo-cardinal font-bold">Correct answer: <span className="text-duo-eel">{blankTarget.hanzi}</span> ({blankTarget.pinyin})</p>
          {blankTarget.meaning && <p className="text-xs text-duo-wolf mt-1">{blankTarget.meaning}</p>}
        </motion.div>
      )}
      {feedback === 'correct' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-duo-green/10 border-2 border-duo-green rounded-xl p-3 text-center mb-4">
          <p className="font-extrabold text-duo-green-dark">✓ Correct! — {blankTarget.hanzi}</p>
          {blankTarget.meaning && <p className="text-xs text-duo-wolf mt-1">{blankTarget.meaning}</p>}
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
