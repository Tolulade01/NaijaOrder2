import ContactForm from '@/components/ContactForm';

export default function Page() {
  return (
    <main className="bg-[#fffaf0]">
      <section className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-700">Contact</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-emerald-950 sm:text-6xl">We&apos;d love to hear from you.</h1>
          <p className="mt-6 text-lg leading-8 text-slate-700 sm:text-xl">
            Have a question about NaijaOrder, need help getting started, or have an idea that could make the product more useful for your business?
          </p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_1.15fr] lg:items-start">
          <div className="space-y-5">
            <div className="rounded-3xl border border-emerald-950/10 bg-white p-7 shadow-sm">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-100 font-black text-emerald-900">?</div>
              <h2 className="mt-5 text-xl font-black text-emerald-950">Product questions</h2>
              <p className="mt-3 leading-7 text-slate-600">Ask about features, your account, orders, customers, products, or how to use the dashboard.</p>
            </div>

            <div className="rounded-3xl border border-emerald-950/10 bg-white p-7 shadow-sm">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-100 font-black text-emerald-900">↗</div>
              <h2 className="mt-5 text-xl font-black text-emerald-950">Feedback & ideas</h2>
              <p className="mt-3 leading-7 text-slate-600">Tell us what feels useful, what feels difficult, and what would save you more time.</p>
            </div>

            <div className="rounded-3xl bg-emerald-950 p-7 text-white sm:p-8">
              <h2 className="text-2xl font-black">Building for Nigerian businesses</h2>
              <p className="mt-3 leading-7 text-emerald-50/80">
                Your real-world feedback helps us make NaijaOrder simpler, faster and more useful for small businesses.
              </p>
            </div>
          </div>

          <ContactForm />
        </div>
      </section>
    </main>
  );
}
