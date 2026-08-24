import { redirect } from 'next/navigation';
import { getBusiness } from '@/lib/supabase/data';
import { createAdminClient } from '@/lib/supabase/admin';

const PLANS = {
  pro: { amount: 3500, label: 'Pro' },
  business: { amount: 7000, label: 'Business' },
} as const;

type Plan = keyof typeof PLANS;

function safeMessage(value: string) {
  return encodeURIComponent(value.slice(0, 180));
}

function getPublicSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, '');

  // Never send Flutterwave back to a local development URL from production.
  if (configured && !/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(configured)) {
    return configured;
  }

  return 'https://naija-order2.vercel.app';
}

export async function POST(request: Request) {
  const { business, user } = await getBusiness();
  const form = await request.formData();
  const plan = String(form.get('plan') || '') as Plan;
  const selected = PLANS[plan];

  if (!selected) redirect(`/app/upgrade?error=${safeMessage('Please select a valid paid plan.')}`);
  if (business.plan === plan && business.plan_expires_at && new Date(business.plan_expires_at) > new Date()) {
    redirect(`/app/upgrade?success=${safeMessage(`Your ${selected.label} plan is already active.`)}`);
  }

  const secretKey = process.env.FLW_SECRET_KEY;
  const siteUrl = getPublicSiteUrl();
  if (!secretKey) redirect(`/app/upgrade?error=${safeMessage('Flutterwave is not configured yet. Please try again later.')}`);

  const txRef = `NAIJAORDER-${business.id.slice(0, 8)}-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
  const admin = createAdminClient();

  const { error: paymentInsertError } = await admin.from('billing_payments').insert({
    business_id: business.id,
    tx_ref: txRef,
    plan,
    amount: selected.amount,
    currency: 'NGN',
    status: 'pending',
  });

  if (paymentInsertError) {
    redirect(`/app/upgrade?error=${safeMessage(paymentInsertError.message)}`);
  }

  const customerEmail = user.email || business.email;
  if (!customerEmail) {
    await admin.from('billing_payments').update({ status: 'failed' }).eq('tx_ref', txRef);
    redirect(`/app/upgrade?error=${safeMessage('Please add an email address to your account before upgrading.')}`);
  }

  const response = await fetch('https://api.flutterwave.com/v3/payments', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      tx_ref: txRef,
      amount: selected.amount,
      currency: 'NGN',
      redirect_url: `${siteUrl}/api/payments/flutterwave/callback`,
      customer: {
        email: customerEmail,
        name: user.user_metadata?.full_name || business.name,
        phonenumber: business.phone || undefined,
      },
      customizations: {
        title: `NaijaOrder ${selected.label}`,
        description: `${selected.label} plan - 30 days`,
      },
      meta: {
        business_id: business.id,
        plan,
      },
      payment_options: 'card,banktransfer,ussd,account,nqr,opay',
    }),
  });

  const result = (await response.json()) as { status?: string; message?: string; data?: { link?: string } };
  if (!response.ok || result.status !== 'success' || !result.data?.link) {
    await admin.from('billing_payments').update({ status: 'failed' }).eq('tx_ref', txRef);
    redirect(`/app/upgrade?error=${safeMessage(result.message || 'Unable to start Flutterwave checkout.')}`);
  }

  redirect(result.data.link);
}
