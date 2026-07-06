'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { X, SkipForward, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ReadAloud } from '@/components/exercises/ReadAloud';
import { TranslateSentence } from '@/components/exercises/TranslateSentence';
import { FillBlank } from '@/components/exercises/FillBlank';
import { ListenChoose } from '@/components/exercises/ListenChoose';
import { getAnonymousUser } from '@/lib/anonymous-user';

interface Word {
  id: string;
  hanzi: string;
  pinyin: string;
}

interface Sentence {
  id: string;
  text: string;
  pinyin: string;
  translation: string;
  words: Word[];
}

interface LessonData {
  id: string;
  title: string;
  titleEn: string;
  sentences: Sentence[];
}

interface AlbumInfo {
  id: string;
  name: string;
}

export type ExerciseMode = 'read-aloud' | 'translate' | 'fill-blank' | 'listen-choose';

const MODES: { type: ExerciseMode; title: string; icon: string }[] = [
  { type: 'read-aloud', title: 'Read Aloud', icon: '🗣️' },
  { type: 'translate', title: 'Translate', icon: '🔄' },
  { type: 'fill-blank', title: 'Fill in the Blank', icon: '✏️' },
  { type: 'listen-choose', title: 'Listen & Choose', icon: '👂' },
];

export default function ShadowLessonPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = typeof params?.id === 'string' ? params.id : '';

  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [album, setAlbum] = useState<AlbumInfo | null>(null);
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState(0);
  const [currentModeIdx, setCurrentModeIdx] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!lessonId) return;
    fetch(`/api/lessons/${lessonId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setLesson(data.lesson);
          if (data.album) setAlbum(data.album);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [lessonId]);

  useEffect(() => {
    if (!lessonId) return;
    const saved = localStorage.getItem(`shadow-progress-${lessonId}`);
    if (saved) {
      try {
        const { sentenceIdx, modeIdx } = JSON.parse(saved);
        setCurrentSentenceIdx(sentenceIdx);
        setCurrentModeIdx(modeIdx);
      } catch {}
    }
  }, [lessonId]);

  const saveProgress = useCallback((sentenceIdx: number, modeIdx: number) => {
    localStorage.setItem(`shadow-progress-${lessonId}`, JSON.stringify({ sentenceIdx, modeIdx }));
  }, [lessonId]);

  const reportCompletion = useCallback(async () => {
    if (!lesson || !album) return;
    try {
      const { userId, codeName } = getAnonymousUser();
      await fetch('/api/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          codeName,
          lessonId: lesson.id,
          source: album.name,
        }),
      });
    } catch {
      // Silently fail - leaderboard is secondary
    }
  }, [lesson, album]);

  const advanceToNext = useCallback(() => {
    if (!lesson) return;
    if (currentModeIdx < MODES.length - 1) {
      const next = currentModeIdx + 1;
      setCurrentModeIdx(next);
      saveProgress(currentSentenceIdx, next);
    } else if (currentSentenceIdx < lesson.sentences.length - 1) {
      // Sentence completed! Record to leaderboard
      reportCompletion();
      const next = currentSentenceIdx + 1;
      setCurrentSentenceIdx(next);
      setCurrentModeIdx(0);
      saveProgress(next, 0);
    } else {
      // Final sentence completed
      reportCompletion();
      localStorage.removeItem(`shadow-progress-${lessonId}`);
      router.push('/');
    }
  }, [lesson, currentModeIdx, currentSentenceIdx, saveProgress, lessonId, router, reportCompletion]);

  const currentSentence = lesson?.sentences[currentSentenceIdx];
  const currentMode = MODES[currentModeIdx];

  const playCurrentSentence = useCallback(() => {
    if (!currentSentence || typeof window === 'undefined') return;
    const u = new SpeechSynthesisUtterance(currentSentence.text);
    u.lang = 'zh-CN';
    u.rate = 0.8;
    speechSynthesis.speak(u);
  }, [currentSentence]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[100dvh] bg-duo-snow">
        <div className="animate-spin w-8 h-8 border-4 border-duo-macaw border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!lesson || !currentSentence) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-duo-snow p-6">
        <p className="text-duo-eel text-xl font-bold">Lesson not found</p>
        <button onClick={() => router.back()} className="mt-4 text-duo-macaw font-bold">Go back</button>
      </div>
    );
  }

  const totalSteps = lesson.sentences.length * MODES.length;
  const currentStep = currentSentenceIdx * MODES.length + currentModeIdx + 1;
  const progressPercent = (currentStep / totalSteps) * 100;

  return (
    <div className="flex flex-col min-h-[100dvh] bg-duo-snow">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-duo-snow px-4 pt-4 pb-2">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-duo-polar">
            <X className="w-6 h-6 text-duo-hare" />
          </button>
          <div className="flex-1 h-3 bg-duo-swan rounded-full overflow-hidden">
            <motion.div className="h-full bg-duo-green rounded-full" animate={{ width: `${progressPercent}%` }} transition={{ duration: 0.3 }} />
          </div>
          <span className="text-sm font-bold text-duo-hare min-w-[3rem] text-right">
            {currentSentenceIdx + 1}/{lesson.sentences.length}
          </span>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center px-4 pt-4 pb-4 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentSentenceIdx}-${currentModeIdx}`}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-lg flex-1 flex flex-col"
          >
            {/* Mode title + sentence audio */}
            <div className="text-center mb-4">
              <span className="text-xl">{currentMode.icon}</span>
              <h2 className="text-base font-extrabold text-duo-eel">{currentMode.title}</h2>
              <button
                onClick={playCurrentSentence}
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-duo-macaw/10 text-duo-macaw text-sm font-bold hover:bg-duo-macaw/20 active:scale-95 transition-all"
              >
                <Volume2 className="w-4 h-4" />
                Play sentence
              </button>
            </div>

            {/* Mode dots */}
            <div className="flex justify-center gap-2 mb-5">
              {MODES.map((m, idx) => (
                <div key={m.type} className={`w-2.5 h-2.5 rounded-full ${idx < currentModeIdx ? 'bg-duo-green' : idx === currentModeIdx ? 'bg-duo-macaw' : 'bg-duo-swan'}`} />
              ))}
            </div>

            {/* Exercise component */}
            <div className="flex-1 flex flex-col">
              {currentMode.type === 'read-aloud' && (
                <ReadAloud sentence={currentSentence} onComplete={advanceToNext} onSkip={advanceToNext} />
              )}
              {currentMode.type === 'translate' && (
                <TranslateSentence sentence={currentSentence} allSentences={lesson.sentences} onComplete={advanceToNext} onSkip={advanceToNext} />
              )}
              {currentMode.type === 'fill-blank' && (
                <FillBlank sentence={currentSentence} allSentences={lesson.sentences} onComplete={advanceToNext} onSkip={advanceToNext} />
              )}
              {currentMode.type === 'listen-choose' && (
                <ListenChoose sentence={currentSentence} allSentences={lesson.sentences} onComplete={advanceToNext} onSkip={advanceToNext} />
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
