import { NextRequest, NextResponse } from 'next/server';
import { SHADOW_ALBUMS } from '@/lib/data';

export async function GET(req: NextRequest) {
  const albumId = req.nextUrl.searchParams.get('albumId');

  if (!albumId) {
    return NextResponse.json({ success: false, error: 'albumId required' }, { status: 400 });
  }

  try {
    // Find album from static data
    const album = SHADOW_ALBUMS.find(a => a.id === albumId);
    
    if (!album) {
      return NextResponse.json({ success: true, lessons: [] });
    }

    const lessons = album.lessons.map(lesson => ({
      id: lesson.id,
      title: lesson.title,
      titleEn: lesson.titleEn,
      description: lesson.description,
      difficulty: lesson.difficulty,
      sentenceCount: lesson.sentences.length,
      coverImage: null,
      language: 'zh',
      albumId: album.id,
    }));

    return NextResponse.json({ success: true, lessons });
  } catch (error) {
    console.error('Failed to fetch lessons:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch lessons' }, { status: 500 });
  }
}
