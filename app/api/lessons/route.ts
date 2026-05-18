import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const albumId = req.nextUrl.searchParams.get('albumId');

  if (!albumId) {
    return NextResponse.json({ success: false, error: 'albumId required' }, { status: 400 });
  }

  try {
    const lessons = await prisma.lesson.findMany({
      where: { albumId },
      select: {
        id: true,
        title: true,
        coverImage: true,
        language: true,
        albumId: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ success: true, lessons });
  } catch (error) {
    console.error('Failed to fetch lessons:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch lessons' }, { status: 500 });
  }
}
