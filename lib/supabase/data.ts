import { redirect } from 'next/navigation';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from './server';
import type { Business, BusinessPlan } from '@/types';

export const FREE_ORDER_LIMIT = 25;
export const PRO_ORDER_LIMIT = 100;

function effectivePlan(business: Business): BusinessPlan {
  if (business.plan === 'free') return 'free';
  if (!business.plan_expires_at) return business.plan;
  return new Date(business.plan_expires_at) > new Date() ? business.plan : 'free';
}

export async function getBusiness() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: business, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('owner_id', user.id)
    .single<Business>();

  if (error || !business) redirect('/app/settings');

  return { supabase, user, business: { ...business, plan: effectivePlan(business) } };
}

export async function getMonthlyOrderUsage(
  supabase: SupabaseClient,
  businessId: string,
  plan: BusinessPlan = 'free',
) {
  // NaijaOrder uses the Nigeria calendar month (Africa/Lagos) for monthly quotas.
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Africa/Lagos',
    year: 'numeric',
    month: '2-digit',
  }).formatToParts(new Date());
  const year = parts.find((part) => part.type === 'year')?.value;
  const month = parts.find((part) => part.type === 'month')?.value;
  const monthKey = `${year}-${month}-01`;

  const { data, error } = await supabase
    .from('monthly_order_usage')
    .select('orders_created')
    .eq('business_id', businessId)
    .eq('month_start', monthKey)
    .maybeSingle<{ orders_created: number }>();

  if (error) throw new Error(error.message);

  const limit = plan === 'free' ? FREE_ORDER_LIMIT : plan === 'pro' ? PRO_ORDER_LIMIT : null;
  const used = Number(data?.orders_created ?? 0);

  return {
    used,
    limit,
    remaining: limit === null ? null : Math.max(limit - used, 0),
    isAtLimit: limit !== null && used >= limit,
  };
}

export async function nextOrderNumber(supabase: SupabaseClient, businessId: string) {
  const { count } = await supabase.from('orders').select('id', { count: 'exact', head: true }).eq('business_id', businessId);
  return `ORD-${1001 + (count ?? 0)}`;
}
