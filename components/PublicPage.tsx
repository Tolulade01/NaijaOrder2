'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Logo } from './Logo';

const links = [
  ['/features', 'Features'],
  ['/pricing', 'Pricing'],
  ['/about', 'About'],
  ['/contact', 'Contact'],
] as const;

export function PublicShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-emerald-950/10 bg-[#fffaf0]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
          <Logo />

          <nav className="hidden items-center gap-6 md:flex">
            {links.map(([href, label]) => (
              <Link className="font-medium hover:text-emerald-800" href={href} key={href}>
                {label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-4 md:flex">
            <Link className="font-semibold" href="/login">
              Log in
            </Link>
            <Link className="btn btn-primary" href="/signup">
              Start Free
            </Link>
          </div>

          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-xl border border-emerald-950/10 bg-white md:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {open && (
          <div className="border-t border-emerald-950/10 bg-white px-4 pb-5 md:hidden">
            <nav className="mx-auto max-w-6xl space-y-1 pt-3">
              {links.map(([href, label]) => (
                <Link
                  className="block rounded-xl px-3 py-3 font-semibold hover:bg-amber-50"
                  href={href}
                  key={href}
                  onClick={() => setOpen(false)}
                >
                  {label}
                </Link>
              ))}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link className="btn btn-secondary" href="/login" onClick={() => setOpen(false)}>
                  Log in
                </Link>
                <Link className="btn btn-primary" href="/signup" onClick={() => setOpen(false)}>
                  Start Free
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      <main>{children}</main>

      <footer className="mx-auto max-w-6xl p-6 text-sm text-gray-600">
        © 2026 NaijaOrder · <Link href="/privacy">Privacy</Link> · <Link href="/terms">Terms</Link>
      </footer>
    </>
  );
}
