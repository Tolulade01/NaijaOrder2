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

  const query = q.trim().toLowerCase();
  const customers = (data ?? []).filter((customer) =>
    !query ||
    [customer.name, customer.phone, customer.whatsapp_number, customer.email, customer.city, customer.state]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query)),
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black">Customers</h1>
          <p className="text-sm text-gray-500">Search by name, phone, WhatsApp, email or location.</p>
        </div>
        <Link className="btn btn-primary" href="/app/customers/new">
          + Customer
        </Link>
      </div>

      <form className="my-4">
        <input className="input" name="q" placeholder="Search customers" defaultValue={q} />
      </form>

      <div className="space-y-3">
        {customers.map((customer) => (
          <Link className="card block p-4 transition hover:-translate-y-0.5 hover:shadow-md" href={`/app/customers/${customer.id}`} key={customer.id}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <b>{customer.name}</b>
                <p className="text-sm text-gray-500">{customer.phone || customer.whatsapp_number || customer.email || 'No contact details'}</p>
              </div>
              <span className="text-sm font-semibold text-emerald-800">View customer →</span>
            </div>
          </Link>
        ))}
        {!customers.length && <p className="card p-4">No customers found.</p>}
      </div>
    </div>
  );
}
