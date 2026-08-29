'use client';

import Link from 'next/link';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type SignupField = 'full_name' | 'business_name' | 'email' | 'password';
const signupFields: Array<{ name: SignupField; label: string; type: string }> = [
  { name: 'full_name', label: 'Full name', type: 'text' },
  { name: 'business_name', label: 'Business name', type: 'text' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'password', label: 'Password', type: 'password' },
];

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setMsg('');
    const { error } = await createClient().auth.signInWithPassword({ email, password });
    if (error) {
      setMsg(error.message);
      setLoading(false);
    } else {
      location.href = '/app/dashboard';
    }
  }

  return (
    <form onSubmit={submit} className="card mx-auto max-w-md space-y-4 p-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-3xl font-black">Login</h1>
        <Link href="/" className="text-sm font-semibold text-emerald-900 hover:underline">Back to home</Link>
      </div>
      <label className="label">Email<input className="input" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>
      <label className="label">Password<input className="input" type="password" required value={password} onChange={(event) => setPassword(event.target.value)} /></label>
      <div className="flex justify-end"><Link href="/forgot-password" className="text-sm font-semibold text-emerald-900 hover:underline">Forgot password?</Link></div>
      <button className="btn btn-primary w-full" disabled={loading}>{loading ? 'Logging in…' : 'Login'}</button>
      {msg && <p className="text-sm text-red-600">{msg}</p>}
      <p className="text-center text-sm text-gray-600">Don't have an account? <Link href="/signup" className="font-bold text-emerald-900 hover:underline">Sign up</Link></p>
    </form>
  );
}

export function SignupForm() {
  const [form, setForm] = useState<Record<SignupField, string>>({ full_name: '', business_name: '', email: '', password: '' });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setMsg('');
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({ email: form.email, password: form.password, options: { data: { full_name: form.full_name, business_name: form.business_name } } });
    if (error) { setMsg(error.message); setLoading(false); return; }
    if (data.user) {
      await supabase.from('profiles').upsert({ user_id: data.user.id, full_name: form.full_name }, { onConflict: 'user_id' });
      await supabase.from('businesses').insert({ owner_id: data.user.id, name: form.business_name, email: form.email, currency: 'NGN' });
    }
    location.href = '/app/dashboard';
  }

  return (
    <form onSubmit={submit} className="card mx-auto max-w-md space-y-4 p-6">
      <div className="flex items-center justify-between gap-3"><h1 className="text-3xl font-black">Start Free</h1><Link href="/" className="text-sm font-semibold text-emerald-900 hover:underline">Back to home</Link></div>
      {signupFields.map((field) => <label className="label" key={field.name}>{field.label}<input className="input" type={field.type} required value={form[field.name]} onChange={(event) => setForm({ ...form, [field.name]: event.target.value })} /></label>)}
      <button className="btn btn-primary w-full" disabled={loading}>{loading ? 'Creating account…' : 'Create account'}</button>
      {msg && <p className="text-sm text-red-600">{msg}</p>}
      <p className="text-center text-sm text-gray-600">Already have an account? <Link href="/login" className="font-bold text-emerald-900 hover:underline">Log in</Link></p>
    </form>
  );
}

export function ForgotForm() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setMsg('');

    // Send the recovery code through our server callback first. The callback
    // exchanges the one-time PKCE code and stores the Supabase session in the
    // browser before redirecting to the reset form.
    const redirectTo = `${location.origin}/auth/callback?next=/reset-password`;
    const { error } = await createClient().auth.resetPasswordForEmail(email, { redirectTo });
    setMsg(error ? error.message : 'Check your email for reset instructions.');
    setLoading(false);
  }

  return (
    <form onSubmit={submit} className="card mx-auto max-w-md space-y-4 p-6">
      <div className="flex items-center justify-between gap-3"><h1 className="text-3xl font-black">Reset password</h1><Link href="/" className="text-sm font-semibold text-emerald-900 hover:underline">Back to home</Link></div>
      <label className="label">Email<input className="input" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>
      <button className="btn btn-primary w-full" disabled={loading}>{loading ? 'Sending…' : 'Send reset link'}</button>
      {msg && <p className="text-sm text-gray-600">{msg}</p>}
      <p className="text-center text-sm text-gray-600">Remembered your password? <Link href="/login" className="font-bold text-emerald-900 hover:underline">Log in</Link></p>
    </form>
  );
}
