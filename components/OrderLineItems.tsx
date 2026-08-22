'use client';

import { useState } from 'react';
import type { Customer, Product } from '@/types';

type OrderLine = {
  productId: string;
  quantity: number;
};

export default function OrderLineItems({ products }: { products: Product[] }) {
  const [lines, setLines] = useState<OrderLine[]>([{ productId: products[0]?.id ?? '', quantity: 1 }]);

  function updateLine(index: number, field: keyof OrderLine, value: string) {
    setLines((current) =>
      current.map((line, lineIndex) =>
        lineIndex === index
          ? { ...line, [field]: field === 'quantity' ? Math.max(1, Number(value) || 1) : value }
          : line,
      ),
    );
  }

  function addLine() {
    setLines((current) => [...current, { productId: '', quantity: 1 }]);
  }

  function removeLine(index: number) {
    setLines((current) => current.filter((_, lineIndex) => lineIndex !== index));
  }

  if (!products.length) {
    return <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">No active products available. Add a product first.</p>;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <span className="font-semibold">Products</span>
        <button type="button" className="btn btn-secondary text-sm" onClick={addLine}>
          + Add product
        </button>
      </div>

      {lines.map((line, index) => {
        const selectedIds = new Set(lines.filter((_, lineIndex) => lineIndex !== index).map((item) => item.productId));
        return (
          <div className="grid gap-2 rounded-xl border p-3 md:grid-cols-[1fr_180px_auto]" key={`${index}-${line.productId}`}>
            <label className="label">
              Product {index + 1}
              <select
                className="input"
                name="product_id"
                value={line.productId}
                onChange={(event) => updateLine(index, 'productId', event.target.value)}
                required
              >
                <option value="" disabled>Select a product</option>
                {products.map((product) => {
                  const stock = product.stock_quantity == null ? 'Stock not tracked' : `${product.stock_quantity} in stock`;
                  return (
                    <option value={product.id} key={product.id} disabled={selectedIds.has(product.id)}>
                      {product.name} — ₦{product.price} · {stock}
                    </option>
                  );
                })}
              </select>
            </label>

            <label className="label">
              Quantity
              <input
                className="input"
                name="quantity"
                type="number"
                min="1"
                value={line.quantity}
                onChange={(event) => updateLine(index, 'quantity', event.target.value)}
                required
              />
            </label>

            <div className="flex items-end">
              {lines.length > 1 && (
                <button type="button" className="btn btn-secondary w-full md:w-auto" onClick={() => removeLine(index)}>
                  Remove
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function CustomerSelector({ customers }: { customers: Customer[] }) {
  const [customerId, setCustomerId] = useState('');
  const existingCustomer = Boolean(customerId);

  return (
    <>
      <label className="label">
        Existing customer
        <select className="input" name="customer_id" value={customerId} onChange={(event) => setCustomerId(event.target.value)}>
          <option value="">Add new below</option>
          {customers.map((customer) => (
            <option value={customer.id} key={customer.id}>
              {customer.name}{customer.phone ? ` — ${customer.phone}` : ''}
            </option>
          ))}
        </select>
      </label>

      <div className="grid gap-2 md:grid-cols-2">
        <label className="label">
          New customer name
          <input
            className="input disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
            name="customer_name"
            placeholder="Customer name"
            disabled={existingCustomer}
          />
        </label>
        <label className="label">
          New customer phone
          <input
            className="input disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
            name="customer_phone"
            placeholder="Phone number"
            disabled={existingCustomer}
          />
        </label>
      </div>

      {existingCustomer && <p className="text-xs text-gray-500">Existing customer selected. New customer fields are disabled.</p>}
    </>
  );
}
