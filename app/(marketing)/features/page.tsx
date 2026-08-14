const features = [
  {
    title: 'Order Management',
    text: 'Keep customer orders in one place instead of searching through WhatsApp chats and notebooks.'
  },
  {
    title: 'Customer Management',
    text: 'Store customer details alongside their orders so you can quickly find the people you serve.'
  },
  {
    title: 'Product Management',
    text: 'Create and manage your products from a simple business dashboard.'
  },
  {
    title: 'Dashboard Overview',
    text: 'See important business activity such as sales, orders, pending orders and customers at a glance.'
  },
  {
    title: 'Order Status',
    text: 'Track where an order is in your workflow and keep your records up to date.'
  },
  {
    title: 'WhatsApp-Friendly',
    text: 'Keep WhatsApp as part of your customer workflow while using NaijaOrder to organize the records behind it.'
  }
];

export default function Page() {
  return (
    <main className="bg-[#fffaf0]">
      <section className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-700">Simple tools. Less chasing.</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-emerald-950 sm:text-6xl">Everything you need to stay on top of your orders.</h1>
          <p className="mt-6 text-lg leading-8 text-slate-700 sm:text-xl">
            NaijaOrder gives Nigerian small businesses one simple place to organize customers, products and orders.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <article key={feature.title} className="rounded-3xl border border-emerald-950/10 bg-white p-7 shadow-sm">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-900 text-lg font-black text-amber-300">✓</div>
              <h2 className="mt-6 text-xl font-black text-emerald-950">{feature.title}</h2>
              <p className="mt-3 leading-7 text-slate-600">{feature.text}</p>
            </article>
          ))}
        </div>

        <div className="mt-14 rounded-3xl bg-emerald-950 px-7 py-10 text-white sm:px-10">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-300">Built for V1</p>
          <h2 className="mt-3 text-3xl font-black">Start simple. Grow with your business.</h2>
          <p className="mt-4 max-w-2xl leading-7 text-emerald-50/80">
            NaijaOrder is being developed around the everyday workflow of small businesses. The early-access version focuses on keeping customer, product and order records organized without unnecessary complexity.
          </p>
        </div>
      </section>
    </main>
  );
}
