import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id },
    });

    if (!lesson) {
      return NextResponse.json({ success: false, error: 'Lesson not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      lesson: {
        ...lesson,
        content: JSON.parse(lesson.content),
      },
    });
  } catch (error) {
    console.error('Failed to fetch lesson:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch lesson' }, { status: 500 });
  }
}
