import Link from 'next/link';
import { CheckCircle, MessageCircle, Users, Package, ShoppingCart, BarChart3 } from 'lucide-react';

const features = [
  { title: 'Manage orders', text: 'Create orders, add multiple products, track payment and update order status from one place.', icon: ShoppingCart },
  { title: 'Know your customers', text: 'Keep customer details and order history together so repeat customers are easy to find.', icon: Users },
  { title: 'Keep products organized', text: 'Store your products, prices and stock details in a simple business workspace.', icon: Package },
  { title: 'See your business clearly', text: 'Use the dashboard to quickly see sales, orders, pending work and customers.', icon: BarChart3 },
];

const faqs = [
  ['What is NaijaOrder?', 'NaijaOrder is a simple order-management workspace for Nigerian businesses that sell through WhatsApp, Instagram, phone calls and other channels.'],
  ['Do I need to change how I sell?', 'No. Keep using the channels your customers already use. NaijaOrder helps you organize the customers, products and orders coming from those conversations.'],
  ['Is there a free plan?', 'Yes. The Free plan includes up to 25 orders each month, with unlimited customers and products.'],
  ['What happens when I need more orders?', 'You can upgrade to Pro for ₦3,500 for up to 100 orders or Business for ₦7,000 for unlimited orders.'],
  ['Can I send orders through WhatsApp?', 'Yes. NaijaOrder creates WhatsApp-friendly order messages with the important order details so you can share them quickly.'],
];

