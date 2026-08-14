'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getBusiness, nextOrderNumber } from '@/lib/supabase/data';
import type { Product } from '@/types';

const val = (form: FormData, key: string) => String(form.get(key) || '');
const msg = (value: string) => encodeURIComponent(value);

export async function saveCustomer(form: FormData) {
  const { supabase, business } = await getBusiness();
  const id = val(form, 'id');
  const row = {
    business_id: business.id,
    name: val(form, 'name'),
    phone: val(form, 'phone'),
    whatsapp_number: val(form, 'whatsapp_number'),
    email: val(form, 'email'),
    address: val(form, 'address'),
    city: val(form, 'city'),
    state: val(form, 'state'),
    notes: val(form, 'notes'),
  };

  const result = id
    ? await supabase.from('customers').update(row).eq('id', id).eq('business_id', business.id)
    : await supabase.from('customers').insert(row);

  if (result.error) redirect(`/app/customers${id ? `/${id}` : ''}?error=${msg(result.error.message)}`);

  revalidatePath('/app/customers');
  redirect(`/app/customers?success=${msg(id ? 'Customer updated successfully.' : 'Customer added successfully.')}`);
}

export async function deleteCustomer(form: FormData) {
  const { supabase, business } = await getBusiness();
  const id = val(form, 'id');
  const { error } = await supabase.from('customers').delete().eq('id', id).eq('business_id', business.id);
  if (error) redirect(`/app/customers?error=${msg(error.message)}`);
  revalidatePath('/app/customers');
  redirect(`/app/customers?success=${msg('Customer deleted successfully.')}`);
}

export async function saveProduct(form: FormData) {
  const { supabase, business } = await getBusiness();
  const id = val(form, 'id');
  const row = {
    business_id: business.id,
    name: val(form, 'name'),
    description: val(form, 'description'),
    sku: val(form, 'sku'),
    price: Number(val(form, 'price')),
    image_url: val(form, 'image_url'),
    active: form.get('active') === 'on',
    stock_quantity: Number(val(form, 'stock_quantity') || 0),
  };

  const result = id
    ? await supabase.from('products').update(row).eq('id', id).eq('business_id', business.id)
    : await supabase.from('products').insert(row);

  if (result.error) redirect(`/app/products${id ? `/${id}` : ''}?error=${msg(result.error.message)}`);
  revalidatePath('/app/products');
  redirect(`/app/products?success=${msg(id ? 'Product updated successfully.' : 'Product added successfully.')}`);
}

export async function createOrder(form: FormData) {
  const { supabase, business } = await getBusiness();

  try {
    let customerId = val(form, 'customer_id');

    if (!customerId) {
      const { data: customer, error } = await supabase
        .from('customers')
        .insert({
          business_id: business.id,
          name: val(form, 'customer_name'),
          phone: val(form, 'customer_phone'),
          whatsapp_number: val(form, 'customer_phone'),
        })
        .select('id')
        .single<{ id: string }>();

      if (error || !customer) throw new Error(error?.message || 'Unable to create customer for this order.');
      customerId = customer.id;
    }

    const productIds = form.getAll('product_id').map(String).filter(Boolean);
    const quantities = form.getAll('quantity').map((quantity) => Number(quantity) || 1);
    let subtotal = 0;
    const items: Array<{
      product_id: string;
      product_name: string;
      quantity: number;
      unit_price: number;
      total_price: number;
    }> = [];

    for (let index = 0; index < productIds.length; index += 1) {
      const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productIds[index])
        .eq('business_id', business.id)
        .single<Product>();

      if (error || !product) throw new Error(error?.message || 'One or more selected products could not be found.');

      const quantity = quantities[index] || 1;
      const unitPrice = Number(product.price);
      const totalPrice = unitPrice * quantity;
      subtotal += totalPrice;
      items.push({ product_id: product.id, product_name: product.name, quantity, unit_price: unitPrice, total_price: totalPrice });
    }

    if (!items.length) throw new Error('Add at least one product to create an order.');

    const deliveryFee = Number(val(form, 'delivery_fee') || 0);
    const discount = Number(val(form, 'discount') || 0);
    const total = subtotal + deliveryFee - discount;
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        business_id: business.id,
        customer_id: customerId,
        order_number: await nextOrderNumber(supabase, business.id),
        status: val(form, 'status') || 'New',
        subtotal,
        delivery_fee: deliveryFee,
        discount,
        total,
        payment_status: val(form, 'payment_status') || 'Unpaid',
        payment_method: val(form, 'payment_method') || 'Bank Transfer',
        notes: val(form, 'notes'),
      })
      .select('id')
      .single<{ id: string }>();

    if (error || !order) throw new Error(error?.message || 'Unable to create order.');

    const { error: itemError } = await supabase.from('order_items').insert(items.map((item) => ({ ...item, order_id: order.id })));
    if (itemError) throw new Error(itemError.message);

    revalidatePath('/app/orders');
    revalidatePath('/app/dashboard');
    redirect(`/app/orders/${order.id}?success=${msg('Order created successfully.')}`);
  } catch (error) {
    redirect(`/app/orders/new?error=${msg(error instanceof Error ? error.message : 'Unable to create order. Please try again.')}`);
  }
}

export async function updateOrder(form: FormData) {
  const { supabase, business } = await getBusiness();
  const id = val(form, 'id');
  const { data, error } = await supabase
    .from('orders')
    .update({
      status: val(form, 'status'),
      payment_status: val(form, 'payment_status'),
      payment_method: val(form, 'payment_method'),
      notes: val(form, 'notes'),
    })
    .eq('id', id)
    .eq('business_id', business.id)
    .select('id')
    .maybeSingle<{ id: string }>();

  if (error || !data) {
    redirect(`/app/orders/${id}?error=${msg(error?.message || 'Order could not be updated. Please try again.')}`);
  }

  revalidatePath(`/app/orders/${id}`);
  revalidatePath('/app/orders');
  revalidatePath('/app/dashboard');
  redirect(`/app/orders/${id}?success=${msg('Order updated successfully.')}`);
}

export async function saveSettings(form: FormData) {
  const { supabase, business, user } = await getBusiness();
  const { error: businessError } = await supabase
    .from('businesses')
    .update({
      name: val(form, 'name'),
      category: val(form, 'category'),
      phone: val(form, 'phone'),
      whatsapp_number: val(form, 'whatsapp_number'),
      email: val(form, 'email'),
      address: val(form, 'address'),
      state: val(form, 'state'),
      city: val(form, 'city'),
      logo_url: val(form, 'logo_url'),
      currency: 'NGN',
    })
    .eq('id', business.id);

  if (businessError) redirect(`/app/settings?error=${msg(businessError.message)}`);

  const { error: profileError } = await supabase
    .from('profiles')
    .upsert(
      { user_id: user.id, full_name: val(form, 'full_name') },
      { onConflict: 'user_id' },
    );
  if (profileError) redirect(`/app/settings?error=${msg(profileError.message)}`);

  revalidatePath('/app/settings');
  revalidatePath('/app/dashboard');
  redirect(`/app/settings?success=${msg('Settings saved successfully.')}`);
}
