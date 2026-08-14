export default function Page() {
  return (
    <main className="bg-[#fffaf0]">
      <section className="mx-auto max-w-5xl px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-700">Early access</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-emerald-950 sm:text-6xl">Simple pricing while we build.</h1>
          <p className="mt-6 text-lg leading-8 text-slate-700 sm:text-xl">
            NaijaOrder is currently free during early access. There is no subscription billing in V1.
          </p>
        </div>

        <div className="mx-auto mt-14 max-w-md rounded-[2rem] border-2 border-emerald-900 bg-white p-8 shadow-xl sm:p-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.15em] text-amber-700">Early Access</p>
              <h2 className="mt-2 text-2xl font-black text-emerald-950">Free</h2>
            </div>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">V1</span>
          </div>

          <p className="mt-6 text-4xl font-black text-emerald-950">₦0</p>
          <p className="mt-2 text-slate-600">No subscription payment required during early access.</p>

          <ul className="mt-8 space-y-4 text-slate-700">
            {['Customer records', 'Product management', 'Order management', 'Business dashboard', 'Order status tracking', 'WhatsApp-friendly workflow'].map((item) => (
              <li key={item} className="flex gap-3">
                <span className="font-black text-emerald-700">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <a href="/signup" className="mt-9 block rounded-2xl bg-emerald-900 px-6 py-4 text-center font-bold text-white transition hover:bg-emerald-800">
            Start Free
          </a>
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-center text-sm leading-6 text-slate-500">
          Pricing may change as NaijaOrder develops. Any future paid plans and billing terms will be communicated before they apply.
        </p>
      </section>
    </main>
  );
}
