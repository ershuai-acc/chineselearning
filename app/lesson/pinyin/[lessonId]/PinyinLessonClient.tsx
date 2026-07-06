'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { X, Volume2, Loader2 } from 'lucide-react';
import { useUser } from '@/lib/UserContext';
import { apiUrl } from '@/lib/api-client';
import { speak } from '@/lib/tts';
import { stableShuffle, pickStable } from '@/lib/stable-shuffle';
import { getLocalLessonDetail } from '@/lib/local-course-data';

type Phase = 'learn' | 'practice' | 'complete';

interface PinyinChar {
  char: string;
  pinyin: string;
}

interface PinyinWord {
  chinese: string;
  chars: PinyinChar[];
  english: string;
  tone: number;
}

interface LessonContent {
  type: string;
  groupType: 'initial' | 'final' | 'tone';
  key: string;
  label: string;
  words: PinyinWord[];
}

function playAudio(text: string) {
  if (typeof window === 'undefined') return;
  speak({ text, lang: 'zh-CN', rate: 0.8 });
}

function highlightPinyin(pinyin: string, groupType: string, groupKey: string): string {
  if (groupType === 'initial') {
    if (pinyin.indexOf(groupKey) === 0) {
      return `<span class="text-orange-500 font-extrabold">${groupKey}</span>${pinyin.substring(groupKey.length)}`;
    }
    return pinyin;
  } else if (groupType === 'final') {
    const initials = ['zh','ch','sh','b','p','m','f','d','t','n','l','g','k','h','j','q','x','r','z','c','s','y','w'];
    let initialLen = 0;
    for (const init of initials) {
      if (pinyin.indexOf(init) === 0) { initialLen = init.length; break; }
    }
    const finalPart = pinyin.substring(initialLen);
    if (finalPart.length > 0) {
      return `${pinyin.substring(0, initialLen)}<span class="text-orange-500 font-extrabold">${finalPart}</span>`;
    }
    return pinyin;
  } else if (groupType === 'tone') {
    const toneChars = 'āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ';
    let result = '';
    for (const ch of pinyin) {
      if (toneChars.includes(ch)) {
        result += `<span class="text-orange-500 font-extrabold">${ch}</span>`;
      } else {
        result += ch;
      }
    }
    return result;
  }
  return pinyin;
}

