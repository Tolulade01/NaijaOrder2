export default function Page() {
  return (
    <main className="bg-[#fffaf0]">
      <section className="mx-auto max-w-5xl px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-700">Contact</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-emerald-950 sm:text-6xl">We'd love to hear from you.</h1>
          <p className="mt-6 text-lg leading-8 text-slate-700 sm:text-xl">
            Have feedback, a question about NaijaOrder, or an idea that could make the product more useful for your business?
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-3">
          <div className="rounded-3xl border border-emerald-950/10 bg-white p-7 text-center shadow-sm">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-emerald-100 font-black text-emerald-900">?</div>
            <h2 className="mt-5 text-xl font-black text-emerald-950">Product questions</h2>
            <p className="mt-3 leading-7 text-slate-600">Ask about how the early-access version works or share a workflow you want NaijaOrder to support.</p>
          </div>
          <div className="rounded-3xl border border-emerald-950/10 bg-white p-7 text-center shadow-sm">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-emerald-100 font-black text-emerald-900">↗</div>
            <h2 className="mt-5 text-xl font-black text-emerald-950">Feedback</h2>
            <p className="mt-3 leading-7 text-slate-600">Tell us what feels useful, what feels difficult and what would save you time.</p>
          </div>
          <div className="rounded-3xl border border-emerald-950/10 bg-white p-7 text-center shadow-sm">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-emerald-100 font-black text-emerald-900">✓</div>
            <h2 className="mt-5 text-xl font-black text-emerald-950">Early access</h2>
            <p className="mt-3 leading-7 text-slate-600">If you are already using NaijaOrder, use the support channel provided with your account to reach the team.</p>
          </div>
        </div>

        <div className="mt-12 rounded-3xl bg-emerald-950 p-8 text-center text-white sm:p-10">
          <h2 className="text-3xl font-black">Have an idea for NaijaOrder?</h2>
          <p className="mx-auto mt-3 max-w-2xl leading-7 text-emerald-50/80">
            Product feedback from real small-business workflows helps shape what we build next.
          </p>
        </div>
      </section>
    </main>
  );
}
