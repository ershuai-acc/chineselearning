import { NextResponse } from 'next/server';
import { CHINESE_COURSE_GROUPS } from '@/lib/config/chineseCourses';

export async function GET() {
  try {
    // Use static config directly (no database dependency)
    const groups = CHINESE_COURSE_GROUPS.map(group => ({
      id: group.id,
      title: group.title,
      titleEn: group.titleEn,
      albums: group.albums.map(album => ({
        id: album.id,
        name: album.name,
        nameEn: album.nameEn,
        icon: album.icon,
        description: album.description || null,
        coverImage: null,
      })),
    })).filter(g => g.albums.length > 0);

    return NextResponse.json({ success: true, groups });
  } catch (error) {
    console.error('Failed to fetch albums:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch albums' }, { status: 500 });
  }
}
