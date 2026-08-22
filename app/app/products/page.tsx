import Link from 'next/link';
import { getBusiness } from '@/lib/supabase/data';
import { formatNaira } from '@/lib/utils/format';
import type { Product } from '@/types';

export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = '' } = await searchParams;
  const { supabase, business } = await getBusiness();
  const { data } = await supabase.from('products').select('*').eq('business_id', business.id).order('created_at', { ascending: false }).returns<Product[]>();
  const products = (data ?? []).filter((product) => product.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <div className="flex flex-wrap justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black">Products</h1>
          <p className="mt-1 text-sm text-gray-500">Manage products, prices and stock.</p>
        </div>
        <Link className="btn btn-primary" href="/app/products/new">+ Product</Link>
      </div>
      <form className="my-4"><input className="input" name="q" placeholder="Search products" defaultValue={q} /></form>
      <div className="space-y-3">
        {products.map((product) => {
          const stock = product.stock_quantity == null ? null : Number(product.stock_quantity);
          const stockLabel = stock == null ? 'Stock not tracked' : stock === 0 ? 'Out of stock' : `${stock} in stock`;
          const stockClass = stock == null ? 'bg-gray-100 text-gray-600' : stock === 0 ? 'bg-red-100 text-red-700' : stock <= 5 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-700';
          return (
            <Link className="card block p-4 transition hover:-translate-y-0.5" href={`/app/products/${product.id}`} key={product.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <b className="text-lg">{product.name}</b>
                  <p className="text-sm text-gray-500">{formatNaira(Number(product.price))} · {product.active ? 'Active' : 'Inactive'}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${stockClass}`}>{stockLabel}</span>
              </div>
            </Link>
          );
        })}
        {!products.length && <p className="card p-4">No products found.</p>}
      </div>
    </div>
  );
}
