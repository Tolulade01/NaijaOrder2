import Link from 'next/link';
import { getBusiness } from '@/lib/supabase/data';
import { formatDate, formatNaira } from '@/lib/utils/format';
import type { Customer, Order } from '@/types';

type OrderRow = Order & { customers: Pick<Customer, 'name'> | null };

export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string; status?: string }> }) {
  const { q = '', status = '' } = await searchParams;
  const { supabase, business } = await getBusiness();
  const { data } = await supabase
    .from('orders')
    .select('*,customers(name)')
    .eq('business_id', business.id)
    .order('created_at', { ascending: false })
    .returns<OrderRow[]>();
  const rows = (data ?? []).filter((order) => {
    const matchesStatus = !status || order.status === status;
    const lowerQuery = q.toLowerCase();
    const matchesSearch =
      !q ||
      order.order_number.toLowerCase().includes(lowerQuery) ||
      (order.customers?.name.toLowerCase().includes(lowerQuery) ?? false);
    return matchesStatus && matchesSearch;
  });

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-3xl font-black">Orders</h1>
        <Link className="btn btn-primary" href="/app/orders/new">
          + Order
        </Link>
      </div>
      <form className="my-4 grid gap-2 md:grid-cols-2">
        <input className="input" name="q" placeholder="Search order/customer" defaultValue={q} />
        <select className="input" name="status" defaultValue={status}>
          <option value="">All statuses</option>
          {['New', 'Awaiting Payment', 'Paid', 'Processing', 'Ready', 'Shipped', 'Delivered', 'Cancelled'].map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </form>
      <div className="space-y-3">
        {rows.map((order) => (
          <Link className="card grid grid-cols-2 p-4 md:grid-cols-5" href={`/app/orders/${order.id}`} key={order.id}>
            <b>{order.order_number}</b>
            <span>{order.customers?.name}</span>
            <span>{formatNaira(Number(order.total))}</span>
            <span>
              {order.payment_status} / {order.status}
            </span>
            <span>{formatDate(order.created_at)}</span>
          </Link>
        ))}
        {!rows.length && <p className="card p-4">No orders found.</p>}
      </div>
    </div>
  );
}
