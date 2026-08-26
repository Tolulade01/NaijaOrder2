'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Package, ShoppingCart, Users, MoreHorizontal, LogOut, Menu, X, HelpCircle, Settings, CreditCard } from 'lucide-react';
import { useState } from 'react';
import { Logo } from './Logo';
import { createClient } from '@/lib/supabase/client';

const nav = [
  ['/app/dashboard', 'Home', Home],
  ['/app/orders', 'Orders', ShoppingCart],
  ['/app/customers', 'Customers', Users],
  ['/app/products', 'Products', Package],
  ['/app/settings', 'More', MoreHorizontal],
] as const;

export function AppNav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  async function logout() {
    setOpen(false);
    await createClient().auth.signOut();
    location.href = '/login';
  }

  return (
    <>
      <aside className="fixed left-0 top-0 hidden h-dvh w-64 border-r bg-white p-5 print:hidden md:block">
        <Logo />
        <nav className="mt-8 space-y-2">
          {nav.map(([href, label, Icon]) => (
            <Link className={`flex gap-3 rounded-xl px-3 py-2 ${path.startsWith(href) ? 'bg-emerald-900 text-white' : 'hover:bg-amber-50'}`} href={href} key={href}>
              <Icon size={20} />{label === 'More' ? 'Settings' : label}
            </Link>
          ))}
          <Link className={`flex gap-3 rounded-xl px-3 py-2 ${path.startsWith('/app/upgrade') ? 'bg-emerald-900 text-white' : 'hover:bg-amber-50'}`} href="/app/upgrade">
            <CreditCard size={20} />Plan & Billing
          </Link>
          <a className="flex gap-3 rounded-xl px-3 py-2" href="mailto:help@naijaorder.com"><HelpCircle size={20} />Help</a>
          <button onClick={logout} className="flex w-full gap-3 rounded-xl px-3 py-2 text-left"><LogOut size={20} />Logout</button>
        </nav>
      </aside>

      <header className="fixed left-0 right-0 top-0 z-40 border-b bg-white/95 px-4 py-3 shadow-sm backdrop-blur print:hidden md:hidden">
        <div className="flex items-center justify-between">
          <Logo />
          <button type="button" className="grid h-10 w-10 place-items-center rounded-xl border border-gray-200" onClick={() => setOpen((value) => !value)} aria-label={open ? 'Close account menu' : 'Open account menu'} aria-expanded={open}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {open && (
          <div className="mt-3 space-y-1 border-t pt-3">
            <Link className="flex items-center gap-3 rounded-xl px-3 py-3 font-medium hover:bg-amber-50" href="/app/settings" onClick={() => setOpen(false)}>
              <Settings size={19} /> Settings
            </Link>
            <Link className="flex items-center gap-3 rounded-xl px-3 py-3 font-medium hover:bg-amber-50" href="/app/upgrade" onClick={() => setOpen(false)}>
              <CreditCard size={19} /> Plan & Billing
            </Link>
            <a className="flex items-center gap-3 rounded-xl px-3 py-3 font-medium hover:bg-amber-50" href="mailto:help@naijaorder.com" onClick={() => setOpen(false)}>
              <HelpCircle size={19} /> Help & Support
            </a>
            <button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left font-semibold text-red-600 hover:bg-red-50">
              <LogOut size={19} /> Logout
            </button>
          </div>
        )}
      </header>

      <nav className="fixed bottom-0 left-0 right-0 z-30 grid grid-cols-5 border-t bg-white p-2 print:hidden md:hidden">
        {nav.map(([href, label, Icon]) => (
          <Link className={`grid place-items-center rounded-xl py-2 text-xs ${path.startsWith(href) ? 'font-bold text-emerald-900' : 'text-gray-500'}`} href={href} key={href}>
            <Icon size={21} />{label === 'More' ? 'More' : label}
          </Link>
        ))}
      </nav>
    </>
  );
}
