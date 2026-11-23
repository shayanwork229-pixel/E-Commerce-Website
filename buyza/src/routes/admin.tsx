import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHead } from "@/components/shop/ProductCard";
import { SignInPrompt, statusStyle } from "@/components/shop/SignInPrompt";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { pkr, products, categories } from "@/lib/catalog";
import { seo } from "@/lib/seo";
export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      ...seo("Admin Dashboard", "BUYZA store management.").meta,
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});
const statuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"] as const;
type O = {
  id: string;
  order_number: string;
  status: (typeof statuses)[number];
  total: number;
  created_at: string;
  full_name: string;
  phone: string;
  city: string;
  area: string;
  order_items: { product_name: string; quantity: number }[];
};
function Admin() {
  const { user, loading, isAdmin } = useAuth();
  const [orders, setOrders] = useState<O[]>([]);
  const [filter, setFilter] = useState("");
  const load = () =>
    supabase
      .from("orders")
      .select(
        "id, order_number, status, total, created_at, full_name, phone, city, area, order_items(product_name, quantity)",
      )
      .order("created_at", { ascending: false })
      .limit(500)
      .then(({ data }) => setOrders((data ?? []) as O[]));
  useEffect(() => {
    if (isAdmin) void load();
  }, [isAdmin]);
  if (loading) return <p className="py-20 text-center text-muted-foreground">Loading…</p>;
  if (!user) return <SignInPrompt next="/admin" text="Admin sign in" />;
  if (!isAdmin)
    return (
      <p className="py-20 text-center text-muted-foreground">You don't have access to this page.</p>
    );
  const live = orders.filter((o) => o.status !== "cancelled");
  const stats = [
    ["Revenue", pkr(live.reduce((s, o) => s + o.total, 0))],
    ["Orders", orders.length],
    ["Pending", orders.filter((o) => o.status === "pending").length],
    ["Customers", new Set(orders.map((o) => o.phone)).size],
    ["Products", products.length],
    ["Low stock", products.filter((p) => p.stock < 5).length],
  ];
  const shown = filter ? orders.filter((o) => o.status === filter) : orders;
  return (
    <div>
      <PageHead title="Admin Dashboard" sub={`${categories.length} departments`} />
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
          {stats.map(([k, v]) => (
            <div key={k} className="rounded-2xl bg-card p-4 shadow-card">
              <p className="text-xs text-muted-foreground">{k}</p>
              <p className="font-display text-2xl font-bold">{v}</p>
            </div>
          ))}
        </div>
        <div className="rounded-2xl bg-card p-6 shadow-card">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-xl font-bold">Orders</h2>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-full border px-3 py-1.5 text-sm"
            >
              <option value="">All statuses</option>
              {statuses.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          {shown.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-muted-foreground">
                  <tr>
                    <th className="py-2">Order</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {shown.map((o) => (
                    <tr key={o.id} className="border-t align-top">
                      <td className="py-3">
                        <b>{o.order_number}</b>
                        <br />
                        <span className="text-xs text-muted-foreground">
                          {new Date(o.created_at).toLocaleString("en-PK")}
                        </span>
                      </td>
                      <td>
                        {o.full_name}
                        <br />
                        <span className="text-xs text-muted-foreground">
                          {o.phone} · {o.area}, {o.city}
                        </span>
                      </td>
                      <td className="text-xs">
                        {o.order_items.map((i) => `${i.product_name} ×${i.quantity}`).join(", ")}
                      </td>
                      <td className="font-semibold">{pkr(o.total)}</td>
                      <td>
                        <select
                          value={o.status}
                          onChange={async (e) => {
                            const { error } = await supabase
                              .from("orders")
                              .update({ status: e.target.value as O["status"] })
                              .eq("id", o.id);
                            if (error) toast.error("Update failed");
                            else {
                              toast.success("Status updated");
                              void load();
                            }
                          }}
                          className={`rounded-full px-2 py-1 text-xs font-bold capitalize ${statusStyle[o.status]}`}
                        >
                          {statuses.map((s) => (
                            <option key={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No orders yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
