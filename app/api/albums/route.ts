import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const albums = await prisma.album.findMany({
      orderBy: { sortOrder: 'asc' },
    });

    // Group albums by category (based on id prefix)
    const groups = [
      {
        id: 'pinyin',
        title: '拼音',
        titleEn: 'Pinyin',
        albums: albums.filter(a => a.id.startsWith('pinyin-')),
      },
      {
        id: 'mandarin-basics',
        title: '普通话入门',
        titleEn: 'Mandarin Basics',
        albums: albums.filter(a => a.id.startsWith('basics-')),
      },
      {
        id: 'chinese-culture',
        title: '汉语文化',
        titleEn: 'Chinese Culture',
        albums: albums.filter(a => a.id.startsWith('culture-')),
      },
    ].filter(g => g.albums.length > 0);

    return NextResponse.json({ success: true, groups });
  } catch (error) {
    console.error('Failed to fetch albums:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch albums' }, { status: 500 });
  }
}
