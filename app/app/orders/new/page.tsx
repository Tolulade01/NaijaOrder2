import { getBusiness } from '@/lib/supabase/data';
import { createOrder } from '../../actions';
import { FormSubmitButton } from '@/components/FormSubmitButton';
import OrderLineItems, { CustomerSelector } from '@/components/OrderLineItems';
import type { Customer, Product } from '@/types';

export default async function Page({ searchParams }: { searchParams?: Promise<{ error?: string }> }) {
  const { supabase, business } = await getBusiness();
  const [customersResult, productsResult] = await Promise.all([
    supabase.from('customers').select('*').eq('business_id', business.id).returns<Customer[]>(),
    supabase.from('products').select('*').eq('business_id', business.id).eq('active', true).returns<Product[]>(),
  ]);
  const customers = customersResult.data ?? [];
  const products = productsResult.data ?? [];
  const params = searchParams ? await searchParams : {};
  const error = params.error ? decodeURIComponent(params.error) : '';

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700" role="alert">
          {error}
        </div>
      )}

      <form action={createOrder} className="card space-y-4 p-4">
        <h1 className="text-3xl font-black">New Order</h1>

        <CustomerSelector customers={customers} />

        <OrderLineItems products={products} />

        <div className="grid gap-2 md:grid-cols-2">
          <label className="label">
            Delivery fee (₦)
            <input className="input" name="delivery_fee" type="number" min="0" placeholder="0" defaultValue="0" />
          </label>
          <label className="label">
            Discount (₦)
            <input className="input" name="discount" type="number" min="0" placeholder="0" defaultValue="0" />
          </label>
        </div>

        <label className="label">
          Payment status
          <select className="input" name="payment_status">
            {['Unpaid', 'Partial', 'Paid'].map((status) => <option key={status}>{status}</option>)}
          </select>
        </label>

        <label className="label">
          Payment method
          <select className="input" name="payment_method">
            {['Bank Transfer', 'Cash', 'POS', 'Other'].map((method) => <option key={method}>{method}</option>)}
          </select>
        </label>

        <label className="label">
          Order status
          <select className="input" name="status">
            {['New', 'Awaiting Payment', 'Paid', 'Processing', 'Ready', 'Shipped', 'Delivered', 'Cancelled'].map((status) => <option key={status}>{status}</option>)}
          </select>
        </label>

        <label className="label">
          Notes
          <textarea className="input" name="notes" placeholder="Add delivery instructions or other notes" />
        </label>

        <FormSubmitButton pendingLabel="Creating Order...">Create Order</FormSubmitButton>
      </form>
    </div>
  );
}
