import { getBusiness } from '@/lib/supabase/data';
import { createOrder } from '../../actions';
import type { Customer, Product } from '@/types';

export default async function Page() {
  const { supabase, business } = await getBusiness();
  const [customersResult, productsResult] = await Promise.all([
    supabase.from('customers').select('*').eq('business_id', business.id).returns<Customer[]>(),
    supabase.from('products').select('*').eq('business_id', business.id).eq('active', true).returns<Product[]>(),
  ]);
  const customers = customersResult.data ?? [];
  const products = productsResult.data ?? [];

  return (
    <form action={createOrder} className="card space-y-4 p-4">
      <h1 className="text-3xl font-black">New Order</h1>
      <label className="label">
        Existing customer
        <select className="input" name="customer_id">
          <option value="">Add new below</option>
          {customers.map((customer) => (
            <option value={customer.id} key={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>
      </label>
      <div className="grid gap-2 md:grid-cols-2">
        <input className="input" name="customer_name" placeholder="New customer name" />
        <input className="input" name="customer_phone" placeholder="New customer phone" />
      </div>
      <label className="label">
        Product
        <select className="input" name="product_id" required>
          {products.map((product) => (
            <option value={product.id} key={product.id}>
              {product.name} — ₦{product.price}
            </option>
          ))}
        </select>
      </label>
      <label className="label">
        Quantity
        <input className="input" name="quantity" type="number" defaultValue="1" min="1" required />
      </label>
      <div className="grid gap-2 md:grid-cols-2">
        <input className="input" name="delivery_fee" type="number" placeholder="Delivery fee" defaultValue="0" />
        <input className="input" name="discount" type="number" placeholder="Discount" defaultValue="0" />
      </div>
      <select className="input" name="payment_status">
        {['Unpaid', 'Partial', 'Paid'].map((status) => (
          <option key={status}>{status}</option>
        ))}
      </select>
      <select className="input" name="payment_method">
        {['Bank Transfer', 'Cash', 'POS', 'Other'].map((method) => (
          <option key={method}>{method}</option>
        ))}
      </select>
      <select className="input" name="status">
        {['New', 'Awaiting Payment', 'Paid', 'Processing', 'Ready', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
          <option key={status}>{status}</option>
        ))}
      </select>
      <textarea className="input" name="notes" placeholder="Notes" />
      <button className="btn btn-primary">Create Order</button>
    </form>
  );
}
