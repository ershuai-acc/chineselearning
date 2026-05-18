'use client';

import { useRouter } from 'next/navigation';

export default function LessonPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-duo-snow text-center p-6">
      <span className="text-6xl mb-4">🚧</span>
      <h2 className="text-2xl font-extrabold text-duo-eel mb-2">课程开发中</h2>
      <p className="text-duo-hare font-bold mb-8">该课程内容正在准备中，敬请期待！</p>
      <button
        onClick={() => router.back()}
        className="bg-duo-macaw text-white font-bold py-3 px-8 rounded-xl"
      >
        返回
      </button>
    </div>
  );
}
