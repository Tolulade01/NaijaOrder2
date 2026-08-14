import Link from 'next/link';
import { ShoppingBag, Check } from 'lucide-react';

export function Logo() {
  return (
    <Link
      href="/"
      aria-label="NaijaOrder home"
      className="flex items-center gap-2 font-black text-emerald-950 transition-opacity hover:opacity-80"
    >
      <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-emerald-900 text-white">
        <ShoppingBag size={20} />
        <Check size={14} className="absolute bottom-1 right-1 text-amber-300" />
      </span>
      NaijaOrder
    </Link>
  );
}
