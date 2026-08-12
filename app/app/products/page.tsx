import Link from 'next/link';
import { getBusiness } from '@/lib/supabase/data';
import { formatNaira } from '@/lib/utils/format';
import type { Product } from '@/types';

export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = '' } = await searchParams;
  const { supabase, business } = await getBusiness();
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('business_id', business.id)
    .order('created_at', { ascending: false })
    .returns<Product[]>();
  const products = (data ?? []).filter((product) => product.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-3xl font-black">Products</h1>
        <Link className="btn btn-primary" href="/app/products/new">
          + Product
        </Link>
      </div>
      <form className="my-4">
        <input className="input" name="q" placeholder="Search products" defaultValue={q} />
      </form>
      <div className="space-y-3">
        {products.map((product) => (
          <Link className="card block p-4" href={`/app/products/${product.id}`} key={product.id}>
            <b>{product.name}</b>
            <p>
              {formatNaira(Number(product.price))} · {product.active ? 'Active' : 'Inactive'}
            </p>
          </Link>
        ))}
        {!products.length && <p className="card p-4">No products found.</p>}
      </div>
    </div>
  );
}
