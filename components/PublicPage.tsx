import Link from 'next/link';
import { Logo } from './Logo';

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="mx-auto flex max-w-6xl items-center justify-between p-4">
        <Logo />

        <nav className="hidden gap-5 md:flex">
          <Link href="/features">Features</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/login">Login</Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link className="hidden font-semibold md:inline" href="/login">
            Login
          </Link>
          <Link className="btn btn-primary" href="/signup">
            Start Free
          </Link>
        </div>
      </header>

      <main>{children}</main>

      <footer className="mx-auto max-w-6xl p-6 text-sm text-gray-600">
        © 2026 NaijaOrder · <Link href="/privacy">Privacy</Link> ·{' '}
        <Link href="/terms">Terms</Link>
      </footer>
    </>
  );
}
