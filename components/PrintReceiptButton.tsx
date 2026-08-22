'use client';

export default function PrintReceiptButton() {
  return (
    <button type="button" className="btn btn-secondary print:hidden" onClick={() => window.print()}>
      Print Receipt
    </button>
  );
}
