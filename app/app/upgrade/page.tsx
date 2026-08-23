import Link from 'next/link';
import { getBusiness, getMonthlyOrderUsage, FREE_ORDER_LIMIT, PRO_ORDER_LIMIT } from '@/lib/supabase/data';
import { formatNaira } from '@/lib/utils/format';

export default async function UpgradePage({ searchParams }: { searchParams: Promise<{ reason?: string; used?: string }> }) {
  const params = await searchParams;
  const { supabase, business } = await getBusiness();
  const usage = await getMonthlyOrderUsage(supabase, business.id, business.plan ?? 'free');
  const used = usage.used;
  const limit = usage.limit ?? FREE_ORDER_LIMIT;
  const percentage = Math.min(Math.round((used / limit) * 100), 100);
  const reachedLimit = params.reason === 'order-limit' || usage.isAtLimit;

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="card overflow-hidden border-amber-200 bg-gradient-to-br from-amber-50 via-white to-emerald-50 p-6 sm:p-10">
        <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-800">
          {business.plan === 'free' ? 'Free plan' : `${business.plan} plan`}
        </span>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          {reachedLimit ? 'You have reached your monthly order limit.' : 'Keep track of your order usage.'}
        </h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          {reachedLimit
            ? `Your Free plan includes ${FREE_ORDER_LIMIT} orders each month. Your existing customers, products and orders are safe, but new orders are paused until the limit resets or you upgrade.`
            : `You have used ${used} of ${limit} orders this month. Upgrade before you run out so your business can keep taking orders.`}
        </p>

        <div className="mt-8 rounded-2xl bg-white/80 p-5 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Orders this month</p>
              <p className="mt-1 text-3xl font-black text-slate-900">{used} <span className="text-base font-medium text-slate-500">/ {limit}</span></p>
            </div>
            <p className="text-sm font-bold text-slate-600">{percentage}% used</p>
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
            <div className={`h-full rounded-full ${percentage >= 100 ? 'bg-red-500' : percentage >= 80 ? 'bg-amber-500' : 'bg-emerald-600'}`} style={{ width: `${percentage}%` }} />
          </div>
          {usage.remaining !== null && usage.remaining > 0 && (
            <p className="mt-3 text-sm text-slate-500">You have {usage.remaining} order{usage.remaining === 1 ? '' : 's'} remaining this month.</p>
          )}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <section className="card p-6">
          <p className="text-sm font-bold uppercase tracking-wide text-slate-500">Current plan</p>
          <h2 className="mt-2 text-2xl font-black">Free</h2>
          <p className="mt-2 text-3xl font-black">₦0 <span className="text-sm font-medium text-slate-500">/ month</span></p>
          <ul className="mt-5 space-y-3 text-sm text-slate-600">
            <li>✓ {FREE_ORDER_LIMIT} orders per month</li>
            <li>✓ Customers and products</li>
            <li>✓ Dashboard and order tracking</li>
            <li>✓ WhatsApp click-to-chat</li>
          </ul>
        </section>

        <section className="card border-2 border-emerald-800 p-6 shadow-lg">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">Recommended</p>
              <h2 className="mt-2 text-2xl font-black">Pro</h2>
            </div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">Coming next</span>
          </div>
          <p className="mt-2 text-3xl font-black">₦2,500 <span className="text-sm font-medium text-slate-500">/ month</span></p>
          <ul className="mt-5 space-y-3 text-sm text-slate-600">
            <li>✓ Up to {PRO_ORDER_LIMIT} orders per month</li>
            <li>✓ Everything in Free</li>
            <li>✓ More room to grow</li>
            <li>✓ Priority support</li>
          </ul>
          <Link href="/pricing" className="btn btn-primary mt-7 inline-flex w-full justify-center">View pricing</Link>
          <p className="mt-3 text-center text-xs text-slate-500">Online payment activation is coming next.</p>
        </section>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/app/dashboard" className="btn btn-secondary">Back to dashboard</Link>
        <Link href="/app/orders" className="btn btn-secondary">View orders</Link>
      </div>
    </div>
  );
}
