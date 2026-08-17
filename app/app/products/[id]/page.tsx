import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBusiness } from '@/lib/supabase/data';
import { DeleteProductForm, ProductForm } from '@/components/CrudForms';
import type { Product } from '@/types';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, business } = await getBusiness();
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .eq('business_id', business.id)
    .single<Product>();

  if (error || !product) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link className="text-sm font-semibold text-gray-500 hover:text-gray-900" href="/app/products">
            ← Back to Products
          </Link>
          <h1 className="mt-1 text-3xl font-black">Edit Product</h1>
          <p className="text-gray-500">Update the product details or remove this product.</p>
        </div>
      </div>

      <ProductForm p={product} />
      <DeleteProductForm id={product.id} />
    </div>
  );
}
