import { PinyinLessonPage } from './PinyinLessonClient';

export function generateStaticParams() {
  const initials = ['b','p','m','f','d','t','n','l','g','k','h','j','q','x','zh','ch','sh','r','z','c','s','y','w'];
  const finals = ['a','o','e','i','u','ü','ai','ei','ao','ou','an','en','ang','eng','ong'];
  const tones = ['tone1','tone2','tone3','tone4','tone0'];

  return [
    ...initials.map(key => ({ lessonId: `pinyin-initial-${key}` })),
    ...finals.map(key => ({ lessonId: `pinyin-final-${key}` })),
    ...tones.map(key => ({ lessonId: `pinyin-tone-${key}` })),
  ];
}

export default function Page() {
  return <PinyinLessonPage />;
}
