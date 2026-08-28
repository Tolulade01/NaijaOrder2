-- Atomic monthly order quotas.
-- Counts orders created during a calendar month and never decrements when an order is deleted.
-- This closes the delete-and-recreate quota loophole and prevents concurrent requests
-- from creating more orders than the plan allows.

create table if not exists public.monthly_order_usage (
  business_id uuid not null references public.businesses(id) on delete cascade,
  month_start date not null,
  orders_created integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (business_id, month_start),
  check (orders_created >= 0)
);

alter table public.monthly_order_usage enable row level security;

-- Business owners may read their own usage. Writes are performed by the trigger below.
drop policy if exists "Owners can view their monthly order usage" on public.monthly_order_usage;
create policy "Owners can view their monthly order usage"
on public.monthly_order_usage
for select
to public
using (
  exists (
    select 1
    from public.businesses b
    where b.id = monthly_order_usage.business_id
      and b.owner_id = auth.uid()
  )
);

-- Backfill the current month's already-created orders so existing customers keep
-- their true usage when this migration is installed.
insert into public.monthly_order_usage (business_id, month_start, orders_created)
select
  o.business_id,
  date_trunc('month', o.created_at at time zone 'UTC')::date,
  count(*)::integer
from public.orders o
group by o.business_id, date_trunc('month', o.created_at at time zone 'UTC')::date
on conflict (business_id, month_start)
do update set
  orders_created = excluded.orders_created,
  updated_at = now();

create or replace function public.enforce_monthly_order_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_month date := date_trunc('month', coalesce(new.created_at, now()) at time zone 'UTC')::date;
  v_plan text;
  v_expires timestamptz;
  v_limit integer;
  v_used integer;
begin
  select b.plan, b.plan_expires_at
    into v_plan, v_expires
  from public.businesses b
  where b.id = new.business_id
  for update;

  if not found then
    raise exception 'Business not found.' using errcode = '23503';
  end if;

  -- Expired paid subscriptions are treated as Free, matching the application logic.
  if v_plan is null then
    v_plan := 'free';
  elsif v_plan <> 'free' and v_expires is not null and v_expires <= now() then
    v_plan := 'free';
  end if;

  v_limit := case v_plan
    when 'free' then 25
    when 'pro' then 100
    else null
  end;

  -- Business has no monthly order limit.
  if v_limit is null then
    return new;
  end if;

  insert into public.monthly_order_usage (business_id, month_start, orders_created)
  values (new.business_id, v_month, 0)
  on conflict (business_id, month_start) do nothing;

  select orders_created
    into v_used
  from public.monthly_order_usage
  where business_id = new.business_id
    and month_start = v_month
  for update;

  if v_used >= v_limit then
    raise exception 'Monthly order limit reached. Please upgrade your plan.'
      using errcode = 'P0001';
  end if;

  update public.monthly_order_usage
  set orders_created = orders_created + 1,
      updated_at = now()
  where business_id = new.business_id
    and month_start = v_month;

  return new;
end;
$$;

drop trigger if exists orders_enforce_monthly_order_limit on public.orders;
create trigger orders_enforce_monthly_order_limit
before insert on public.orders
for each row
execute function public.enforce_monthly_order_limit();

revoke all on function public.enforce_monthly_order_limit() from public;
revoke all on function public.enforce_monthly_order_limit() from anon;
revoke all on function public.enforce_monthly_order_limit() from authenticated;
