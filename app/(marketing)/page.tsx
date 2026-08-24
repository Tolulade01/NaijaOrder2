import Link from 'next/link';
import { CheckCircle, MessageCircle, Users, Package, ShoppingCart, BarChart3 } from 'lucide-react';

const features = [
  {
    title: 'Manage orders',
    text: 'Create orders, add multiple products, track payment and update order status from one place.',
    icon: ShoppingCart,
  },
  {
    title: 'Know your customers',
    text: 'Keep customer details and order history together so repeat customers are easy to find.',
    icon: Users,
  },
  {
    title: 'Keep products organized',
    text: 'Store your products, prices and stock details in a simple business workspace.',
    icon: Package,
  },
  {
    title: 'See your business clearly',
    text: 'Use the dashboard to quickly see sales, orders, pending work and customers.',
    icon: BarChart3,
  },
];

export default function Home() {
  return (
    <div>
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:py-20 md:grid-cols-[1.05fr_0.95fr] md:items-center">
        <div>
          <p className="font-bold text-amber-700">Your orders. Your customers. One simple dashboard.</p>
          <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight text-emerald-950 sm:text-6xl">
            Know what you sold. Know who ordered. Know what&apos;s next.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-700 sm:text-xl">
            NaijaOrder helps Nigerian small businesses turn orders from WhatsApp, Instagram, phone calls and other channels into organized customer, product and order records.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link className="btn btn-primary" href="/signup">
              Start Free
            </Link>
            <Link className="btn btn-secondary" href="/features">
              See Features
            </Link>
          </div>
          <p className="mt-4 text-sm text-slate-500">Start with up to 25 orders every month. Upgrade only when you need more.</p>
        </div>

        <div className="card p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">Business overview</p>
              <h2 className="mt-1 text-xl font-black text-emerald-950">Today</h2>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">On track</span>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {[
              ['₦61,000', 'Sales'],
              ['8', 'Orders'],
              ['3', 'Pending'],
              ['24', 'Customers'],
            ].map(([value, label]) => (
              <div className="rounded-2xl bg-amber-50 p-4" key={label}>
                <p className="text-2xl font-black text-emerald-950">{value}</p>
                <p className="mt-1 text-sm text-slate-600">{label}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-2xl border border-emerald-950/10 p-4">
            <div className="flex items-center gap-2 font-bold text-emerald-950">
              <MessageCircle size={18} />
              WhatsApp-friendly
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">Keep using WhatsApp to talk to customers while NaijaOrder keeps your records organized.</p>
          </div>
        </div>
      </section>

      <section id="how" className="border-y border-emerald-950/10 bg-white px-4 py-14 sm:py-18">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-700">How it works</p>
            <h2 className="mt-3 text-3xl font-black text-emerald-950 sm:text-4xl">From customer message to completed order.</h2>
            <p className="mt-4 leading-7 text-slate-600">No complicated setup. Add the information you already work with and keep everything in one place.</p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              ['01', 'Add customers & products', 'Save customer details and the products you sell.'],
              ['02', 'Create an order', 'Choose a customer, add one or more products, set delivery and payment details.'],
              ['03', 'Track & follow up', 'Update the order as it moves through your workflow and share the order on WhatsApp.'],
            ].map(([number, title, text]) => (
              <article className="rounded-3xl border border-emerald-950/10 bg-[#fffaf0] p-6" key={number}>
                <span className="text-3xl font-black text-emerald-800">{number}</span>
                <h3 className="mt-5 text-xl font-black text-emerald-950">{title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-700">Everything in one place</p>
          <h2 className="mt-3 text-3xl font-black text-emerald-950 sm:text-4xl">Simple tools for everyday business.</h2>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ title, text, icon: Icon }) => (
            <article className="card p-6" key={title}>
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-900 text-amber-300">
                <Icon size={21} />
              </div>
              <h3 className="mt-5 text-lg font-black text-emerald-950">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-emerald-950 px-4 py-14 text-white sm:py-18">
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-[1fr_0.8fr] md:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-300">Built for Nigerian businesses</p>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">You don&apos;t need a complicated system to run your orders better.</h2>
            <p className="mt-4 max-w-2xl leading-7 text-emerald-50/80">
              Whether you sell fashion, food, cakes, beauty products, shoes, jewellery, gifts or other products, NaijaOrder gives you a clearer way to manage the orders coming in every day.
            </p>
          </div>
          <div className="rounded-3xl bg-white/10 p-6">
            <p className="text-lg font-semibold leading-8">“I just want to know what I sold, who ordered, and which orders are still pending.”</p>
            <p className="mt-4 text-sm text-emerald-100/70">The kind of everyday simplicity NaijaOrder is built around.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="card p-7 sm:p-8">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-700">Start free</p>
            <h2 className="mt-3 text-3xl font-black text-emerald-950">Try NaijaOrder with no upfront cost.</h2>
            <p className="mt-4 leading-7 text-slate-600">The Free plan includes up to 25 orders each month, with unlimited customers and products.</p>
            <Link className="btn btn-primary mt-6" href="/signup">Create your free account</Link>
          </div>
          <div className="card p-7 sm:p-8">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-700">When you grow</p>
            <h2 className="mt-3 text-3xl font-black text-emerald-950">Upgrade when your order volume demands it.</h2>
            <div className="mt-4 space-y-2 text-slate-700">
              <p className="flex gap-2"><CheckCircle className="mt-1 shrink-0 text-emerald-700" size={18} />Pro: ₦3,500/month for up to 100 orders.</p>
              <p className="flex gap-2"><CheckCircle className="mt-1 shrink-0 text-emerald-700" size={18} />Business: ₦7,000/month for unlimited orders.</p>
            </div>
            <Link className="btn btn-secondary mt-6" href="/pricing">View pricing</Link>
          </div>
        </div>
      </section>

      <section className="bg-amber-400 px-4 py-14 text-center text-emerald-950">
        <h2 className="text-3xl font-black sm:text-4xl">Ready to stop chasing orders through chats?</h2>
        <p className="mx-auto mt-3 max-w-2xl leading-7">Bring your customers, products and orders into one simple workspace.</p>
        <Link className="btn mt-6 bg-emerald-950 text-white" href="/signup">Start Free</Link>
      </section>
    </div>
  );
}
