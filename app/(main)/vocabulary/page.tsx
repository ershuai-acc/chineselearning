'use client';

import { BookMarked, BookOpen } from 'lucide-react';

export default function VocabularyPage() {
  return (
    <div className="min-h-screen bg-duo-snow">
      <div className="sticky top-0 z-10 bg-duo-snow/95 backdrop-blur-sm border-b border-duo-swan">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-extrabold text-duo-eel flex items-center gap-2">
              <BookMarked className="w-6 h-6 text-amber-500" />
              我的单词本
            </h1>
            <span className="text-sm text-duo-hare ml-auto font-bold">0 个单词</span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-6">
        <div className="flex flex-col items-center justify-center py-20 text-duo-hare">
          <BookOpen className="w-16 h-16 mb-4 opacity-50" />
          <p className="text-lg font-medium">单词本是空的</p>
          <p className="text-sm mt-2">在课程中学习新词汇后会自动添加</p>
        </div>
      </div>
    </div>
  );
}
