import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: fetch user by deviceId
export async function GET(req: NextRequest) {
  const deviceId = req.nextUrl.searchParams.get('deviceId');
  if (!deviceId) {
    return NextResponse.json({ success: false, error: 'deviceId required' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({ where: { deviceId } });
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, user });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

// POST: register user (auto-register by deviceId)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { deviceId, nickname } = body;

    if (!deviceId) {
      return NextResponse.json({ success: false, error: 'deviceId required' }, { status: 400 });
    }

    // Upsert: create if not exists, return existing if exists
    const user = await prisma.user.upsert({
      where: { deviceId },
      update: {},
      create: {
        deviceId,
        nickname: nickname || null,
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Failed to create user:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
