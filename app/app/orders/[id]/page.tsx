import { notFound } from 'next/navigation';
import { getBusiness } from '@/lib/supabase/data';
import { updateOrder } from '../../actions';
import { formatDate, formatNaira } from '@/lib/utils/format';
import { createWhatsAppLink, orderMessage } from '@/lib/whatsapp';
import type { Customer, Order, OrderItem } from '@/types';

type OrderWithCustomer = Order & { customers: Customer };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, business } = await getBusiness();
  const [orderResult, itemsResult] = await Promise.all([
    supabase
      .from('orders')
      .select('*,customers(*)')
      .eq('id', id)
      .eq('business_id', business.id)
      .single<OrderWithCustomer>(),
    supabase.from('order_items').select('*').eq('order_id', id).returns<OrderItem[]>(),
  ]);

  if (orderResult.error || !orderResult.data) {
    notFound();
  }

  const order = orderResult.data;
  const items = itemsResult.data ?? [];
  const wa = createWhatsAppLink(
    order.customers.whatsapp_number || order.customers.phone || '',
    orderMessage(order.customers.name, order.order_number, formatNaira(Number(order.total)), order.payment_status),
  );

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-black">{order.order_number}</h1>
      <p>
        {order.customers.name} · {formatDate(order.created_at)}
      </p>
      {wa && (
        <a className="btn btn-primary" href={wa}>
          Send on WhatsApp
        </a>
      )}
      <section className="card p-4">
        {items.length ? (
          items.map((item) => (
            <p className="flex justify-between border-b py-2" key={item.id}>
              <span>
                {item.product_name} × {item.quantity}
              </span>
              <b>{formatNaira(Number(item.total_price))}</b>
            </p>
          ))
        ) : (
          <p className="text-sm text-gray-500">No line items found for this order.</p>
        )}
        <p>Subtotal: {formatNaira(Number(order.subtotal))}</p>
        <p>Delivery: {formatNaira(Number(order.delivery_fee))}</p>
        <p>Discount: {formatNaira(Number(order.discount))}</p>
        <b>Total: {formatNaira(Number(order.total))}</b>
      </section>
      <form action={updateOrder} className="card space-y-3 p-4">
        <input type="hidden" name="id" value={id} />
        <select className="input" name="status" defaultValue={order.status}>
          {['New', 'Awaiting Payment', 'Paid', 'Processing', 'Ready', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>
        <select className="input" name="payment_status" defaultValue={order.payment_status}>
          {['Unpaid', 'Partial', 'Paid'].map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>
        <select className="input" name="payment_method" defaultValue={order.payment_method}>
          {['Bank Transfer', 'Cash', 'POS', 'Other'].map((method) => (
            <option key={method}>{method}</option>
          ))}
        </select>
        <textarea className="input" name="notes" defaultValue={order.notes ?? ''} />
        <button className="btn btn-secondary">Update Status / Payment</button>
      </form>
    </div>
  );
}
