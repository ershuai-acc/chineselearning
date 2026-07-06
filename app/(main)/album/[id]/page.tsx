import { AlbumDetailPage } from './AlbumDetailClient';

export function generateStaticParams() {
  return [
    { id: 'pinyin-initials' },
    { id: 'pinyin-finals' },
    { id: 'pinyin-tones' },
    { id: 'basics-blessing' },
    { id: 'basics-love' },
    { id: 'basics-swear' },
    { id: 'culture-festivals' },
    { id: 'culture-idioms' },
    { id: 'ancient-soushenji' },
    { id: 'ancient-shishuoxinyu' },
    { id: 'ancient-mengxibitan' },
  ];
}

export default function Page() {
  return <AlbumDetailPage />;
}
