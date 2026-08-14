import { AppNav } from '@/components/AppNav';
import { ActionToast } from '@/components/ActionToast';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <AppNav />
      <ActionToast />
      <main className="bottom-safe min-h-dvh p-4 md:ml-64 md:p-8">{children}</main>
    </div>
  );
}
