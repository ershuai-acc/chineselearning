'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mic, SkipForward, Square, Volume2 } from 'lucide-react';
import { WordTooltip } from '../WordTooltip';
import { speak } from '@/lib/tts';

interface Word { id: string; hanzi: string; pinyin: string; meaning?: string; }
interface Sentence { id: string; text: string; pinyin: string; translation: string; words: Word[]; }

interface Props {
  sentence: Sentence;
  onComplete: () => void;
  onSkip: () => void;
}

export function ReadAloud({ sentence, onComplete, onSkip }: Props) {
  const [phase, setPhase] = useState<'ready' | 'recording' | 'feedback'>('ready');
  const [isPlaying, setIsPlaying] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const playAudio = () => {
    setIsPlaying(true);
    speak({ text: sentence.text, lang: 'zh-CN', rate: 0.8 }).finally(() => setIsPlaying(false));
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      recorder.onstop = () => {
        stream.getTracks().forEach(t => t.stop());
        setPhase('feedback');
      };
      recorder.start();
      setPhase('recording');
    } catch {
      setPhase('feedback');
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
  };

  const displayWords = sentence.words.filter(w => !/^[，。！？：、；""''（）]$/.test(w.hanzi));

  return (
    <div className="flex min-h-full flex-col">
      {/* Sentence card */}
      <div className="bg-ios-surface rounded-ios-xl shadow-ios p-5 mb-4">
        <div className="flex flex-wrap justify-center gap-x-2 gap-y-4">
          {displayWords.map(word => (
            <WordTooltip key={word.id} hanzi={word.hanzi} pinyin={word.pinyin} meaning={word.meaning}>
              <div className="flex flex-col items-center">
                <span className="text-[11px] text-duo-macaw font-medium mb-0.5">{word.pinyin}</span>
                <span className="text-2xl font-bold text-ios-dark">{word.hanzi}</span>
              </div>
            </WordTooltip>
          ))}
        </div>
      </div>

      {/* Translation feedback */}
      {phase === 'feedback' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-2 py-1 mb-4 text-center"
        >
          <p className="text-xs text-duo-green-dark font-semibold mb-1 uppercase tracking-wide">Meaning</p>
          <p className="text-base font-semibold text-ios-dark">{sentence.translation}</p>
        </motion.div>
      )}

      <div className="flex-1" />

      {/* Actions — always visible at bottom */}
      <div className="sticky bottom-0 mt-auto bg-[#F2F2F7] pt-2 pb-[max(var(--sab),1rem)]">
        {phase === 'feedback' ? (
          <button
            onClick={onComplete}
            className="w-full py-3.5 rounded-ios-xl bg-duo-green text-white font-semibold text-base shadow-ios
                       active:bg-duo-green-dark active:scale-[0.98] transition-all"
          >
            Continue
          </button>
        ) : (
          <div className="space-y-4">
            <button
              onClick={phase === 'recording' ? stopRecording : startRecording}
              className={`w-full min-h-[56px] rounded-ios-xl flex items-center justify-center gap-2 font-semibold text-base shadow-ios transition-all ${
                phase === 'recording'
                  ? 'bg-ios-red text-white scale-[1.01] animate-pulse'
                  : 'bg-duo-green text-white active:bg-duo-green-dark active:scale-[0.98]'
              }`}
            >
              {phase === 'recording' ? <Square className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              {phase === 'recording' ? 'Stop' : 'Speak'}
            </button>

            <div className="flex items-center justify-center gap-5">
              <button
                onClick={playAudio}
                disabled={isPlaying}
                className={`w-[52px] h-[52px] rounded-full flex items-center justify-center transition-all ${
                  isPlaying
                    ? 'bg-duo-green text-white scale-95'
                    : 'bg-ios-surface shadow-ios text-duo-green-dark active:bg-duo-green/10'
                }`}
              >
                <Volume2 className="w-6 h-6" />
              </button>

              <button
                onClick={onSkip}
                className="w-[52px] h-[52px] rounded-full flex items-center justify-center
                           bg-ios-surface shadow-ios text-ios-gray active:bg-ios-bg transition-all"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
