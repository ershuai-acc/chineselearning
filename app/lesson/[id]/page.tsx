import { ShadowLessonPage } from './ShadowLessonClient';

export function generateStaticParams() {
  return [
    { id: 'soushenji-song-dingbo' },
    { id: 'shishuoxinyu-wang-lantian' },
    { id: 'mengxibitan-yi-chong-zhi-chong' },
    { id: 'blessing-new-year' },
    { id: 'blessing-wedding' },
    { id: 'blessing-birthday' },
    { id: 'love-flirting' },
    { id: 'love-sweet-talk' },
    { id: 'love-care' },
    { id: 'love-fight-makeup' },
    { id: 'swear-mild' },
    { id: 'swear-angry' },
    { id: 'swear-hardcore' },
  ];
}

export default function Page() {
  return <ShadowLessonPage />;
}
