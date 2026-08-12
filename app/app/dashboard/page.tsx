import Link from 'next/link';
import { getBusiness } from '@/lib/supabase/data';
import { formatDate, formatNaira } from '@/lib/utils/format';
import type { Customer, Order } from '@/types';

type RecentOrder = Order & { customers: Pick<Customer, 'name'> | null };

export default async function Dashboard() {
  const { supabase, business } = await getBusiness();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [ordersResult, customersResult] = await Promise.all([
    supabase
      .from('orders')
      .select('*,customers(name)')
      .eq('business_id', business.id)
      .order('created_at', { ascending: false })
      .limit(6)
      .returns<RecentOrder[]>(),
    supabase.from('customers').select('id', { count: 'exact', head: true }).eq('business_id', business.id),
  ]);
  const orders = ordersResult.data ?? [];
  const customerCount = customersResult.count ?? 0;
  const todaysOrders = orders.filter((order) => new Date(order.created_at) >= today);
  const pending = orders.filter((order) => !['Delivered', 'Cancelled'].includes(order.status)).length;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black">Dashboard</h1>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          ['Today’s Sales', formatNaira(todaysOrders.reduce((sum, order) => sum + Number(order.total), 0))],
          ['Orders', String(orders.length)],
          ['Pending Orders', String(pending)],
          ['Customers', String(customerCount)],
        ].map(([label, value]) => (
          <div className="card p-4" key={label}>
            <p className="text-sm text-gray-500">{label}</p>
            <b className="text-2xl">{value}</b>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <Link className="btn btn-primary" href="/app/orders/new">
          + New Order
        </Link>
        <Link className="btn btn-secondary" href="/app/customers/new">
          + Customer
        </Link>
        <Link className="btn btn-secondary" href="/app/products/new">
          + Product
        </Link>
      </div>
      <section className="card overflow-hidden">
        <h2 className="p-4 text-xl font-bold">Recent Orders</h2>
        {orders.map((order) => (
          <Link className="grid grid-cols-2 gap-2 border-t p-4 md:grid-cols-5" href={`/app/orders/${order.id}`} key={order.id}>
            <span>{order.order_number}</span>
            <span>{order.customers?.name}</span>
            <span>{formatNaira(Number(order.total))}</span>
            <span>{order.status}</span>
            <span>{formatDate(order.created_at)}</span>
          </Link>
        ))}
        {!orders.length && <p className="p-4">No orders yet. Create your first order.</p>}
      </section>
    </div>
  );
}
