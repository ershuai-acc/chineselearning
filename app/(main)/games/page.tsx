'use client';

import { Gamepad2 } from 'lucide-react';

export default function GamesHubPage() {
  return (
    <div className="min-h-[100dvh] flex flex-col items-center py-12 px-6">
      <div className="w-full max-w-4xl">
        <div className="mb-10 text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-duo-macaw/20 text-duo-macaw rounded-3xl flex items-center justify-center mb-6">
            <Gamepad2 className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-800 mb-4 tracking-tight">小游戏</h1>
          <p className="text-lg text-gray-500 max-w-lg mx-auto">
            通过有趣的小游戏巩固你的中文知识！
          </p>
        </div>

        <div className="flex flex-col items-center justify-center py-12 text-center">
          <span className="text-5xl mb-4">🚧</span>
          <p className="text-xl font-extrabold text-duo-eel mb-2">游戏开发中</p>
          <p className="text-duo-hare font-bold">拼音连连看、汉字填字等游戏即将上线</p>
        </div>
      </div>
    </div>
  );
}
