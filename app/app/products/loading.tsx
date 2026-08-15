export default function Loading() {
  return (
    <div className="space-y-6" aria-live="polite" aria-busy="true">
      <div className="flex items-center justify-between">
        <div className="h-9 w-48 animate-pulse rounded-lg bg-gray-200" />
        <div className="h-10 w-32 animate-pulse rounded-lg bg-gray-200" />
      </div>
      <div className="card space-y-3 p-4">
        {[1, 2, 3, 4, 5].map((item) => <div className="h-12 animate-pulse rounded bg-gray-100" key={item} />)}
      </div>
      <p className="text-center text-sm text-gray-500">Loading products...</p>
    </div>
  );
}
