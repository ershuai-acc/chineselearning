'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Lesson {
  id: string;
  title: string;
  coverImage?: string | null;
  language: string;
  albumId: string | null;
}

interface AlbumInfo {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
}

export default function AlbumDetailPage() {
  const params = useParams();
  const router = useRouter();
  const albumId = typeof params?.id === 'string' ? params.id : '';

  const [albumInfo, setAlbumInfo] = useState<AlbumInfo | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!albumId) return;

    // Fetch album info from albums API
    const fetchAlbum = fetch('/api/albums')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.groups) {
          for (const group of data.groups) {
            const found = group.albums.find((a: AlbumInfo) => a.id === albumId);
            if (found) {
              setAlbumInfo(found);
              break;
            }
          }
        }
      });

    // Fetch lessons for this album
    const fetchLessons = fetch(`/api/lessons?albumId=${albumId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.lessons) {
          setLessons(data.lessons);
        }
      });

    Promise.all([fetchAlbum, fetchLessons])
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [albumId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[100dvh]">
        <Loader2 className="w-8 h-8 animate-spin text-duo-macaw" />
      </div>
    );
  }

  if (!albumInfo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-duo-polar text-center px-4">
        <span className="text-5xl mb-4">😢</span>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">课程不存在</h1>
        <button onClick={() => router.push('/')} className="mt-4 bg-duo-macaw text-white font-bold py-3 px-8 rounded-xl">
          返回首页
        </button>
      </div>
    );
  }

  const isPinyin = albumId.startsWith('pinyin-');

  return (
    <div className="min-h-[100dvh] bg-duo-snow pb-24">
      <div className="max-w-4xl mx-auto w-full px-4 pt-6 md:pt-10">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => router.back()}
            className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors mr-4 text-gray-500"
          >
            <ArrowLeft className="w-6 h-6 stroke-[2.5]" />
          </button>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{albumInfo.icon}</span>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800">{albumInfo.name}</h1>
              <p className="text-sm text-duo-hare font-bold">{albumInfo.nameEn}</p>
            </div>
          </div>
        </div>

        {lessons.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 md:gap-4">
            {lessons.map((lesson) => {
              // Extract short label from lesson title (e.g. "声母 b" -> "b")
              const label = lesson.title.split(' ').pop() || lesson.title;
              return (
                <Link
                  key={lesson.id}
                  href={isPinyin ? `/lesson/pinyin/${lesson.id}` : `/lesson/${lesson.id}`}
                  className="flex flex-col items-center bg-white border-2 border-b-4 border-duo-swan rounded-2xl p-4 hover:border-duo-macaw hover:-translate-y-1 active:translate-y-0.5 active:border-b-2 transition-all"
                >
                  <span className="text-2xl font-extrabold text-duo-eel mb-1">{label}</span>
                  <span className="text-xs text-duo-hare font-bold">{lesson.title}</span>
                </Link>
              );
            })}
          </div>
        ) : (
          /* No lessons placeholder */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-6xl mb-4">🚧</span>
            <h2 className="text-2xl font-extrabold text-duo-eel mb-2">课程开发中</h2>
            <p className="text-duo-hare font-bold">该课程内容正在准备中，敬请期待！</p>
          </div>
        )}
      </div>
    </div>
  );
}
