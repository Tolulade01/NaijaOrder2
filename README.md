# NaijaOrder

NaijaOrder is a mobile-first SaaS/PWA for Nigerian small businesses to manage customers, products and orders that usually arrive through WhatsApp, Instagram, phone calls and manual records.

## Features
- Supabase Auth signup, login, logout and password reset.
- Multi-tenant User → Business → Customers / Products / Orders architecture.
- Dashboard with database-driven sales, orders, pending orders, customers and recent orders.
- Customer, product and order CRUD flows with search, statuses and calculations.
- Manual payment status/method tracking. Paystack and subscription billing are intentionally out of scope for V1.
- WhatsApp click-to-chat utilities for Nigerian phone formats.
- PWA manifest, installable icon, responsive mobile bottom navigation and desktop sidebar.
- Supabase PostgreSQL schema, RLS policies and seed/demo data.

## Stack
Next.js 15, React 19, TypeScript, App Router, Tailwind CSS v4, Supabase/PostgreSQL/Auth, Lucide React and Zod.

## Setup
```bash
npm install
cp .env.example .env.local
npm run dev
```

Environment variables:
```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Supabase
1. Create a Supabase project.
2. Run `supabase/migrations/001_initial_schema.sql` in SQL editor or with Supabase CLI.
3. Create a user in Auth, copy its user id, replace `OWNER_UUID` in `supabase/seed.sql`, then run the seed.
4. Confirm RLS is enabled and policies prevent cross-business access.

## Commands
```bash
npm run dev
npm run lint
npm run build
```

## Deployment
Push to GitHub, import the repository into Vercel, set the environment variables above, and deploy. No VPS, Docker, Apache, Nginx or PHP hosting is required.

## PWA
The app exposes `/manifest.json`, SVG icons and standalone display settings. Open it on mobile and use the browser install prompt.

## Known limitations
V1 records payments manually only. It does not include Paystack, subscription billing, WhatsApp Business API, staff accounts, advanced inventory, invoices, AI, n8n automation or a public store.
