'use client';

import { BookOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ReviewPage() {
  const router = useRouter();

  return (
    <div className="min-h-[100dvh] bg-duo-snow pt-4 pb-20 sm:pt-8 sm:pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-duo-eel mb-8">复习</h1>

        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="w-32 h-32 bg-duo-polar rounded-full flex items-center justify-center mb-6">
            <BookOpen className="w-16 h-16 text-duo-hare" />
          </div>
          <h3 className="text-2xl font-extrabold text-duo-eel mb-3">暂无学习记录</h3>
          <p className="text-duo-wolf font-bold mb-8 max-w-sm">
            还没有学习记录哦，去课程页开始学习吧！
          </p>
          <button
            onClick={() => router.push('/')}
            className="bg-duo-macaw hover:bg-duo-macaw-dark text-white font-extrabold px-8 py-3 rounded-2xl border-b-4 border-duo-macaw-dark active:translate-y-1 active:border-b-0 transition-all"
          >
            去学习
          </button>
        </div>
      </div>
    </div>
  );
}
