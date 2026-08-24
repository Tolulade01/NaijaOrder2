import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

function redirectToUpgrade(params: Record<string, string>) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://naija-order2.vercel.app';
  const url = new URL('/app/upgrade', siteUrl);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  return NextResponse.redirect(url);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const status = url.searchParams.get('status');
  const txRef = url.searchParams.get('tx_ref');
  const transactionId = url.searchParams.get('transaction_id');
  const secretKey = process.env.FLW_SECRET_KEY;

  if (!txRef || !secretKey) {
    return redirectToUpgrade({ error: 'Payment could not be verified. Please try again.' });
  }

  const admin = createAdminClient();
  const { data: payment } = await admin
    .from('billing_payments')
    .select('id,business_id,plan,amount,currency,status')
    .eq('tx_ref', txRef)
    .maybeSingle<{ id: string; business_id: string; plan: 'pro' | 'business'; amount: number; currency: string; status: string }>();

  if (!payment) return redirectToUpgrade({ error: 'Payment reference was not found.' });

  if (payment.status === 'successful') {
    return redirectToUpgrade({ success: 'Payment confirmed. Your plan is active.' });
  }

  if (status !== 'successful' || !transactionId) {
    await admin.from('billing_payments').update({ status: status === 'cancelled' ? 'cancelled' : 'failed', updated_at: new Date().toISOString() }).eq('id', payment.id);
    return redirectToUpgrade({ error: 'Payment was not completed.' });
  }

  const verifyResponse = await fetch(`https://api.flutterwave.com/v3/transactions/${encodeURIComponent(transactionId)}/verify`, {
    headers: { Authorization: `Bearer ${secretKey}` },
    cache: 'no-store',
  });
  const verification = (await verifyResponse.json()) as {
    status?: string;
    message?: string;
    data?: { id?: number; tx_ref?: string; status?: string; amount?: number; currency?: string };
  };
  const data = verification.data;

  const valid = verifyResponse.ok
    && verification.status === 'success'
    && data?.status === 'successful'
    && data.tx_ref === txRef
    && data.currency === payment.currency
    && Number(data.amount) >= Number(payment.amount);

  if (!valid) {
    await admin.from('billing_payments').update({ status: 'failed', flutterwave_transaction_id: Number(transactionId) || null, updated_at: new Date().toISOString() }).eq('id', payment.id);
    return redirectToUpgrade({ error: verification.message || 'Flutterwave could not verify this payment.' });
  }

  const now = new Date();
  const { data: business } = await admin
    .from('businesses')
    .select('plan,plan_expires_at')
    .eq('id', payment.business_id)
    .single<{ plan: string; plan_expires_at: string | null }>();

  const existingExpiry = business?.plan_expires_at ? new Date(business.plan_expires_at) : null;
  const start = existingExpiry && existingExpiry > now ? existingExpiry : now;
  const expires = new Date(start);
  expires.setDate(expires.getDate() + 30);

  const { error: businessError } = await admin
    .from('businesses')
    .update({ plan: payment.plan, plan_started_at: now.toISOString(), plan_expires_at: expires.toISOString() })
    .eq('id', payment.business_id);

  if (businessError) {
    return redirectToUpgrade({ error: 'Payment was verified, but we could not activate your plan yet. Please contact support.' });
  }

  await admin.from('billing_payments').update({
    status: 'successful',
    flutterwave_transaction_id: Number(transactionId) || null,
    updated_at: now.toISOString(),
  }).eq('id', payment.id);

  return redirectToUpgrade({ success: `${payment.plan === 'pro' ? 'Pro' : 'Business'} plan activated for 30 days.` });
}
