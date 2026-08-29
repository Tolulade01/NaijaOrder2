-- Keep monthly usage aligned with Nigeria calendar months (Africa/Lagos).
-- Business remains unlimited, but its usage counter is still recorded so the UI
-- has one consistent source of truth across all plans.

create or replace function public.enforce_monthly_order_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_month date := date_trunc('month', coalesce(new.created_at, now()) at time zone 'Africa/Lagos')::date;
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

  -- Expired paid subscriptions are treated as Free, matching application logic.
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

  -- Every plan gets a persistent monthly usage counter. Business has no limit,
  -- but its usage is still recorded so all UI surfaces use the same data source.
  insert into public.monthly_order_usage (business_id, month_start, orders_created)
  values (new.business_id, v_month, 0)
  on conflict (business_id, month_start) do nothing;

  select orders_created
    into v_used
  from public.monthly_order_usage
  where business_id = new.business_id
    and month_start = v_month
  for update;

  if v_limit is not null and v_used >= v_limit then
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

-- Backfill/rebuild monthly usage using Nigeria calendar months. This also fixes
-- Business accounts whose counter previously did not increment.
truncate table public.monthly_order_usage;

insert into public.monthly_order_usage (business_id, month_start, orders_created)
select
  o.business_id,
  date_trunc('month', o.created_at at time zone 'Africa/Lagos')::date,
  count(*)::integer
from public.orders o
group by o.business_id, date_trunc('month', o.created_at at time zone 'Africa/Lagos')::date;
