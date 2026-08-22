import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBusiness } from '@/lib/supabase/data';
import { CustomerForm } from '@/components/CrudForms';
import { deleteCustomer } from '../../actions';
import { createWhatsAppLink } from '@/lib/whatsapp';
import { formatNaira, formatDate } from '@/lib/utils/format';
import type { Customer, Order } from '@/types';

type CustomerOrder = Pick<Order, 'id' | 'order_number' | 'total' | 'status' | 'created_at'>;

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, business } = await getBusiness();

  const [customerResult, ordersResult] = await Promise.all([
    supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .eq('business_id', business.id)
      .single<Customer>(),
    supabase
      .from('orders')
      .select('id,order_number,total,status,created_at')
      .eq('customer_id', id)
      .eq('business_id', business.id)
      .order('created_at', { ascending: false })
      .returns<CustomerOrder[]>(),
  ]);

  if (customerResult.error || !customerResult.data) {
    notFound();
  }

  const customer = customerResult.data;
  const orders = ordersResult.data ?? [];
  const total = orders.reduce((sum, order) => sum + Number(order.total), 0);
  const wa = createWhatsAppLink(
    customer.whatsapp_number || customer.phone || '',
    `Hi ${customer.name}, thank you for choosing ${business.name}.`,
  );

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-black">{customer.name}</h1>
        <p className="text-sm text-gray-500">
          {orders.length === 1 ? '1 order' : `${orders.length} orders`} · Total spent {formatNaira(total)}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {customer.phone && (
          <a className="btn btn-secondary" href={`tel:${customer.phone}`}>
            Call
          </a>
        )}
        {wa && (
          <a className="btn btn-primary" href={wa} target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
        )}
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <div className="card p-3">
          Orders
          <br />
          <b>{orders.length}</b>
        </div>
        <div className="card p-3">
          Spent
          <br />
          <b>{formatNaira(total)}</b>
        </div>
        <div className="card p-3">
          Last order
          <br />
          <b>{orders[0] ? formatDate(orders[0].created_at) : '—'}</b>
        </div>
      </div>

      <section className="card p-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold">Order history</h2>
          <Link className="btn btn-secondary text-sm" href="/app/orders/new">
            + New Order
          </Link>
        </div>

        {orders.length ? (
          <div className="mt-3 space-y-2">
            {orders.map((order) => (
              <Link
                className="flex flex-col gap-1 rounded-xl border p-3 transition hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between"
                href={`/app/orders/${order.id}`}
                key={order.id}
              >
                <div>
                  <b>{order.order_number}</b>
                  <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
                </div>
                <div className="text-left sm:text-right">
                  <b>{formatNaira(Number(order.total))}</b>
                  <p className="text-sm text-gray-500">{order.status}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-gray-500">No orders have been recorded for this customer yet.</p>
        )}
      </section>

      <CustomerForm c={customer} />

      <form action={deleteCustomer}>
        <input type="hidden" name="id" value={id} />
        <button className="btn bg-red-600 text-white">Delete</button>
      </form>
    </div>
  );
}
