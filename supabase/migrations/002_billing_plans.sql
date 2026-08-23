alter table businesses
  add column if not exists plan text not null default 'free'
  check (plan in ('free', 'pro', 'business'));

alter table businesses
  add column if not exists plan_started_at timestamptz not null default now();

create index if not exists orders_business_created_at_idx
  on orders(business_id, created_at);
