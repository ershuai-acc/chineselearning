'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiUrl } from '@/lib/api-client';
import { getLocalAlbumInfo, getLocalLessonsForAlbum } from '@/lib/local-course-data';

type Lesson = { id: string; title: string; titleEn?: string; description?: string; difficulty?: string; sentenceCount?: number };
type AlbumInfo = { id: string; name: string; nameEn: string; icon: string };

export function AlbumDetailPage() {
  const { id: albumId } = useParams<{ id: string }>();
  const router = useRouter();

  const [info, setInfo] = useState<AlbumInfo | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!albumId) return;
    const localInfo = getLocalAlbumInfo(albumId);
    const localLessons = getLocalLessonsForAlbum(albumId);
    setInfo(localInfo);
    setLessons(localLessons);
    if (localInfo || localLessons.length > 0) setLoading(false);

    Promise.all([
      fetch(apiUrl('/api/albums')).then(r => r.json()),
      fetch(apiUrl(`/api/lessons?albumId=${albumId}`)).then(r => r.json()),
    ]).then(([aData, lData]) => {
      if (aData.success) {
        for (const g of aData.groups) {
          const found = g.albums.find((a: AlbumInfo) => a.id === albumId);
          if (found) { setInfo(found); break; }
        }
      }
      if (lData.success && Array.isArray(lData.lessons) && lData.lessons.length > 0) {
        setLessons(lData.lessons);
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, [albumId]);

  const isPinyin = albumId?.startsWith('pinyin-');
  const isShadow = albumId?.startsWith('ancient-') || albumId?.startsWith('basics-');

  return (
    <div className="min-h-[100dvh] bg-[#F2F2F7]">
      {/* Nav */}
      <div className="navbar px-3 py-2 flex items-center gap-2">
        <button onClick={() => router.back()} className="w-9 h-9 flex items-center justify-center shrink-0 text-[#007AFF] text-[1.0625rem] font-medium active:opacity-50">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        {info && (
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="min-w-0">
              <h1 className="text-[1.0625rem] font-semibold text-[#1C1C1E] truncate">{info.name}</h1>
              <p className="text-[0.6875rem] text-[#8E8E93]">{info.nameEn}</p>
            </div>
          </div>
        )}
      </div>

      <div className="px-4 pt-3 pb-8">
        {loading ? (
          <div className="section p-4 space-y-3">{[1,2,3,4].map(i => <div key={i} className="h-14 bg-[#E5E5EA] rounded-lg animate-pulse"/>)}</div>
        ) : !info ? (
          <div className="flex flex-col items-center py-20"><span className="text-4xl mb-3">😢</span><p className="text-[1.0625rem] text-[#8E8E93]">Not found</p></div>
        ) : lessons.length===0 ? (
          <div className="flex flex-col items-center py-20"><span className="text-4xl mb-3">🚧</span><p className="text-[1.0625rem] text-[#8E8E93]">Coming soon</p></div>
        ) : isShadow ? (
          <div className="space-y-2.5">
            {lessons.map(l => (
              <Link key={l.id} href={`/lesson/${l.id}?restart=1`} className="section block p-4 active:scale-[0.99] transition-transform">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[0.6875rem] font-medium text-[#007AFF] bg-[#007AFF]/10 px-2 py-0.5 rounded-full">Shadow Reading</span>
                      {l.difficulty && <span className="text-[0.6875rem] font-medium text-[#8E8E93] bg-[#F2F2F7] px-2 py-0.5 rounded-full">{l.difficulty}</span>}
                    </div>
                    <h3 className="text-[1.0625rem] font-semibold text-[#1C1C1E]">{l.title}</h3>
                    {l.titleEn && <p className="text-[0.8125rem] text-[#8E8E93] mt-0.5">{l.titleEn}</p>}
                    {l.description && <p className="text-[0.75rem] text-[#C7C7CC] mt-1 line-clamp-2">{l.description}</p>}
                  </div>
                  {l.sentenceCount && <span className="text-[0.6875rem] text-[#C7C7CC] shrink-0 ml-3">{l.sentenceCount} sent.</span>}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2.5">
            {lessons.map(l => {
              const label = l.title.split(' ').pop() || l.title;
              return (
                <Link key={l.id} href={isPinyin ? `/lesson/pinyin/${l.id}?restart=1` : `/lesson/${l.id}?restart=1`}
                  className="section flex flex-col items-center py-5 px-2 active:scale-[0.97] transition-transform">
                  <span className="text-[1.375rem] font-semibold text-[#1C1C1E] mb-1">{label}</span>
                  <span className="text-[0.6875rem] text-[#C7C7CC] text-center leading-tight">{l.title}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
