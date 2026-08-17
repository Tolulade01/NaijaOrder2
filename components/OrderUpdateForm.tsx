'use client';

import { useFormStatus } from 'react-dom';
import { deleteOrder, updateOrder } from '@/app/app/actions';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button className="btn btn-secondary" disabled={pending} type="submit">
      {pending ? 'Updating Order...' : 'Update Order'}
    </button>
  );
}

function DeleteButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="btn border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
      disabled={pending}
      type="submit"
    >
      {pending ? 'Deleting Order...' : 'Delete Order'}
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
    <div className="space-y-4">
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

      <div className="card flex flex-wrap items-center justify-between gap-3 border-red-100 p-4">
        <div>
          <h2 className="font-bold text-red-700">Danger Zone</h2>
          <p className="text-sm text-gray-500">Deleting an order permanently removes the order and its line items.</p>
        </div>
        <form
          action={deleteOrder}
          onSubmit={(event) => {
            if (!window.confirm('Delete this order permanently? This action cannot be undone.')) {
              event.preventDefault();
            }
          }}
        >
          <input type="hidden" name="id" value={id} />
          <DeleteButton />
        </form>
      </div>
    </div>
  );
}
