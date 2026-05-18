'use client';

import { Settings, User } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-duo-snow">
      <header className="sticky top-0 z-10 bg-white border-b-2 border-duo-swan">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
          <h1 className="text-xl font-extrabold text-duo-eel">设置</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {/* 账号信息 */}
        <div className="bg-white rounded-2xl border-2 border-duo-swan p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-duo-polar flex items-center justify-center">
              <User className="w-5 h-5 text-duo-eel" />
            </div>
            <h3 className="font-bold text-duo-eel">账号信息</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-duo-polar">
              <span className="text-sm text-duo-hare">状态</span>
              <span className="text-sm text-duo-green font-bold">Mock 模式（开发中）</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-duo-polar">
              <span className="text-sm text-duo-hare">数据库</span>
              <span className="text-sm text-duo-hare font-mono">未连接</span>
            </div>
          </div>
        </div>

        {/* 关于 */}
        <div className="bg-white rounded-2xl border-2 border-duo-swan p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-duo-polar flex items-center justify-center">
              <Settings className="w-5 h-5 text-duo-eel" />
            </div>
            <h3 className="font-bold text-duo-eel">关于</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-duo-polar">
              <span className="text-sm text-duo-hare">版本</span>
              <span className="text-sm text-duo-eel font-bold">0.1.0</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-duo-hare">项目</span>
              <span className="text-sm text-duo-eel font-bold">学中文 Pinyin Learner</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
