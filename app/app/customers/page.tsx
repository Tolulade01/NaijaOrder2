import Link from 'next/link';
import { getBusiness } from '@/lib/supabase/data';
import type { Customer } from '@/types';

export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = '' } = await searchParams;
  const { supabase, business } = await getBusiness();
  const { data } = await supabase
    .from('customers')
    .select('*')
    .eq('business_id', business.id)
    .order('created_at', { ascending: false })
    .returns<Customer[]>();
  const customers = (data ?? []).filter((customer) => customer.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-3xl font-black">Customers</h1>
        <Link className="btn btn-primary" href="/app/customers/new">
          + Customer
        </Link>
      </div>
      <form className="my-4">
        <input className="input" name="q" placeholder="Search customers" defaultValue={q} />
      </form>
      <div className="space-y-3">
        {customers.map((customer) => (
          <Link className="card block p-4" href={`/app/customers/${customer.id}`} key={customer.id}>
            <b>{customer.name}</b>
            <p>{customer.phone || customer.whatsapp_number}</p>
          </Link>
        ))}
        {!customers.length && <p className="card p-4">No customers found.</p>}
      </div>
    </div>
  );
}
