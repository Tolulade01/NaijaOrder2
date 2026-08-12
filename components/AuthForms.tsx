'use client';

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

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const { error } = await createClient().auth.signInWithPassword({ email, password });
    if (error) setMsg(error.message);
    else location.href = '/app/dashboard';
  }

  return (
    <form onSubmit={submit} className="card mx-auto max-w-md space-y-4 p-6">
      <h1 className="text-3xl font-black">Login</h1>
      <label className="label">
        Email
        <input className="input" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
      </label>
      <label className="label">
        Password
        <input className="input" type="password" required value={password} onChange={(event) => setPassword(event.target.value)} />
      </label>
      <button className="btn btn-primary w-full">Login</button>
      <p>{msg}</p>
    </form>
  );
}

export function SignupForm() {
  const [form, setForm] = useState<Record<SignupField, string>>({ full_name: '', business_name: '', email: '', password: '' });
  const [msg, setMsg] = useState('');

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.full_name, business_name: form.business_name } },
    });
    if (error) return setMsg(error.message);
    if (data.user) {
      await supabase.from('profiles').insert({ user_id: data.user.id, full_name: form.full_name });
      await supabase.from('businesses').insert({ owner_id: data.user.id, name: form.business_name, email: form.email, currency: 'NGN' });
    }
    location.href = '/app/dashboard';
  }

  return (
    <form onSubmit={submit} className="card mx-auto max-w-md space-y-4 p-6">
      <h1 className="text-3xl font-black">Start Free</h1>
      {signupFields.map((field) => (
        <label className="label" key={field.name}>
          {field.label}
          <input
            className="input"
            type={field.type}
            required
            value={form[field.name]}
            onChange={(event) => setForm({ ...form, [field.name]: event.target.value })}
          />
        </label>
      ))}
      <button className="btn btn-primary w-full">Create account</button>
      <p>{msg}</p>
    </form>
  );
}

export function ForgotForm() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const { error } = await createClient().auth.resetPasswordForEmail(email, { redirectTo: `${location.origin}/login` });
    setMsg(error ? error.message : 'Check your email for reset instructions.');
  }

  return (
    <form onSubmit={submit} className="card mx-auto max-w-md space-y-4 p-6">
      <h1 className="text-3xl font-black">Reset password</h1>
      <label className="label">
        Email
        <input className="input" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
      </label>
      <button className="btn btn-primary w-full">Send reset link</button>
      <p>{msg}</p>
    </form>
  );
}