export function PinyinLessonPage() {
  const params = useParams();
  const router = useRouter();
  const { userId } = useUser();
  const lessonId = typeof params?.lessonId === 'string' ? params.lessonId : '';

  const [content, setContent] = useState<LessonContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [phase, setPhase] = useState<Phase>('learn');
  const [learnIndex, setLearnIndex] = useState(0);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [practiceQuestions, setPracticeQuestions] = useState<{ target: PinyinWord; options: PinyinWord[] }[]>([]);

  useEffect(() => {
    if (!lessonId) return;
    const local = getLocalLessonDetail(lessonId);
    if (local && 'content' in local.lesson && local.lesson.content) {
      setContent(local.lesson.content);
      setIsLoading(false);
    }

    fetch(apiUrl(`/api/lessons/${lessonId}`))
      .then(res => res.json())
      .then(data => {
        if (data.success && data.lesson) {
          setContent(data.lesson.content?.type ? data.lesson.content : data.lesson.content?.content);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [lessonId]);

  useEffect(() => {
    if (content && phase === 'learn' && content.words[learnIndex]) {
      playAudio(content.words[learnIndex].chinese);
    }
  }, [learnIndex, phase, content]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[100dvh]">
        <Loader2 className="w-8 h-8 animate-spin text-duo-macaw" />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[100dvh] p-6">
        <p className="text-xl font-bold text-gray-600">Lesson not found</p>
        <button onClick={() => router.back()} className="mt-4 text-duo-macaw font-bold">Back</button>
      </div>
    );
  }

  const words = content.words;
  const groupType = content.groupType;
  const groupKey = content.key;
  const groupLabel = content.label;

  const albumId = lessonId.startsWith('pinyin-initial-') ? 'pinyin-initials'
    : lessonId.startsWith('pinyin-final-') ? 'pinyin-finals'
    : lessonId.startsWith('pinyin-tone-') ? 'pinyin-tones'
    : '';

  function generatePracticeQuestions() {
    return words.map(word => {
      const others = words.filter(w => w.chinese !== word.chinese);
      const distractor = pickStable(others, `${lessonId}:${word.chinese}:distractor`) ?? word;
      const options = stableShuffle([word, distractor], `${lessonId}:${word.chinese}:options`);
      return { target: word, options };
    });
  }

  function handleNextLearn() {
    if (learnIndex < words.length - 1) {
      setLearnIndex(learnIndex + 1);
    } else {
      const questions = generatePracticeQuestions();
      setPracticeQuestions(questions);
      setPracticeIndex(0);
      setPhase('practice');
    }
  }

  function handleCheckAnswer() {
    if (selectedOption === null) return;
    const q = practiceQuestions[practiceIndex];
    const correct = q.options[selectedOption] === q.target;
    setIsCorrect(correct);
    setShowFeedback(true);
    if (correct) playAudio(q.target.chinese);
  }

  function handleNextPractice() {
    setShowFeedback(false);
    setSelectedOption(null);
    if (practiceIndex < practiceQuestions.length - 1) {
      setPracticeIndex(practiceIndex + 1);
    } else {
      setPhase('complete');
      if (userId && lessonId) {
        fetch(apiUrl('/api/progress'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            lessonId,
            levelProgress: { completed: true, completedAt: new Date().toISOString() },
          }),
        }).catch(console.error);
      }
    }
  }

  // LEARN PHASE
  if (phase === 'learn') {
    const word = words[learnIndex];
    const progress = (learnIndex / words.length) * 100;

    return (
      <div className="lesson-shell bg-duo-snow">
        <div className="lesson-header flex items-center gap-4 p-4 sticky top-0 bg-duo-snow z-10">
          <button onClick={() => router.back()} className="text-duo-hare p-2">
            <X className="w-6 h-6" />
          </button>
          <div className="flex-1 h-3 bg-duo-swan rounded-full overflow-hidden">
            <div className="h-full bg-duo-green rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-sm font-extrabold text-duo-macaw min-w-[40px] text-center">{groupLabel}</span>
        </div>

        <div className="lesson-scroll flex flex-col items-center justify-center px-6 text-center">
          <div className="flex gap-4 mb-2">
            {word.chars.map((ch, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-lg text-duo-macaw" dangerouslySetInnerHTML={{ __html: highlightPinyin(ch.pinyin, groupType, groupKey) }} />
                <span className="text-6xl font-extrabold">{ch.char}</span>
              </div>
            ))}
          </div>
          <p className="text-xl text-duo-hare mb-10">{word.english}</p>

          <button onClick={() => playAudio(word.chinese)} className="w-20 h-20 rounded-full bg-duo-macaw flex items-center justify-center shadow-[0_4px_0_#1899D6] active:translate-y-1 active:shadow-none transition-all">
            <Volume2 className="w-9 h-9 text-white" />
          </button>
        </div>

        <div className="lesson-bottom p-4 border-t-2 border-duo-swan bg-white">
          <button onClick={handleNextLearn} className="w-full py-4 bg-duo-green text-white font-extrabold text-lg rounded-2xl border-b-4 border-[#58A700] active:border-b-0 active:translate-y-1 transition-all">
            {learnIndex === words.length - 1 ? 'Start Practice' : 'Continue'}
          </button>
        </div>
      </div>
    );
  }

  // PRACTICE PHASE
  if (phase === 'practice') {
    const q = practiceQuestions[practiceIndex];
    const progress = (practiceIndex / practiceQuestions.length) * 100;

    return (
      <div className="lesson-shell bg-duo-snow">
        <div className="lesson-header flex items-center gap-4 p-4 sticky top-0 bg-duo-snow z-10">
          <button onClick={() => router.back()} className="text-duo-hare p-2">
            <X className="w-6 h-6" />
          </button>
          <div className="flex-1 h-3 bg-duo-swan rounded-full overflow-hidden">
            <div className="h-full bg-duo-green rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="lesson-scroll flex flex-col px-4 pt-4">
          <h2 className="text-xl font-extrabold text-duo-eel mb-6">What did you hear?</h2>

          <div className="flex justify-center mb-8">
            <button onClick={() => playAudio(q.target.chinese)} className="w-24 h-24 rounded-full bg-duo-macaw flex items-center justify-center shadow-[0_4px_0_#1899D6] active:translate-y-1 active:shadow-none transition-all">
              <Volume2 className="w-12 h-12 text-white" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {q.options.map((opt: PinyinWord, idx: number) => (
              <button
                key={idx}
                disabled={showFeedback}
                onClick={() => setSelectedOption(idx)}
                className={`p-4 rounded-2xl border-2 border-b-4 text-center transition-all ${
                  showFeedback
                    ? opt === q.target
                      ? 'border-duo-green bg-green-50 shadow-[0_4px_0_#58A700]'
                      : selectedOption === idx
                        ? 'border-red-400 bg-red-50 opacity-60'
                        : 'border-duo-swan'
                    : selectedOption === idx
                      ? 'border-duo-macaw bg-blue-50 shadow-[0_4px_0_#1899D6]'
                      : 'border-duo-swan bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex justify-center gap-2 mb-1">
                  {opt.chars.map((ch, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <span className="text-sm text-duo-hare" dangerouslySetInnerHTML={{ __html: highlightPinyin(ch.pinyin, groupType, groupKey) }} />
                      <span className="text-3xl font-extrabold">{ch.char}</span>
                    </div>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        {showFeedback ? (
          <div className={`lesson-bottom p-6 ${isCorrect ? 'bg-green-50' : 'bg-red-50'} border-t-2 ${isCorrect ? 'border-green-200' : 'border-red-200'}`}>
            <p className={`text-lg font-extrabold mb-1 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
              {isCorrect ? 'Correct' : 'Try again'}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              {q.target.chars.map((c) => c.pinyin).join(' ')}
            </p>
            <button onClick={handleNextPractice} className={`w-full py-4 text-white font-extrabold text-lg rounded-2xl border-b-4 active:border-b-0 active:translate-y-1 transition-all ${isCorrect ? 'bg-duo-green border-[#58A700]' : 'bg-red-500 border-red-600'}`}>
              Continue
            </button>
          </div>
        ) : (
          <div className="lesson-bottom p-4 border-t-2 border-duo-swan bg-white">
            <button onClick={handleCheckAnswer} disabled={selectedOption === null} className="w-full py-4 bg-duo-green text-white font-extrabold text-lg rounded-2xl border-b-4 border-[#58A700] active:border-b-0 active:translate-y-1 transition-all disabled:bg-gray-200 disabled:border-gray-300 disabled:text-gray-400">
              Check
            </button>
          </div>
        )}
      </div>
    );
  }

  // COMPLETE PHASE
  return (
    <div className="lesson-shell bg-duo-snow items-center justify-center text-center p-6">
      <div className="text-6xl mb-6 animate-bounce">🎉</div>
      <h2 className="text-3xl font-extrabold text-duo-green mb-4">Great work!</h2>
      <p className="text-lg text-duo-hare mb-8">You completed this lesson.</p>
      <button onClick={() => router.push(`/album/${albumId}`)} className="w-full max-w-sm py-4 bg-duo-green text-white font-extrabold text-lg rounded-2xl border-b-4 border-[#58A700] active:border-b-0 active:translate-y-1 transition-all">
        Continue
      </button>
    </div>
  );
}
