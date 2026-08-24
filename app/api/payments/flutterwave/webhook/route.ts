import crypto from 'node:crypto';
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

function validSignature(rawBody: string, signature: string | null, secretHash: string) {
  if (!signature) return false;
  const expected = crypto.createHmac('sha256', secretHash).update(rawBody).digest('base64');
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  const secretHash = process.env.FLW_SECRET_HASH;
  const secretKey = process.env.FLW_SECRET_KEY;
  if (!secretHash || !secretKey) return new NextResponse('Webhook not configured', { status: 500 });

  const rawBody = await request.text();
  const signature = request.headers.get('flutterwave-signature');
  if (!validSignature(rawBody, signature, secretHash)) return new NextResponse('Invalid signature', { status: 401 });

  let payload: { type?: string; event?: string; data?: { id?: number; tx_ref?: string; status?: string } };
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return new NextResponse('Invalid JSON', { status: 400 });
  }

  const transactionId = payload.data?.id;
  const txRef = payload.data?.tx_ref;
  if (!transactionId || !txRef) return NextResponse.json({ received: true });

  const admin = createAdminClient();
  const { data: payment } = await admin
    .from('billing_payments')
    .select('id,business_id,plan,amount,currency,status')
    .eq('tx_ref', txRef)
    .maybeSingle<{ id: string; business_id: string; plan: 'pro' | 'business'; amount: number; currency: string; status: string }>();

  if (!payment || payment.status === 'successful') return NextResponse.json({ received: true });

  const verifyResponse = await fetch(`https://api.flutterwave.com/v3/transactions/${encodeURIComponent(transactionId)}/verify`, {
    headers: { Authorization: `Bearer ${secretKey}` },
    cache: 'no-store',
  });
  const verification = (await verifyResponse.json()) as {
    status?: string;
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
    await admin.from('billing_payments').update({ status: 'failed', flutterwave_transaction_id: transactionId, updated_at: new Date().toISOString() }).eq('id', payment.id);
    return NextResponse.json({ received: true });
  }

  const now = new Date();
  const { data: business } = await admin
    .from('businesses')
    .select('plan_expires_at')
    .eq('id', payment.business_id)
    .single<{ plan_expires_at: string | null }>();
  const existingExpiry = business?.plan_expires_at ? new Date(business.plan_expires_at) : null;
  const start = existingExpiry && existingExpiry > now ? existingExpiry : now;
  const expires = new Date(start);
  expires.setDate(expires.getDate() + 30);

  const { error: businessError } = await admin.from('businesses').update({
    plan: payment.plan,
    plan_started_at: now.toISOString(),
    plan_expires_at: expires.toISOString(),
  }).eq('id', payment.business_id);

  if (!businessError) {
    await admin.from('billing_payments').update({
      status: 'successful',
      flutterwave_transaction_id: transactionId,
      updated_at: now.toISOString(),
    }).eq('id', payment.id);
  }

  return NextResponse.json({ received: true });
}
