import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: fetch vocabulary for a user
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId');
  if (!userId) {
    return NextResponse.json({ success: false, error: 'userId required' }, { status: 400 });
  }

  try {
    const vocabularies = await prisma.vocabulary.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, vocabularies });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

// POST: add word to vocabulary
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, word, language, definition, phonetic, sourceContext, lessonId } = body;

    if (!userId || !word) {
      return NextResponse.json({ success: false, error: 'userId, word required' }, { status: 400 });
    }

    const vocab = await prisma.vocabulary.upsert({
      where: { userId_word_language: { userId, word, language: language || 'zh' } },
      update: { definition, phonetic, sourceContext, lessonId },
      create: {
        userId,
        word,
        language: language || 'zh',
        definition,
        phonetic,
        sourceContext,
        lessonId,
      },
    });

    return NextResponse.json({ success: true, vocabulary: vocab });
  } catch (error) {
    console.error('Failed to save vocabulary:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

// DELETE: remove word from vocabulary
export async function DELETE(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId');
  const word = req.nextUrl.searchParams.get('word');
  const language = req.nextUrl.searchParams.get('language') || 'zh';

  if (!userId || !word) {
    return NextResponse.json({ success: false, error: 'userId, word required' }, { status: 400 });
  }

  try {
    await prisma.vocabulary.delete({
      where: { userId_word_language: { userId, word, language } },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