export default function Home() {
  return (
    <div>
      {/* Problem + solution */}
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:py-20 md:grid-cols-[1.05fr_0.95fr] md:items-center">
        <div>
          <p className="font-bold text-amber-700">Simple order management for Nigerian businesses</p>
          <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight text-emerald-950 sm:text-6xl">Stop losing customer orders in WhatsApp.</h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-700 sm:text-xl">NaijaOrder helps you organize customers, products and orders in one simple dashboard — so you spend less time searching through chats and more time serving customers.</p>
          <p className="mt-4 font-semibold text-emerald-900">Know what you sold. Know who ordered. Know what&apos;s next.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link className="btn btn-primary" href="/signup">Start Free</Link>
            <Link className="btn btn-secondary" href="/features">See How It Works</Link>
          </div>
          <p className="mt-4 text-sm text-slate-500">Start with up to 25 orders every month. Upgrade only when you need more.</p>
        </div>

        <div className="card p-5 sm:p-6">
          <div className="flex items-center justify-between"><div><p className="text-sm font-semibold text-slate-500">Business overview</p><h2 className="mt-1 text-xl font-black text-emerald-950">Today</h2></div><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">On track</span></div>
          <div className="mt-5 grid grid-cols-2 gap-3">{[['₦61,000','Sales'],['8','Orders'],['3','Pending'],['24','Customers']].map(([value,label])=><div className="rounded-2xl bg-amber-50 p-4" key={label}><p className="text-2xl font-black text-emerald-950">{value}</p><p className="mt-1 text-sm text-slate-600">{label}</p></div>)}</div>
          <div className="mt-4 rounded-2xl border border-emerald-950/10 p-4"><div className="flex items-center gap-2 font-bold text-emerald-950"><MessageCircle size={18}/>WhatsApp-friendly</div><p className="mt-2 text-sm leading-6 text-slate-600">Keep using WhatsApp to talk to customers while NaijaOrder keeps your records organized.</p></div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-y border-emerald-950/10 bg-white px-4 py-14 sm:py-18"><div className="mx-auto max-w-6xl"><div className="max-w-2xl"><p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-700">How it works</p><h2 className="mt-3 text-3xl font-black text-emerald-950 sm:text-4xl">From customer message to completed order.</h2><p className="mt-4 leading-7 text-slate-600">No complicated setup. Add the information you already work with and keep everything in one place.</p></div><div className="mt-10 grid gap-5 md:grid-cols-3">{[['01','Add customers & products','Save customer details and the products you sell.'],['02','Create an order','Choose a customer, add one or more products, set delivery and payment details.'],['03','Track & follow up','Update the order as it moves through your workflow and share the order on WhatsApp.']].map(([number,title,text])=><article className="rounded-3xl border border-emerald-950/10 bg-[#fffaf0] p-6" key={number}><span className="text-3xl font-black text-emerald-800">{number}</span><h3 className="mt-5 text-xl font-black text-emerald-950">{title}</h3><p className="mt-3 leading-7 text-slate-600">{text}</p></article>)}</div></div></section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:py-20"><div className="text-center"><p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-700">Everything in one place</p><h2 className="mt-3 text-3xl font-black text-emerald-950 sm:text-4xl">Simple tools for everyday business.</h2></div><div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{features.map(({title,text,icon:Icon})=><article className="card p-6" key={title}><div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-900 text-amber-300"><Icon size={21}/></div><h3 className="mt-5 text-lg font-black text-emerald-950">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{text}</p></article>)}</div></section>

      {/* Social proof / testimonial placeholder without fake customer claims */}
      <section className="bg-emerald-950 px-4 py-14 text-white sm:py-18"><div className="mx-auto max-w-5xl"><div className="max-w-2xl"><p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-300">Built around a real problem</p><h2 className="mt-3 text-3xl font-black sm:text-4xl">Your customers should not have to wait while you search through old chats.</h2><p className="mt-4 leading-7 text-emerald-50/80">NaijaOrder is designed for the everyday reality of businesses taking orders from WhatsApp and social media.</p></div><div className="mt-8 rounded-3xl bg-white/10 p-6 sm:p-8"><p className="text-xl font-semibold leading-8">“I just want to know what I sold, who ordered, and which orders are still pending.”</p><p className="mt-4 text-sm text-emerald-100/70">That simple need is at the heart of NaijaOrder.</p></div></div></section>

      {/* Pricing */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:py-20"><div className="text-center"><p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-700">Simple pricing</p><h2 className="mt-3 text-3xl font-black text-emerald-950 sm:text-4xl">Start free. Upgrade when you grow.</h2><p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">No complicated setup. Choose the plan that matches your order volume.</p></div><div className="mt-10 grid gap-5 md:grid-cols-3"><div className="card p-6"><p className="font-bold text-emerald-800">Free</p><p className="mt-2 text-3xl font-black">₦0</p><p className="mt-1 text-sm text-slate-500">25 orders/month</p></div><div className="card border-2 border-amber-400 p-6"><p className="font-bold text-emerald-800">Pro</p><p className="mt-2 text-3xl font-black">₦3,500</p><p className="mt-1 text-sm text-slate-500">100 orders/month</p></div><div className="card p-6"><p className="font-bold text-emerald-800">Business</p><p className="mt-2 text-3xl font-black">₦7,000</p><p className="mt-1 text-sm text-slate-500">Unlimited orders</p></div></div><div className="text-center"><Link className="btn btn-secondary mt-7" href="/pricing">See full pricing</Link></div></section>

      {/* FAQ */}
      <section className="border-y border-emerald-950/10 bg-[#fffaf0] px-4 py-14 sm:py-20"><div className="mx-auto max-w-4xl"><div className="text-center"><p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-700">FAQ</p><h2 className="mt-3 text-3xl font-black text-emerald-950 sm:text-4xl">Questions you may have.</h2></div><div className="mt-8 space-y-3">{faqs.map(([question,answer])=><details className="rounded-2xl border border-emerald-950/10 bg-white p-5" key={question}><summary className="cursor-pointer font-bold text-emerald-950">{question}</summary><p className="mt-3 leading-7 text-slate-600">{answer}</p></details>)}</div></div></section>

      {/* Final CTA */}
      <section className="bg-amber-400 px-4 py-14 text-center text-emerald-950 sm:py-20"><h2 className="text-3xl font-black sm:text-4xl">Ready to stop chasing orders through chats?</h2><p className="mx-auto mt-3 max-w-2xl leading-7">Bring your customers, products and orders into one simple workspace.</p><Link className="btn mt-6 bg-emerald-950 text-white" href="/signup">Start Free</Link></section>
    </div>
  );
}
