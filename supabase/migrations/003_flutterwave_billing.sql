alter table businesses
  add column if not exists plan_expires_at timestamptz;

create table if not exists billing_payments (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  tx_ref text not null unique,
  plan text not null check (plan in ('pro', 'business')),
  amount numeric(12,2) not null check (amount > 0),
  currency text not null default 'NGN',
  status text not null default 'pending' check (status in ('pending', 'successful', 'failed', 'cancelled')),
  flutterwave_transaction_id bigint,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists billing_payments_business_created_idx
  on billing_payments(business_id, created_at desc);

create index if not exists billing_payments_tx_ref_idx
  on billing_payments(tx_ref);

alter table billing_payments enable row level security;

create policy "Owners can view their billing payments"
  on billing_payments
  for select
  using (
    exists (
      select 1 from businesses
      where businesses.id = billing_payments.business_id
        and businesses.owner_id = auth.uid()
    )
  );
