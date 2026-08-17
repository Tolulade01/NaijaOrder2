'use client';

import { useFormStatus } from 'react-dom';
import { updateOrder } from '@/app/app/actions';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button className="btn btn-secondary" disabled={pending} type="submit">
      {pending ? 'Updating Order...' : 'Update Order'}
    </button>
  );
}

export default function OrderUpdateForm({
  id,
  status,
  paymentStatus,
  paymentMethod,
  notes,
}: {
  id: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  notes: string;
}) {
  return (
    <form action={updateOrder} className="card space-y-3 p-4">
      <input type="hidden" name="id" value={id} />
      <select className="input" name="status" defaultValue={status}>
        {['New', 'Awaiting Payment', 'Paid', 'Processing', 'Ready', 'Shipped', 'Delivered', 'Cancelled'].map((value) => (
          <option key={value}>{value}</option>
        ))}
      </select>
      <select className="input" name="payment_status" defaultValue={paymentStatus}>
        {['Unpaid', 'Partial', 'Paid'].map((value) => (
          <option key={value}>{value}</option>
        ))}
      </select>
      <select className="input" name="payment_method" defaultValue={paymentMethod}>
        {['Bank Transfer', 'Cash', 'POS', 'Other'].map((value) => (
          <option key={value}>{value}</option>
        ))}
      </select>
      <textarea className="input" name="notes" defaultValue={notes} />
      <SubmitButton />
    </form>
  );
}
