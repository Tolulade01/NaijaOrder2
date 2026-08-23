'use client';

import { FormEvent, useState } from 'react';

const CONTACT_EMAIL = 'help@naijaorder.com';

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name') || '').trim();
    const email = String(form.get('email') || '').trim();
    const subject = String(form.get('subject') || '').trim();
    const message = String(form.get('message') || '').trim();

    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject || 'NaijaOrder enquiry')}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
    setSubmitted(true);
  }

  return (
    <div className="rounded-3xl border border-emerald-950/10 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-emerald-950">Send us a message</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">Tell us what you need help with and we&apos;ll get back to you.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-800">Name</span>
            <input name="name" required className="input w-full" placeholder="Your name" />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-800">Email</span>
            <input name="email" type="email" required className="input w-full" placeholder="you@example.com" />
          </label>
        </div>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-800">Subject</span>
          <input name="subject" required className="input w-full" placeholder="How can we help?" />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-800">Message</span>
          <textarea name="message" required rows={6} className="input w-full resize-y" placeholder="Tell us what you need..." />
        </label>

        <button type="submit" className="btn btn-primary w-full sm:w-auto">
          Send message
        </button>

        {submitted && (
          <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800" role="status">
            Your email app should open with the message ready to send. If it doesn&apos;t, email us directly at {CONTACT_EMAIL}.
          </p>
        )}
      </form>
    </div>
  );
}
