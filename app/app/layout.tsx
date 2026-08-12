import { AppNav } from '@/components/AppNav';
export default function Layout({children}:{children:React.ReactNode}){return <div><AppNav/><main className="bottom-safe min-h-dvh p-4 md:ml-64 md:p-8">{children}</main></div>}
