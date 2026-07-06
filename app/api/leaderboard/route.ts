import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const period = req.nextUrl.searchParams.get('period') || 'daily';

    const now = new Date();
    let cutoff: Date;

    if (period === 'weekly') {
      // Since Monday this week
      cutoff = new Date(now);
      const day = cutoff.getDay();
      const diff = cutoff.getDate() - day + (day === 0 ? -6 : 1);
      cutoff.setDate(diff);
    } else {
      // Daily: since midnight today
      cutoff = new Date(now);
    }
    cutoff.setHours(0, 0, 0, 0);

    // Get all completions since cutoff, grouped by userId
    const completions = await prisma.completionLog.findMany({
      where: { createdAt: { gte: cutoff } },
      select: { userId: true, codeName: true },
    });

    // Group and count in memory
    const userCounts = new Map<string, { codeName: string; count: number }>();
    for (const c of completions) {
      const existing = userCounts.get(c.userId);
      if (existing) {
        existing.count++;
      } else {
        userCounts.set(c.userId, { codeName: c.codeName, count: 1 });
      }
    }

    const rankings = Array.from(userCounts.entries())
      .map(([userId, data]) => ({ userId, codeName: data.codeName, count: data.count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);

    return NextResponse.json({ success: true, rankings, period, cutoff: cutoff.toISOString() });
  } catch (error) {
    console.error('Failed to get leaderboard:', error);
    return NextResponse.json({ success: true, rankings: [], period: 'daily' });
  }
}
