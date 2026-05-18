import { ReactNode } from 'react';
import { Sidebar } from '@/components/Sidebar';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] bg-duo-snow">
      <Sidebar />
      <main className="flex-1 w-full pl-0 md:pl-64 pb-20 md:pb-0 min-h-[100dvh]">
        {children}
      </main>
    </div>
  );
}