'use client';

import { deleteProduct, saveCustomer, saveProduct } from '@/app/app/actions';
import { FormSubmitButton } from '@/components/FormSubmitButton';
import type { Customer, Product } from '@/types';

type CustomerFormData = Partial<Customer>;
type ProductFormData = Partial<Product>;
type CustomerTextField = Extract<keyof CustomerFormData, 'name' | 'phone' | 'whatsapp_number' | 'email' | 'address' | 'city' | 'state' | 'notes'>;
type ProductInputField = Extract<keyof ProductFormData, 'name' | 'description' | 'sku' | 'price' | 'image_url' | 'stock_quantity'>;

const customerFields: Array<{ name: CustomerTextField; label: string; required?: boolean }> = [
  { name: 'name', label: 'Name', required: true },
  { name: 'phone', label: 'Phone' },
  { name: 'whatsapp_number', label: 'WhatsApp number' },
  { name: 'email', label: 'Email' },
  { name: 'address', label: 'Address' },
  { name: 'city', label: 'City' },
  { name: 'state', label: 'State' },
  { name: 'notes', label: 'Notes' },
];

const productFields: Array<{ name: ProductInputField; label: string; type?: string; required?: boolean }> = [
  { name: 'name', label: 'Name', required: true },
  { name: 'description', label: 'Description' },
  { name: 'sku', label: 'SKU' },
  { name: 'price', label: 'Price', type: 'number', required: true },
  { name: 'image_url', label: 'Image URL' },
  { name: 'stock_quantity', label: 'Stock quantity', type: 'number' },
];

function inputValue(value: string | number | null | undefined) {
  return value ?? '';
}

export function CustomerForm({ c = {} }: { c?: CustomerFormData }) {
  return (
    <form action={saveCustomer} className="card space-y-3 p-4">
      <input type="hidden" name="id" defaultValue={c.id ?? ''} />
      {customerFields.map((field) => (
        <label className="label" key={field.name}>
          {field.label}
          <input className="input" name={field.name} required={field.required} defaultValue={inputValue(c[field.name])} />
        </label>
      ))}
      <FormSubmitButton pendingLabel="Saving Customer...">{c.id ? 'Update Customer' : 'Save Customer'}</FormSubmitButton>
    </form>
  );
}

export function ProductForm({ p = { active: true } }: { p?: ProductFormData }) {
  return (
    <form action={saveProduct} className="card space-y-3 p-4">
      <input type="hidden" name="id" defaultValue={p.id ?? ''} />
      {productFields.map((field) => (
        <label className="label" key={field.name}>
          {field.label}
          <input
            className="input"
            name={field.name}
            type={field.type ?? 'text'}
            step={field.type === 'number' ? '0.01' : undefined}
            required={field.required}
            defaultValue={inputValue(p[field.name])}
          />
        </label>
      ))}
      <label className="flex gap-2">
        <input name="active" type="checkbox" defaultChecked={p.active ?? true} /> Active
      </label>
      <FormSubmitButton pendingLabel={p.id ? 'Updating Product...' : 'Saving Product...'}>
        {p.id ? 'Update Product' : 'Save Product'}
      </FormSubmitButton>
    </form>
  );
}

export function DeleteProductForm({ id }: { id: string }) {
  return (
    <form
      action={deleteProduct}
      className="card mt-4 space-y-3 border-red-200 bg-red-50 p-4"
      onSubmit={(event) => {
        if (!window.confirm('Delete this product? This action cannot be undone.')) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <div>
        <h2 className="font-bold text-red-800">Danger Zone</h2>
        <p className="text-sm text-red-700">
          Deleting a product is permanent. If it is already used in an order, the database may prevent deletion to protect order history.
        </p>
      </div>
      <FormSubmitButton pendingLabel="Deleting Product...">Delete Product</FormSubmitButton>
    </form>
  );
}
