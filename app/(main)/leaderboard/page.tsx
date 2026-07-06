'use client';

import { useState, useEffect } from 'react';
import { Trophy, Medal, Loader2, RefreshCw } from 'lucide-react';

interface Ranking {
  userId: string;
  codeName: string;
  count: number;
}

function getMedalIcon(rank: number) {
  if (rank === 0) return '🥇';
  if (rank === 1) return '🥈';
  if (rank === 2) return '🥉';
  return null;
}

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<'daily' | 'weekly'>('daily');
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLeaderboard = () => {
    setIsLoading(true);
    fetch(`/api/leaderboard?period=${period}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setRankings(data.rankings);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [period]);

  return (
    <div className="min-h-[100dvh] bg-duo-snow">
      <div className="max-w-2xl mx-auto w-full px-4 py-12 md:py-16">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-duo-bee/20 mb-4">
            <Trophy className="w-8 h-8 text-duo-bee" />
          </div>
          <h1 className="text-3xl font-extrabold text-duo-eel">Leaderboard</h1>
          <p className="text-duo-hare font-bold mt-1">Completed sentences ranking</p>
        </div>

        {/* Period tabs */}
        <div className="flex justify-center mb-6">
          <div className="flex bg-duo-polar rounded-xl p-1">
            <button
              onClick={() => setPeriod('daily')}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                period === 'daily'
                  ? 'bg-white text-duo-macaw shadow-sm'
                  : 'text-duo-hare hover:text-duo-wolf'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setPeriod('weekly')}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                period === 'weekly'
                  ? 'bg-white text-duo-macaw shadow-sm'
                  : 'text-duo-hare hover:text-duo-wolf'
              }`}
            >
              This Week
            </button>
          </div>
          <button
            onClick={fetchLeaderboard}
            className="ml-3 w-10 h-10 rounded-xl bg-white border-2 border-duo-swan flex items-center justify-center text-duo-hare hover:text-duo-macaw transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Rankings */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-duo-macaw" />
          </div>
        ) : rankings.length === 0 ? (
          <div className="bg-white rounded-2xl border-2 border-b-4 border-duo-swan p-10 text-center">
            <span className="text-4xl">🏃</span>
            <p className="text-duo-eel font-extrabold text-lg mt-3">No rankings yet</p>
            <p className="text-duo-hare font-medium mt-1">Be the first to complete a sentence!</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border-2 border-b-4 border-duo-swan overflow-hidden">
            {rankings.map((r, idx) => {
              const medal = getMedalIcon(idx);
              return (
                <div
                  key={r.userId}
                  className={`flex items-center px-5 py-4 border-b border-duo-polar last:border-b-0 ${
                    idx < 3 ? 'bg-duo-bee/5' : ''
                  }`}
                >
                  {/* Rank */}
                  <div className="w-10 text-center shrink-0">
                    {medal ? (
                      <span className="text-2xl">{medal}</span>
                    ) : (
                      <span className="text-sm font-bold text-duo-hare">{idx + 1}</span>
                    )}
                  </div>

                  {/* User info */}
                  <div className="flex-1 ml-3">
                    <span className="font-extrabold text-duo-eel text-base">{r.codeName}</span>
                  </div>

                  {/* Count */}
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-2xl font-extrabold text-duo-macaw">{r.count}</span>
                    <span className="text-xs text-duo-hare font-medium">sentences</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
