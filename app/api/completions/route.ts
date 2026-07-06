import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, codeName, lessonId, source } = body;

    if (!userId || !codeName || !lessonId) {
      return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 });
    }

    const record = await prisma.completionLog.create({
      data: { userId, codeName, lessonId, source: source || null },
    });

    return NextResponse.json({ success: true, id: record.id });
  } catch (error) {
    console.error('Failed to record completion:', error);
    return NextResponse.json({ success: false, error: 'Failed to record' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ success: false, error: 'userId required' }, { status: 400 });
    }

    const count = await prisma.completionLog.count({ where: { userId } });
    return NextResponse.json({ success: true, count });
  } catch (error) {
    console.error('Failed to fetch completions:', error);
    return NextResponse.json({ success: true, count: 0 });
  }
}
