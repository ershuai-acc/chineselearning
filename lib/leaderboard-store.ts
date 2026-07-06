/**
 * In-memory leaderboard store (fallback when database is unavailable)
 * Data is lost on server restart. For production, use the Prisma/MySQL path.
 */

interface CompletionRecord {
  id: string;
  createdAt: string; // ISO string
  userId: string;
  codeName: string;
  lessonId: string;
  source: string;
}

const store: CompletionRecord[] = [];

export function addCompletion(record: Omit<CompletionRecord, 'id' | 'createdAt'>): CompletionRecord {
  const entry: CompletionRecord = {
    id: Math.random().toString(36).slice(2),
    createdAt: new Date().toISOString(),
    ...record,
  };
  store.push(entry);
  return entry;
}

export function getRankings(period: 'daily' | 'weekly'): { userId: string; codeName: string; count: number }[] {
  const now = new Date();
  const cutoff = new Date(now);

  if (period === 'daily') {
    cutoff.setHours(0, 0, 0, 0);
  } else {
    // Weekly: since Monday this week
    const day = cutoff.getDay();
    const diff = cutoff.getDate() - day + (day === 0 ? -6 : 1);
    cutoff.setDate(diff);
    cutoff.setHours(0, 0, 0, 0);
  }

  const cutoffStr = cutoff.toISOString();
  const filtered = store.filter(r => r.createdAt >= cutoffStr);

  const userCounts = new Map<string, { codeName: string; count: number }>();
  for (const r of filtered) {
    const existing = userCounts.get(r.userId);
    if (existing) {
      existing.count++;
    } else {
      userCounts.set(r.userId, { codeName: r.codeName, count: 1 });
    }
  }

  return Array.from(userCounts.entries())
    .map(([userId, data]) => ({ userId, codeName: data.codeName, count: data.count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);
}
