import { Suspense } from 'react';
import { AppNav } from '@/components/AppNav';
import { ActionToast } from '@/components/ActionToast';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <AppNav />
      <Suspense fallback={null}>
        <ActionToast />
      </Suspense>
      <main className="bottom-safe min-h-dvh p-4 pt-20 md:ml-64 md:p-8">{children}</main>
    </div>
  );
}
