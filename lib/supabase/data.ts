import { redirect } from 'next/navigation';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from './server';
import type { Business } from '@/types';

export async function getBusiness() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: business, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('owner_id', user.id)
    .single<Business>();

  if (error || !business) {
    redirect('/app/settings');
  }

  return { supabase, user, business };
}

export async function nextOrderNumber(supabase: SupabaseClient, businessId: string) {
  const { count } = await supabase.from('orders').select('id', { count: 'exact', head: true }).eq('business_id', businessId);
  return `ORD-${1001 + (count ?? 0)}`;
}
