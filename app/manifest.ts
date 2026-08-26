import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'NaijaOrder — Order Management for Nigerian Businesses',
    short_name: 'NaijaOrder',
    description: 'Stop losing customer orders in WhatsApp. Manage customers, products and orders in one simple dashboard.',
    start_url: '/app/dashboard',
    scope: '/',
    display: 'standalone',
    background_color: '#fffaf0',
    theme_color: '#064e3b',
    orientation: 'portrait-primary',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' },
    ],
  };
}
