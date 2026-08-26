import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: { default: 'NaijaOrder — Simple Order Management for Nigerian Businesses', template: '%s | NaijaOrder' },
  description: 'Mobile-first order, customer and product management for Nigerian small businesses.',
  openGraph: { title: 'NaijaOrder', description: 'Stop losing customer orders in WhatsApp.', images: ['/og.svg'] },
  manifest: '/manifest.json',
  icons: { icon: '/icon.svg', apple: '/icon.svg' },
};

export const viewport: Viewport = {
  themeColor: '#064e3b',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

function ServiceWorkerRegistration() {
  if (typeof window === 'undefined') return null;
  return null;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `if ('serviceWorker' in navigator) { window.addEventListener('load', function () { navigator.serviceWorker.register('/sw.js').catch(function () {}); }); }`,
          }}
        />
      </body>
    </html>
  );
}
