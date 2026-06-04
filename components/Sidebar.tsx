'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import {
  BookOpen,
  Music,
  HelpCircle,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', label: 'Courses', icon: BookOpen },
  { href: '/pinyin', label: 'Pinyin', icon: Music },
  { href: '/guide', label: 'About', icon: HelpCircle },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-[100dvh] w-64 border-r-2 border-duo-swan bg-white flex-col items-center py-6 z-40">
        <div className="w-full px-6 mb-8 pl-8">
          <h1 className="text-2xl font-extrabold text-duo-green tracking-tight">学中文</h1>
          <p className="text-sm text-duo-hare font-bold">Learn Chinese</p>
        </div>

        <nav className="flex-1 w-full flex flex-col gap-2 px-4">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all font-bold text-base",
                  isActive 
                    ? "bg-duo-polar text-duo-macaw border-2 border-duo-macaw/20" 
                    : "text-duo-wolf hover:bg-duo-polar border-2 border-transparent"
                )}
              >
                <Icon className={cn("w-8 h-8", isActive ? "text-duo-macaw" : "text-duo-hare")} strokeWidth={isActive ? 2.5 : 2} />
                <span className="mt-1">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-duo-swan flex items-center justify-around pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 px-2 shadow-[0_-4px_16px_rgba(0,0,0,0.02)]">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl active:bg-duo-polar transition-colors"
            >
              <div className={cn(
                "p-1.5 rounded-xl transition-all",
                isActive ? "bg-duo-polar text-duo-macaw" : "text-duo-hare"
              )}>
                <Icon className="w-[26px] h-[26px]" strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={cn(
                "text-[11px] font-bold mt-0.5",
                isActive ? "text-duo-macaw" : "text-duo-hare"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
