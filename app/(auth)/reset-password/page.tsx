'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (active && data.session) setReady(true);
    };

    checkSession();
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      if (event === 'PASSWORD_RECOVERY' && session) setReady(true);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (loading) return;
    setMessage('');
    if (password.length < 6) {
      setMessage('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setMessage('Passwords do not match.');
      return;
    }

    setLoading(true);
    const { error } = await createClient().auth.updateUser({ password });
    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    await createClient().auth.signOut();
    location.href = '/login?success=Password updated successfully. Please log in with your new password.';
  }

  if (!ready) {
    return (
      <div className="card mx-auto max-w-md space-y-4 p-6 text-center">
        <h1 className="text-3xl font-black">Reset password</h1>
        <p className="text-gray-600">Verifying your password reset link…</p>
        <Link href="/forgot-password" className="font-semibold text-emerald-900 hover:underline">Request a new link</Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card mx-auto max-w-md space-y-4 p-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-3xl font-black">Choose a new password</h1>
        <Link href="/" className="text-sm font-semibold text-emerald-900 hover:underline">Back to home</Link>
      </div>
      <label className="label">New password<input className="input" type="password" minLength={6} required value={password} onChange={(event) => setPassword(event.target.value)} /></label>
      <label className="label">Confirm password<input className="input" type="password" minLength={6} required value={confirm} onChange={(event) => setConfirm(event.target.value)} /></label>
      <button className="btn btn-primary w-full" disabled={loading}>{loading ? 'Updating password…' : 'Update password'}</button>
      {message && <p className="text-sm text-red-600">{message}</p>}
      <p className="text-center text-sm text-gray-600"><Link href="/login" className="font-bold text-emerald-900 hover:underline">Back to login</Link></p>
    </form>
  );
}
