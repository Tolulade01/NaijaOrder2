export default function Loading() {
  return (
    <div className="space-y-6" aria-live="polite" aria-busy="true">
      <div className="h-9 w-48 animate-pulse rounded-lg bg-gray-200" />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div className="card space-y-3 p-4" key={item}>
            <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
            <div className="h-8 w-20 animate-pulse rounded bg-gray-200" />
          </div>
        ))}
      </div>
      <div className="card space-y-4 p-4">
        <div className="h-6 w-40 animate-pulse rounded bg-gray-200" />
        {[1, 2, 3, 4].map((item) => (
          <div className="h-12 animate-pulse rounded bg-gray-100" key={item} />
        ))}
      </div>
      <p className="text-center text-sm text-gray-500">Loading your workspace...</p>
    </div>
  );
}
