const plans = [
  {
    name: 'Free',
    price: '₦0',
    period: 'forever',
    description: 'Perfect for trying NaijaOrder and managing a small number of orders.',
    badge: 'Start here',
    featured: false,
    cta: 'Start Free',
    href: '/signup',
    features: ['Up to 25 orders per month', 'Unlimited customers', 'Unlimited products', 'Business dashboard', 'Order status tracking', 'WhatsApp click-to-chat'],
  },
  {
    name: 'Pro',
    price: '₦3,500',
    period: 'per month',
    description: 'For growing businesses that receive orders regularly.',
    badge: 'Most popular',
    featured: true,
    cta: 'Upgrade to Pro',
    href: '/login',
    features: ['Up to 100 orders per month', 'Unlimited customers', 'Unlimited products', 'Full order management', 'WhatsApp order sharing', 'Priority support'],
  },
  {
    name: 'Business',
    price: '₦7,000',
    period: 'per month',
    description: 'For busy businesses that need room to grow without an order limit.',
    badge: 'Unlimited',
    featured: false,
    cta: 'Choose Business',
    href: '/login',
    features: ['Unlimited orders', 'Unlimited customers', 'Unlimited products', 'Full order management', 'WhatsApp order sharing', 'Priority support'],
  },
];

export default function Page() {
  return (
    <main className="bg-[#fffaf0]">
      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-700">Simple pricing</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-emerald-950 sm:text-6xl">Start free. Upgrade when you grow.</h1>
          <p className="mt-6 text-lg leading-8 text-slate-700 sm:text-xl">Try NaijaOrder with up to 25 orders every month. When your business grows, upgrade to 100 orders with Pro or unlimited orders with Business.</p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.name} className={`relative flex flex-col rounded-[2rem] bg-white p-7 shadow-sm sm:p-8 ${plan.featured ? 'border-2 border-emerald-900 shadow-xl' : 'border border-emerald-950/10'}`}>
              {plan.featured ? (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-amber-400 px-4 py-1.5 text-xs font-black text-emerald-950">{plan.badge}</div>
              ) : (
                <span className="w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">{plan.badge}</span>
              )}
              <h2 className="mt-5 text-2xl font-black text-emerald-950">{plan.name}</h2>
              <p className="mt-3 min-h-14 text-sm leading-6 text-slate-600">{plan.description}</p>
              <div className="mt-6 flex items-end gap-2">
                <span className="text-4xl font-black text-emerald-950">{plan.price}</span>
                <span className="pb-1 text-sm text-slate-500">{plan.period}</span>
              </div>
              <ul className="mt-8 flex-1 space-y-4 text-sm text-slate-700">
                {plan.features.map((item) => <li key={item} className="flex gap-3"><span className="font-black text-emerald-700">✓</span><span>{item}</span></li>)}
              </ul>
              <a href={plan.href} className={`mt-9 block rounded-2xl px-6 py-4 text-center font-bold transition ${plan.featured ? 'bg-emerald-900 text-white hover:bg-emerald-800' : 'border border-emerald-900 text-emerald-950 hover:bg-emerald-50'}`}>{plan.cta}</a>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-10 max-w-3xl rounded-3xl bg-emerald-950 p-7 text-center text-white sm:p-9">
          <h2 className="text-2xl font-black sm:text-3xl">Choose the plan that fits your order volume</h2>
          <p className="mt-3 leading-7 text-emerald-50/80">Free includes 25 orders every month. Pro gives you 100 orders for ₦3,500/month. Business gives you unlimited orders for ₦7,000/month.</p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-sm leading-6 text-slate-500">Paid plans are available through secure Flutterwave checkout. Your plan is activated after successful payment verification.</p>
      </section>
    </main>
  );
}
