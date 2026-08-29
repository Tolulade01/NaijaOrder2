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
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    let active = true;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const finish = (ok: boolean, error?: string) => {
      if (!active) return;
      if (error) setMessage(error);
      setReady(ok);
      setChecking(false);
    };

    const initialiseRecovery = async () => {
      try {
        // Support the PKCE recovery flow when Supabase returns ?code=...
        const code = new URLSearchParams(window.location.search).get('code');
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            finish(false, 'This password reset link is invalid or has expired. Please request a new link.');
            return;
          }
        }

        const { data, error } = await supabase.auth.getSession();
        if (error) {
          finish(false, 'We could not verify this password reset link. Please request a new one.');
          return;
        }

        if (data.session) {
          finish(true);
          return;
        }

        // Give Supabase's browser auth handler time to process a recovery URL
        // containing access tokens in the URL fragment.
        timer = setTimeout(async () => {
          const { data: retry } = await supabase.auth.getSession();
          if (retry.session) finish(true);
          else finish(false, 'This password reset link is invalid or has expired. Please request a new link.');
        }, 1200);
      } catch {
        finish(false, 'We could not verify this password reset link. Please request a new one.');
      }
    };

    // Subscribe before checking the session so PASSWORD_RECOVERY cannot be missed.
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      if (event === 'PASSWORD_RECOVERY' && session) finish(true);
      if (event === 'SIGNED_IN' && session) finish(true);
    });

    initialiseRecovery();

    return () => {
      active = false;
      if (timer) clearTimeout(timer);
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
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    await supabase.auth.signOut();
    location.href = '/login?success=Password updated successfully. Please log in with your new password.';
  }

  if (checking) {
    return (
      <div className="card mx-auto max-w-md space-y-4 p-6 text-center">
        <h1 className="text-3xl font-black">Reset password</h1>
        <p className="text-gray-600">Verifying your password reset link…</p>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="card mx-auto max-w-md space-y-4 p-6 text-center">
        <h1 className="text-3xl font-black">Reset link unavailable</h1>
        <p className="text-sm text-red-600">{message || 'This password reset link is invalid or has expired.'}</p>
        <Link href="/forgot-password" className="font-semibold text-emerald-900 hover:underline">Request a new link</Link>
        <p className="text-sm text-gray-600"><Link href="/login" className="font-bold text-emerald-900 hover:underline">Back to login</Link></p>
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
