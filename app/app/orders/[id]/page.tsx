import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBusiness } from '@/lib/supabase/data';
import { formatDate, formatNaira } from '@/lib/utils/format';
import { createWhatsAppLink, orderMessage } from '@/lib/whatsapp';
import OrderUpdateForm from '@/components/OrderUpdateForm';
import PrintReceiptButton from '@/components/PrintReceiptButton';
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

  if (orderResult.error || !orderResult.data) notFound();

  const order = orderResult.data;
  const items = itemsResult.data ?? [];
  const customerPhone = order.customers.whatsapp_number || order.customers.phone || '';
  const wa = createWhatsAppLink(
    customerPhone,
    orderMessage(
      order.customers.name,
      order.order_number,
      formatNaira(Number(order.total)),
      order.payment_status,
    ),
  );

  return (
    <div className="space-y-4 print:space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3 print:block">
        <div>
          <p className="hidden text-sm font-semibold text-emerald-700 print:block">{business.name}</p>
          <h1 className="text-3xl font-black">{order.order_number}</h1>
          <p>{order.customers.name} · {formatDate(order.created_at)}</p>
          {customerPhone && <p className="text-sm text-gray-500">Customer phone: {customerPhone}</p>}
        </div>

        <div className="flex flex-wrap gap-2 print:hidden">
          <PrintReceiptButton />
          {wa ? (
            <a className="btn btn-primary" href={wa} target="_blank" rel="noopener noreferrer">Send on WhatsApp</a>
          ) : (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              <p className="font-semibold">WhatsApp unavailable</p>
              <p>No phone number is saved for this customer.</p>
              <Link className="mt-1 inline-block font-semibold underline" href={`/app/customers/${order.customers.id}`}>Add customer phone</Link>
            </div>
          )}
        </div>
      </div>

      <section className="card p-4 print:rounded-none print:border-0 print:shadow-none">
        <h2 className="mb-3 text-xl font-bold">Order Summary</h2>
        {items.length ? (
          items.map((item) => (
            <p className="flex justify-between border-b py-2" key={item.id}>
              <span>{item.product_name} × {item.quantity}</span>
              <b>{formatNaira(Number(item.total_price))}</b>
            </p>
          ))
        ) : (
          <p className="text-sm text-gray-500">No line items found for this order.</p>
        )}
        <div className="mt-3 space-y-1">
          <p>Subtotal: {formatNaira(Number(order.subtotal))}</p>
          <p>Delivery: {formatNaira(Number(order.delivery_fee))}</p>
          <p>Discount: {formatNaira(Number(order.discount))}</p>
          <p className="text-lg font-black">Total: {formatNaira(Number(order.total))}</p>
          <p>Payment: {order.payment_status} · {order.payment_method}</p>
          <p>Status: {order.status}</p>
        </div>
        {order.notes && <p className="mt-4 border-t pt-3 text-sm">Notes: {order.notes}</p>}
      </section>

      <div className="print:hidden">
        <OrderUpdateForm
          id={id}
          status={order.status}
          paymentStatus={order.payment_status}
          paymentMethod={order.payment_method}
          notes={order.notes ?? ''}
        />
      </div>
    </div>
  );
}
