'use client';

import { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, X } from 'lucide-react';

export function ActionToast() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const success = searchParams.get('success');
  const error = searchParams.get('error');
  const message = success || error;

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => router.replace(pathname), 3500);
    return () => window.clearTimeout(timer);
  }, [message, pathname, router]);

  if (!message) return null;
  const isError = Boolean(error);

  return (
    <div className="fixed right-4 top-4 z-50 w-[min(92vw,420px)]">
      <div className={`flex items-start gap-3 rounded-2xl border bg-white p-4 shadow-xl ${isError ? 'border-red-200' : 'border-emerald-200'}`} role="status" aria-live="polite">
        <CheckCircle2 className={isError ? 'text-red-600' : 'text-emerald-700'} size={22} />
        <p className="flex-1 text-sm font-semibold text-gray-800">{message}</p>
        <button onClick={() => router.replace(pathname)} aria-label="Close notification" className="text-gray-400 hover:text-gray-700">
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
