import Link from 'next/link';
import { Logo } from '@/components/Logo';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-dvh p-4">
      <header className="mx-auto flex max-w-6xl items-center justify-between">
        <Logo />
        <nav className="flex items-center gap-3 text-sm font-semibold sm:gap-5">
          <Link className="hidden sm:inline" href="/">
            Back to home
          </Link>
          <Link href="/login">Log in</Link>
          <Link className="btn btn-primary px-4 py-2" href="/signup">
            Sign up
          </Link>
        </nav>
      </header>
      <div className="py-10 sm:py-12">{children}</div>
    </main>
  );
}
