import { notFound } from 'next/navigation';
import { getBusiness } from '@/lib/supabase/data';
import { CustomerForm } from '@/components/CrudForms';
import { deleteCustomer } from '../../actions';
import { createWhatsAppLink } from '@/lib/whatsapp';
import { formatNaira, formatDate } from '@/lib/utils/format';
import type { Customer, Order } from '@/types';

type CustomerOrder = Pick<Order, 'id' | 'total' | 'created_at'>;

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
      .select('id,total,created_at')
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
      <h1 className="text-3xl font-black">{customer.name}</h1>
      <div className="flex gap-2">
        {customer.phone && (
          <a className="btn btn-secondary" href={`tel:${customer.phone}`}>
            Call
          </a>
        )}
        {wa && (
          <a className="btn btn-primary" href={wa}>
            WhatsApp
          </a>
        )}
      </div>
      <div className="grid grid-cols-3 gap-2">
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
          Last
          <br />
          <b>{orders[0] ? formatDate(orders[0].created_at) : '—'}</b>
        </div>
      </div>
      <section className="card p-4">
        <h2 className="font-bold">Order history</h2>
        {orders.length ? (
          <div className="mt-3 space-y-2">
            {orders.map((order) => (
              <p className="flex justify-between border-b py-2 last:border-0" key={order.id}>
                <span>{formatDate(order.created_at)}</span>
                <b>{formatNaira(Number(order.total))}</b>
              </p>
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
