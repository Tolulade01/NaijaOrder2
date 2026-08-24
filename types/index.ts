export type OrderStatus = 'New' | 'Awaiting Payment' | 'Paid' | 'Processing' | 'Ready' | 'Shipped' | 'Delivered' | 'Cancelled';
export type PaymentStatus = 'Unpaid' | 'Partial' | 'Paid';
export type PaymentMethod = 'Bank Transfer' | 'Cash' | 'POS' | 'Other';
export type BusinessPlan = 'free' | 'pro' | 'business';

export type Profile = {
  id: string;
  user_id: string;
  full_name: string;
  phone?: string | null;
  created_at: string;
  updated_at: string;
};

export type Business = {
  id: string;
  owner_id: string;
  name: string;
  category?: string | null;
  phone?: string | null;
  whatsapp_number?: string | null;
  email?: string | null;
  state?: string | null;
  city?: string | null;
  address?: string | null;
  logo_url?: string | null;
  currency: string;
  plan: BusinessPlan;
  plan_started_at: string;
  plan_expires_at?: string | null;
  created_at: string;
  updated_at: string;
};

export type Customer = {
  id: string;
  business_id: string;
  name: string;
  phone?: string | null;
  whatsapp_number?: string | null;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
};

export type Product = {
  id: string;
  business_id: string;
  name: string;
  description?: string | null;
  sku?: string | null;
  price: number;
  image_url?: string | null;
  active: boolean;
  stock_quantity?: number | null;
  created_at: string;
  updated_at: string;
};

export type Order = {
  id: string;
  business_id: string;
  customer_id: string;
  order_number: string;
  status: OrderStatus;
  subtotal: number;
  delivery_fee: number;
  discount: number;
  total: number;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  customers?: Customer | null;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
};

export type BillingPayment = {
  id: string;
  business_id: string;
  tx_ref: string;
  plan: 'pro' | 'business';
  amount: number;
  currency: string;
  status: 'pending' | 'successful' | 'failed' | 'cancelled';
  flutterwave_transaction_id?: number | null;
  created_at: string;
  updated_at: string;
};
