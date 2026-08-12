import Link from 'next/link';import { Logo } from '@/components/Logo';
export default function Layout({children}:{children:React.ReactNode}){return <main className="min-h-dvh p-4"><Link href="/"><Logo/></Link><div className="py-12">{children}</div></main>}
