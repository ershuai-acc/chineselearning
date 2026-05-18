import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: fetch progress for a user (optionally by lessonId)
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId');
  const lessonId = req.nextUrl.searchParams.get('lessonId');

  if (!userId) {
    return NextResponse.json({ success: false, error: 'userId required' }, { status: 400 });
  }

  try {
    if (lessonId) {
      const progress = await prisma.progress.findUnique({
        where: { userId_lessonId: { userId, lessonId } },
      });
      return NextResponse.json({ success: true, progress });
    }

    // Return all progress for user
    const progressList = await prisma.progress.findMany({
      where: { userId },
      include: { lesson: { select: { id: true, title: true, albumId: true } } },
    });
    return NextResponse.json({ success: true, progress: progressList });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

// POST: save/update progress
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, lessonId, levelProgress } = body;

    if (!userId || !lessonId || !levelProgress) {
      return NextResponse.json({ success: false, error: 'userId, lessonId, levelProgress required' }, { status: 400 });
    }

    const progress = await prisma.progress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      update: { levelProgress: JSON.stringify(levelProgress) },
      create: {
        userId,
        lessonId,
        levelProgress: JSON.stringify(levelProgress),
      },
    });

    return NextResponse.json({ success: true, progress });
  } catch (error) {
    console.error('Failed to save progress:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
