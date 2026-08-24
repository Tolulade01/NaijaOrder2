import Link from 'next/link';
import { getBusiness, getMonthlyOrderUsage, FREE_ORDER_LIMIT, PRO_ORDER_LIMIT } from '@/lib/supabase/data';
import { formatNaira } from '@/lib/utils/format';

const plans = {
  pro: {
    name: 'Pro',
    price: 3500,
    limit: `${PRO_ORDER_LIMIT} orders per month`,
    features: ['Up to 100 orders per month', 'Unlimited customers', 'Unlimited products', 'Full order management', 'WhatsApp order sharing', 'Priority support'],
  },
  business: {
    name: 'Business',
    price: 7000,
    limit: 'Unlimited orders',
    features: ['Unlimited orders', 'Unlimited customers', 'Unlimited products', 'Full order management', 'WhatsApp order sharing', 'Priority support'],
  },
} as const;

export default async function UpgradePage({ searchParams }: { searchParams: Promise<{ reason?: string; used?: string; error?: string; success?: string }> }) {
  const params = await searchParams;
  const { supabase, business } = await getBusiness();
  const usage = await getMonthlyOrderUsage(supabase, business.id, business.plan ?? 'free');
  const used = usage.used;
  const limit = usage.limit ?? FREE_ORDER_LIMIT;
  const percentage = Math.min(Math.round((used / limit) * 100), 100);
  const reachedLimit = params.reason === 'order-limit' || usage.isAtLimit;
  const activePaidPlan = business.plan !== 'free' && business.plan_expires_at && new Date(business.plan_expires_at) > new Date();

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {(params.error || params.success) && (
        <div className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${params.error ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>
          {params.error || params.success}
        </div>
      )}

      <div className="card overflow-hidden border-amber-200 bg-gradient-to-br from-amber-50 via-white to-emerald-50 p-6 sm:p-10">
        <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-800">
          {business.plan === 'free' ? 'Free plan' : `${business.plan} plan`}
        </span>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          {reachedLimit ? 'You have reached your monthly order limit.' : 'Choose the plan that fits your business.'}
        </h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          {reachedLimit
            ? `Your Free plan includes ${FREE_ORDER_LIMIT} orders each month. Your existing data is safe, but new orders are paused until the limit resets or you upgrade.`
            : activePaidPlan
              ? `Your ${business.plan} plan is active until ${new Date(business.plan_expires_at!).toLocaleDateString('en-NG')}.`
              : `You have used ${used} of ${limit} orders this month. Upgrade whenever you need more room.`}
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
        {(Object.entries(plans) as Array<[keyof typeof plans, (typeof plans)[keyof typeof plans]]>).map(([key, plan]) => {
          const isCurrent = business.plan === key && activePaidPlan;
          return (
            <section key={key} className={`card p-6 ${key === 'pro' ? 'border-2 border-emerald-800 shadow-lg' : ''}`}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">{key === 'pro' ? 'Recommended' : 'For growing teams'}</p>
                  <h2 className="mt-2 text-2xl font-black">{plan.name}</h2>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">30 days</span>
              </div>
              <p className="mt-2 text-3xl font-black">{formatNaira(plan.price)} <span className="text-sm font-medium text-slate-500">/ 30 days</span></p>
              <ul className="mt-5 space-y-3 text-sm text-slate-600">
                {plan.features.map((feature) => <li key={feature}>✓ {feature}</li>)}
              </ul>
              {isCurrent ? (
                <div className="mt-7 rounded-xl bg-emerald-50 px-4 py-3 text-center text-sm font-bold text-emerald-800">Current plan</div>
              ) : (
                <form action="/api/payments/flutterwave/initialize" method="post" className="mt-7">
                  <input type="hidden" name="plan" value={key} />
                  <button className="btn btn-primary w-full" type="submit">Pay {formatNaira(plan.price)} &amp; upgrade</button>
                </form>
              )}
              <p className="mt-3 text-center text-xs text-slate-500">Secure checkout via Flutterwave. Your plan is activated after payment verification.</p>
            </section>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/app/dashboard" className="btn btn-secondary">Back to dashboard</Link>
        <Link href="/app/orders" className="btn btn-secondary">View orders</Link>
      </div>
    </div>
  );
}
