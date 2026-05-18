'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

interface Album {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  coverImage?: string | null;
}

interface CourseGroup {
  id: string;
  title: string;
  titleEn: string;
  albums: Album[];
}

export function CourseGrid() {
  const [groups, setGroups] = useState<CourseGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/albums')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.groups) {
          setGroups(data.groups);
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

  return (
    <div className="relative flex flex-col min-h-[100dvh] bg-duo-snow">
      <div className="flex-1 py-12 md:py-16 space-y-16 md:space-y-20 max-w-5xl mx-auto w-full px-4">
        {groups.map(group => (
          <section key={group.id} className="w-full flex flex-col items-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-duo-eel mb-10 text-center flex items-center justify-center gap-3">
              {group.title}
              <span className="text-duo-hare text-2xl md:text-3xl font-bold">{group.titleEn}</span>
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 w-full max-w-4xl">
              {group.albums.map(album => (
                <Link
                  key={album.id}
                  href={`/album/${album.id}`}
                  className="group flex flex-col items-center rounded-2xl bg-white border-2 border-b-4 border-duo-swan hover:bg-duo-polar hover:border-duo-polar hover:-translate-y-1 active:translate-y-0.5 active:border-b-2 transition-all duration-200 overflow-hidden"
                >
                  <div className="w-full aspect-square flex items-center justify-center bg-duo-polar">
                    <span className="text-4xl md:text-5xl">{album.icon}</span>
                  </div>
                  <div className="flex flex-col items-center px-3 py-4">
                    <span className="text-lg md:text-xl font-extrabold text-duo-eel text-center leading-tight mb-1">{album.name}</span>
                    <span className="text-sm md:text-base font-bold text-duo-hare text-center">{album.nameEn}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
