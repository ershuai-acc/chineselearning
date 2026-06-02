'use client';

import { useState, useRef } from 'react';
import { Volume2, Mic, MicOff, SkipForward, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { WordTooltip } from '../WordTooltip';

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
    const utterance = new SpeechSynthesisUtterance(sentence.text);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.8;
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    speechSynthesis.speak(utterance);
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
    } catch (e) {
      console.error('Mic access denied', e);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
  };

  // Filter out punctuation words for display
  const displayWords = sentence.words.filter(w => !/^[，。！？：、；""''（）]$/.test(w.hanzi));

  return (
    <div className="flex flex-col flex-1">
      {/* Sentence card with pinyin */}
      <div className="bg-white rounded-2xl border-2 border-b-4 border-duo-swan p-6 mb-4">
        <div className="flex flex-wrap justify-center gap-x-2 gap-y-4">
          {displayWords.map(word => (
            <WordTooltip key={word.id} hanzi={word.hanzi} pinyin={word.pinyin} meaning={word.meaning}>
              <div className="flex flex-col items-center">
                <span className="text-[11px] text-duo-macaw font-medium mb-0.5">{word.pinyin}</span>
                <span className="text-2xl font-bold text-duo-eel">{word.hanzi}</span>
              </div>
            </WordTooltip>
          ))}
        </div>
      </div>

      {/* Feedback: show translation */}
      {phase === 'feedback' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-duo-green/10 border-2 border-duo-green rounded-xl p-4 mb-4 text-center"
        >
          <p className="text-sm font-bold text-duo-green-dark mb-1">English meaning:</p>
          <p className="text-lg font-bold text-duo-eel">{sentence.translation}</p>
        </motion.div>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Actions */}
      <div className="pb-6">
        {phase === 'feedback' ? (
          <button
            onClick={onComplete}
            className="w-full py-4 rounded-xl bg-duo-green border-b-4 border-duo-green-dark text-white font-extrabold text-lg active:border-b-2 active:mt-0.5 transition-all"
          >
            Continue
          </button>
        ) : (
          <div className="flex items-center justify-center gap-4">
            {/* Play */}
            <button
              onClick={playAudio}
              disabled={isPlaying}
              className={`w-14 h-14 rounded-full flex items-center justify-center border-2 border-b-4 transition-all ${
                isPlaying ? 'bg-duo-macaw border-duo-macaw-dark text-white scale-95' : 'bg-white border-duo-swan text-duo-macaw hover:border-duo-macaw'
              }`}
            >
              <Volume2 className="w-6 h-6" />
            </button>

            {/* Record */}
            <button
              onClick={phase === 'recording' ? stopRecording : startRecording}
              className={`w-16 h-16 rounded-full flex items-center justify-center border-2 border-b-4 transition-all ${
                phase === 'recording'
                  ? 'bg-duo-cardinal border-duo-cardinal-dark text-white animate-pulse scale-110'
                  : 'bg-white border-duo-swan text-duo-cardinal hover:border-duo-cardinal'
              }`}
            >
              {phase === 'recording' ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
            </button>

            {/* Skip */}
            <button
              onClick={onSkip}
              className="w-14 h-14 rounded-full flex items-center justify-center border-2 border-b-4 border-duo-swan bg-white text-duo-hare hover:text-duo-wolf transition-all"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
