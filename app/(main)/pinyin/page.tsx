'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

interface Album {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
}

interface CourseGroup {
  id: string;
  title: string;
  titleEn: string;
  albums: Album[];
}

export default function PinyinPage() {
  const [pinyinGroup, setPinyinGroup] = useState<CourseGroup | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/albums')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.groups) {
          const pinyin = data.groups.find((g: CourseGroup) => g.id === 'pinyin');
          if (pinyin) setPinyinGroup(pinyin);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-duo-macaw" />
      </div>
    );
  }

  if (!pinyinGroup) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <span className="text-5xl mb-4">🔤</span>
        <h1 className="text-2xl font-extrabold text-duo-eel mb-2">Pinyin</h1>
        <p className="text-duo-hare font-bold">Coming soon...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-duo-snow">
      <div className="max-w-4xl mx-auto w-full px-4 py-12 md:py-16">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-duo-eel mb-2">Pinyin</h1>
          <p className="text-duo-hare font-bold text-lg">Learn the sounds of Mandarin Chinese</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {pinyinGroup.albums.map(album => (
            <Link
              key={album.id}
              href={`/album/${album.id}`}
              className="group flex flex-col items-center rounded-2xl bg-white border-2 border-b-4 border-duo-swan hover:border-duo-macaw hover:-translate-y-1 active:translate-y-0.5 active:border-b-2 transition-all duration-200 p-6"
            >
              <span className="text-4xl mb-3">{album.icon}</span>
              <span className="text-lg font-extrabold text-duo-eel text-center mb-1">{album.name}</span>
              <span className="text-sm font-bold text-duo-hare text-center">{album.nameEn}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
