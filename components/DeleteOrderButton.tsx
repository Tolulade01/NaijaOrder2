'use client';

import { deleteOrder } from '@/app/app/actions';
import { useFormStatus } from 'react-dom';

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

export default function DeleteOrderButton({ id }: { id: string }) {
  return (
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
  );
}
