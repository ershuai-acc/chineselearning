'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ReadAloud } from '@/components/exercises/ReadAloud';
import { TranslateSentence } from '@/components/exercises/TranslateSentence';
import { FillBlank } from '@/components/exercises/FillBlank';
import { ListenChoose } from '@/components/exercises/ListenChoose';
import { getAnonymousUser } from '@/lib/anonymous-user';
import { apiUrl } from '@/lib/api-client';
import { getLocalLessonDetail } from '@/lib/local-course-data';

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

const MODES: { type: ExerciseMode; title: string }[] = [
  { type: 'read-aloud', title: 'Read Aloud' },
  { type: 'translate', title: 'Translate' },
  { type: 'fill-blank', title: 'Fill the Blank' },
  { type: 'listen-choose', title: 'Listen & Choose' },
];

export function ShadowLessonPage() {
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
    const local = getLocalLessonDetail(lessonId);
    if (local && 'sentences' in local.lesson && Array.isArray(local.lesson.sentences)) {
      setLesson(local.lesson as LessonData);
      if (local.album) setAlbum(local.album);
      setIsLoading(false);
    }

    fetch(apiUrl(`/api/lessons/${lessonId}`))
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setLesson(data.lesson.content ? { ...data.lesson.content, id: data.lesson.id } : data.lesson);
          if (data.album) setAlbum(data.album);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [lessonId]);

  useEffect(() => {
    if (!lessonId) return;
    const shouldContinue = new URLSearchParams(window.location.search).get('continue') === '1';
    if (!shouldContinue) {
      localStorage.removeItem(`shadow-progress-${lessonId}`);
      setCurrentSentenceIdx(0);
      setCurrentModeIdx(0);
      return;
    }
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
      await fetch(apiUrl('/api/completions'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          codeName,
          lessonId: lesson.id,
          source: album.name,
        }),
      });
    } catch {}
  }, [lesson, album]);

  const advanceToNext = useCallback(() => {
    if (!lesson) return;
    if (currentModeIdx < MODES.length - 1) {
      const next = currentModeIdx + 1;
      setCurrentModeIdx(next);
      saveProgress(currentSentenceIdx, next);
    } else if (currentSentenceIdx < lesson.sentences.length - 1) {
      reportCompletion();
      const next = currentSentenceIdx + 1;
      setCurrentSentenceIdx(next);
      setCurrentModeIdx(0);
      saveProgress(next, 0);
    } else {
      reportCompletion();
      localStorage.removeItem(`shadow-progress-${lessonId}`);
      router.push('/');
    }
  }, [lesson, currentModeIdx, currentSentenceIdx, saveProgress, lessonId, router, reportCompletion]);

  const currentSentence = lesson?.sentences[currentSentenceIdx];
  const currentMode = MODES[currentModeIdx];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[100dvh] bg-[#F2F2F7]">
        <div className="w-8 h-8 border-[3px] border-[#007AFF]/20 border-t-[#007AFF] rounded-full animate-spin" />
      </div>
    );
  }

  if (!lesson || !currentSentence) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-[#F2F2F7] p-6">
        <p className="text-[#1C1C1E] text-[1.0625rem] font-semibold">Lesson not found</p>
        <button onClick={() => router.back()} className="btn-ghost mt-4">Go back</button>
      </div>
    );
  }

  const totalSteps = lesson.sentences.length * MODES.length;
  const currentStep = currentSentenceIdx * MODES.length + currentModeIdx + 1;
  const progressPercent = (currentStep / totalSteps) * 100;

  return (
    <div className="lesson-shell">
      <header className="lesson-header shrink-0 z-10 bg-[#F2F2F7]/90 backdrop-blur-xl border-b border-black/5">
        <div className="flex items-center gap-3 px-3 py-2.5 max-w-lg mx-auto">
          <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center active:opacity-50">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-3 mb-1.5">
              <span className="text-[0.75rem] font-semibold text-[#1C1C1E] truncate">{currentMode.title}</span>
              <span className="text-[0.75rem] font-semibold text-[#8E8E93] tabular-nums shrink-0">{currentStep}/{totalSteps}</span>
            </div>
            <div className="h-1.5 bg-[#E5E5EA] rounded-full overflow-hidden">
            <motion.div className="h-full bg-[#007AFF] rounded-full" animate={{ width: `${progressPercent}%` }} transition={{ duration: 0.3, ease: 'easeOut' }}/>
            </div>
          </div>
        </div>
      </header>

      <div className="lesson-scroll">
        <div className="w-full max-w-lg mx-auto px-4 pt-4 pb-6">
          <AnimatePresence mode="wait">
            <motion.div key={`${currentSentenceIdx}-${currentModeIdx}`} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.2, ease: 'easeOut' }}>
              <div>
                {currentMode.type === 'read-aloud' && <ReadAloud sentence={currentSentence} onComplete={advanceToNext} onSkip={advanceToNext}/>}
                {currentMode.type === 'translate' && <TranslateSentence sentence={currentSentence} allSentences={lesson.sentences} onComplete={advanceToNext} onSkip={advanceToNext}/>}
                {currentMode.type === 'fill-blank' && <FillBlank sentence={currentSentence} allSentences={lesson.sentences} onComplete={advanceToNext} onSkip={advanceToNext}/>}
                {currentMode.type === 'listen-choose' && <ListenChoose sentence={currentSentence} allSentences={lesson.sentences} onComplete={advanceToNext} onSkip={advanceToNext}/>}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
