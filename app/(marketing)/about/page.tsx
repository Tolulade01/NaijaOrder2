export default function Page() {
  return (
    <main className="bg-[#fffaf0]">
      <section className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-700">About NaijaOrder</p>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-emerald-950 sm:text-6xl">Built around the way small businesses actually sell.</h1>
            <p className="mt-6 text-lg leading-8 text-slate-700">
              Many small businesses manage customer conversations, product details, orders and payment updates across different places. NaijaOrder is designed to bring those records together in one simple dashboard.
            </p>
            <p className="mt-5 text-lg leading-8 text-slate-700">
              The goal is straightforward: help business owners spend less time searching through chats and notebooks and more time serving their customers.
            </p>
          </div>

          <div className="rounded-[2rem] bg-emerald-950 p-8 text-white shadow-xl sm:p-10">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-300">Our focus</p>
            <div className="mt-7 space-y-7">
              <div>
                <h2 className="text-xl font-black">Simple</h2>
                <p className="mt-2 leading-7 text-emerald-50/75">Useful business tools without an unnecessarily complicated interface.</p>
              </div>
              <div>
                <h2 className="text-xl font-black">Practical</h2>
                <p className="mt-2 leading-7 text-emerald-50/75">Features are centered on everyday customer, product and order workflows.</p>
              </div>
              <div>
                <h2 className="text-xl font-black">Mobile-first</h2>
                <p className="mt-2 leading-7 text-emerald-50/75">Designed for business owners who need to manage work wherever they are.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-3">
          <div className="rounded-3xl border border-emerald-950/10 bg-white p-7">
            <p className="text-3xl font-black text-emerald-900">01</p>
            <h2 className="mt-4 text-xl font-black text-emerald-950">Capture</h2>
            <p className="mt-2 leading-7 text-slate-600">Keep customer and order information where you can find it.</p>
          </div>
          <div className="rounded-3xl border border-emerald-950/10 bg-white p-7">
            <p className="text-3xl font-black text-emerald-900">02</p>
            <h2 className="mt-4 text-xl font-black text-emerald-950">Organize</h2>
            <p className="mt-2 leading-7 text-slate-600">Manage products, customers and orders from one workspace.</p>
          </div>
          <div className="rounded-3xl border border-emerald-950/10 bg-white p-7">
            <p className="text-3xl font-black text-emerald-900">03</p>
            <h2 className="mt-4 text-xl font-black text-emerald-950">Grow</h2>
            <p className="mt-2 leading-7 text-slate-600">Build a clearer picture of your business as your records grow.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
