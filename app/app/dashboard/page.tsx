import Link from 'next/link';
import { getBusiness } from '@/lib/supabase/data';
import { formatDate, formatNaira } from '@/lib/utils/format';
import type { Customer, Order } from '@/types';

type RecentOrder = Order & {
  customers: Pick<Customer, 'name'> | null;
};

export default async function Dashboard() {
  const { supabase, business } = await getBusiness();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayISO = today.toISOString();

  const [
    recentOrdersResult,
    customerCountResult,
    totalOrdersResult,
    todayOrdersResult,
    pendingOrdersResult,
  ] = await Promise.all([
    // Recent orders
    supabase
      .from('orders')
      .select('*,customers(name)')
      .eq('business_id', business.id)
      .order('created_at', { ascending: false })
      .limit(6)
      .returns<RecentOrder[]>(),

    // Total customers
    supabase
      .from('customers')
      .select('id', { count: 'exact', head: true })
      .eq('business_id', business.id),

    // Total orders
    supabase
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .eq('business_id', business.id),

    // Orders created today
    supabase
      .from('orders')
      .select('total')
      .eq('business_id', business.id)
      .gte('created_at', todayISO),

    // Pending orders
    supabase
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .eq('business_id', business.id)
      .neq('status', 'Delivered')
      .neq('status', 'Cancelled'),
  ]);

  const orders = recentOrdersResult.data ?? [];
  const customerCount = customerCountResult.count ?? 0;
  const totalOrderCount = totalOrdersResult.count ?? 0;
  const pendingCount = pendingOrdersResult.count ?? 0;

  const todaysSales = (todayOrdersResult.data ?? []).reduce(
    (sum, order) => sum + Number(order.total ?? 0),
    0
  );

  const statusCounts = {
    Pending: 0,
    Confirmed: 0,
    Processing: 0,
    Delivered: 0,
    Cancelled: 0,
  };

  orders.forEach((order) => {
    if (order.status in statusCounts) {
      statusCounts[order.status as keyof typeof statusCounts]++;
    }
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-emerald-700">
            Welcome back
          </p>

          <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Here&apos;s what&apos;s happening with your business today.
          </p>
        </div>

        <Link
          href="/app/orders/new"
          className="btn btn-primary inline-flex w-fit items-center gap-2"
        >
          <span className="text-lg">+</span>
          New Order
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="card p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Today&apos;s Sales
              </p>

              <p className="mt-2 text-2xl font-black text-slate-900">
                {formatNaira(todaysSales)}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-xl">
              ₦
            </div>
          </div>

          <p className="mt-4 text-xs text-slate-500">
            Sales recorded today
          </p>
        </div>

        <div className="card p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Orders
              </p>

              <p className="mt-2 text-2xl font-black text-slate-900">
                {totalOrderCount}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-xl">
              🛍️
            </div>
          </div>

          <p className="mt-4 text-xs text-slate-500">
            All orders in your business
          </p>
        </div>

        <div className="card p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Pending Orders
              </p>

              <p className="mt-2 text-2xl font-black text-slate-900">
                {pendingCount}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-xl">
              ⏳
            </div>
          </div>

          <p className="mt-4 text-xs text-slate-500">
            Orders needing attention
          </p>
        </div>

        <div className="card p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Customers
              </p>

              <p className="mt-2 text-2xl font-black text-slate-900">
                {customerCount}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-xl">
              👥
            </div>
          </div>

          <p className="mt-4 text-xs text-slate-500">
            Customers in your database
          </p>
        </div>
      </div>

      {/* Quick actions */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-900">
            Quick Actions
          </h2>

          <p className="text-sm text-slate-500">
            Manage your business from one place.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link
            href="/app/orders/new"
            className="card group p-5 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-lg">
              🛍️
            </div>

            <h3 className="font-bold text-slate-900">
              Create New Order
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Record a customer order and track its status.
            </p>

            <span className="mt-4 inline-block text-sm font-semibold text-emerald-700">
              Create order →
            </span>
          </Link>

          <Link
            href="/app/customers/new"
            className="card group p-5 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-lg">
              👤
            </div>

            <h3 className="font-bold text-slate-900">
              Add Customer
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Save customer details so you never lose an order contact.
            </p>

            <span className="mt-4 inline-block text-sm font-semibold text-emerald-700">
              Add customer →
            </span>
          </Link>

          <Link
            href="/app/products/new"
            className="card group p-5 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-lg">
              📦
            </div>

            <h3 className="font-bold text-slate-900">
              Add Product
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Add products and keep your catalogue organized.
            </p>

            <span className="mt-4 inline-block text-sm font-semibold text-emerald-700">
              Add product →
            </span>
          </Link>
        </div>
      </section>

      {/* Main dashboard grid */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Recent orders */}
        <section className="card overflow-hidden xl:col-span-2">
          <div className="flex items-center justify-between border-b px-5 py-4">
            <div>
              <h2 className="font-bold text-slate-900">
                Recent Orders
              </h2>

              <p className="text-sm text-slate-500">
                Your latest customer orders
              </p>
            </div>

            <Link
              href="/app/orders"
              className="text-sm font-semibold text-emerald-700 hover:underline"
            >
              View all
            </Link>
          </div>

          {orders.length > 0 ? (
            <div className="divide-y">
              {orders.map((order) => (
                <Link
                  className="block px-5 py-4 transition hover:bg-slate-50"
                  href={`/app/orders/${order.id}`}
                  key={order.id}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-bold text-slate-900">
                        {order.order_number}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {order.customers?.name || 'Unknown customer'}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-left sm:text-right">
                        <p className="font-bold text-slate-900">
                          {formatNaira(Number(order.total))}
                        </p>

                        <p className="text-xs text-slate-500">
                          {formatDate(order.created_at)}
                        </p>
                      </div>

                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        {order.status}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="px-5 py-12 text-center">
              <div className="text-4xl">🛍️</div>

              <h3 className="mt-3 font-bold text-slate-900">
                No orders yet
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Create your first order to start tracking sales.
              </p>

              <Link
                href="/app/orders/new"
                className="btn btn-primary mt-5 inline-flex"
              >
                Create First Order
              </Link>
            </div>
          )}
        </section>

        {/* Order status */}
        <section className="card overflow-hidden">
          <div className="border-b px-5 py-4">
            <h2 className="font-bold text-slate-900">
              Order Status
            </h2>

            <p className="text-sm text-slate-500">
              Recent order breakdown
            </p>
          </div>

          <div className="space-y-5 p-5">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600">
                    {status}
                  </span>

                  <span className="text-sm font-bold text-slate-900">
                    {count}
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-emerald-600"
                    style={{
                      width: `${Math.min(count * 16.67, 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
