import { NextRequest, NextResponse } from 'next/server';
import { getLessonById } from '@/lib/data';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const result = getLessonById(id);
    
    if (!result) {
      return NextResponse.json({ success: false, error: 'Lesson not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      lesson: result.lesson,
      album: {
        id: result.album.id,
        name: result.album.name,
        nameEn: result.album.nameEn,
      }
    });
  } catch (error) {
    console.error('Failed to fetch lesson:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch lesson' }, { status: 500 });
  }
}
