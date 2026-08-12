import { notFound } from 'next/navigation';
import { getBusiness } from '@/lib/supabase/data';
import { ProductForm } from '@/components/CrudForms';
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
    <>
      <h1 className="mb-4 text-3xl font-black">Edit Product</h1>
      <ProductForm p={product} />
    </>
  );
}
