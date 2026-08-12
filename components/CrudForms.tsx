import { saveCustomer, saveProduct } from '@/app/app/actions';
import type { Customer, Product } from '@/types';

type CustomerFormData = Partial<Customer>;
type ProductFormData = Partial<Product>;

const customerFields: Array<{ name: keyof CustomerFormData; label: string; required?: boolean }> = [
  { name: 'name', label: 'Name', required: true },
  { name: 'phone', label: 'Phone' },
  { name: 'whatsapp_number', label: 'WhatsApp number' },
  { name: 'email', label: 'Email' },
  { name: 'address', label: 'Address' },
  { name: 'city', label: 'City' },
  { name: 'state', label: 'State' },
  { name: 'notes', label: 'Notes' },
];

const productFields: Array<{ name: keyof ProductFormData; label: string; type?: string; required?: boolean }> = [
  { name: 'name', label: 'Name', required: true },
  { name: 'description', label: 'Description' },
  { name: 'sku', label: 'SKU' },
  { name: 'price', label: 'Price', type: 'number', required: true },
  { name: 'image_url', label: 'Image URL' },
  { name: 'stock_quantity', label: 'Stock quantity', type: 'number' },
];

export function CustomerForm({ c = {} }: { c?: CustomerFormData }) {
  return (
    <form action={saveCustomer} className="card space-y-3 p-4">
      <input type="hidden" name="id" defaultValue={c.id ?? ''} />
      {customerFields.map((field) => (
        <label className="label" key={field.name}>
          {field.label}
          <input className="input" name={field.name} required={field.required} defaultValue={c[field.name] ?? ''} />
        </label>
      ))}
      <button className="btn btn-primary">Save Customer</button>
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
            defaultValue={p[field.name] ?? ''}
          />
        </label>
      ))}
      <label className="flex gap-2">
        <input name="active" type="checkbox" defaultChecked={p.active ?? true} /> Active
      </label>
      <button className="btn btn-primary">Save Product</button>
    </form>
  );
}
