import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHead } from "@/components/shop/ProductCard";
import { SignInPrompt, statusStyle } from "@/components/shop/SignInPrompt";
import { supabase } from "@/integrations/supabase/client";
import { cancelOrder } from "@/lib/orders.functions";
import { useAuth } from "@/lib/auth";
import { pkr } from "@/lib/catalog";
import { seo } from "@/lib/seo";
export const Route = createFileRoute("/account")({
  head: () => seo("My Account", "Your BUYZA profile, orders and addresses."),
  component: Account,
});
type Order = {
  id: string;
  order_number: string;
  status: string;
  total: number;
  created_at: string;
  city: string;
  order_items: { product_name: string; quantity: number; image: string | null }[];
};
function Account() {
  const { user, loading, isAdmin } = useAuth();
  const cancel = useServerFn(cancelOrder);
  const [orders, setOrders] = useState<Order[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [addrs, setAddrs] = useState<
    { id: string; full_name: string; area: string; city: string; phone: string }[]
  >([]);
  const load = async () => {
    const [o, p, a] = await Promise.all([
      supabase
        .from("orders")
        .select(
          "id, order_number, status, total, created_at, city, order_items(product_name, quantity, image)",
        )
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false }),
      supabase.from("profiles").select("full_name, phone").eq("id", user!.id).maybeSingle(),
      supabase.from("addresses").select("id, full_name, area, city, phone"),
    ]);
    setOrders((o.data ?? []) as Order[]);
    setName(p.data?.full_name ?? "");
    setPhone(p.data?.phone ?? "");
    setAddrs(a.data ?? []);
  };
  useEffect(() => {
    if (user) void load();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps
  if (loading) return <p className="py-20 text-center text-muted-foreground">Loading…</p>;
  if (!user) return <SignInPrompt next="/account" text="Sign in to see your account" />;
  const box = "rounded-2xl bg-card p-6 shadow-card";
  return (
    <div>
      <PageHead title="My Account" sub={user.email ?? ""} />
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[320px_1fr]">
        <div className="space-y-4">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const { error } = await supabase
                .from("profiles")
                .update({ full_name: name, phone })
                .eq("id", user.id);
              if (error) {
                toast.error("Could not save");
              } else {
                toast.success("Profile saved");
              }
            }}
            className={`${box} space-y-3`}
          >
            <h2 className="text-lg font-bold">Profile</h2>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="w-full rounded-xl border px-3 py-2 text-sm"
            />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone"
              className="w-full rounded-xl border px-3 py-2 text-sm"
            />
            <button className="w-full rounded-full bg-primary py-2 text-sm font-semibold text-primary-foreground">
              Save
            </button>
          </form>
          <div className={`${box} space-y-2`}>
            <h2 className="text-lg font-bold">Saved addresses</h2>
            {addrs.length ? (
              addrs.map((x) => (
                <div
                  key={x.id}
                  className="flex justify-between gap-2 rounded-xl bg-muted p-3 text-sm"
                >
                  <span>
                    {x.full_name}
                    <br />
                    <span className="text-muted-foreground">
                      {x.area}, {x.city}
                    </span>
                  </span>
                  <button
                    onClick={async () => {
                      await supabase.from("addresses").delete().eq("id", x.id);
                      void load();
                    }}
                    className="text-xs text-destructive"
                  >
                    Delete
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                Addresses you save at checkout appear here.
              </p>
            )}
          </div>
          {isAdmin && (
            <Link
              to="/admin"
              className="block rounded-full bg-accent-grad py-3 text-center font-semibold text-accent-foreground"
            >
              Open Admin Dashboard
            </Link>
          )}
          <button
            onClick={() => supabase.auth.signOut()}
            className="w-full rounded-full border-2 py-2 text-sm font-semibold"
          >
            Sign out
          </button>
        </div>
        <div className={box}>
          <h2 className="mb-4 text-xl font-bold">My orders</h2>
          {orders.length ? (
            <div className="space-y-3">
              {orders.map((o) => (
                <div key={o.id} className="rounded-xl border p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-semibold">{o.order_number}</span>
                    <span
                      className={`rounded-full px-3 py-0.5 text-xs font-bold capitalize ${statusStyle[o.status]}`}
                    >
                      {o.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(o.created_at).toLocaleString("en-PK")} · {o.city}
                  </p>
                  <div className="mt-2 flex gap-2">
                    {o.order_items
                      .slice(0, 5)
                      .map(
                        (i, k) =>
                          i.image && (
                            <img
                              key={k}
                              src={i.image}
                              alt={i.product_name}
                              className="h-12 w-12 rounded-lg object-cover"
                            />
                          ),
                      )}
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-bold text-accent">{pkr(o.total)}</span>
                    {(o.status === "pending" || o.status === "confirmed") && (
                      <button
                        onClick={async () => {
                          try {
                            await cancel({ data: { id: o.id } });
                            toast.success("Order cancelled");
                            void load();
                          } catch (e) {
                            toast.error(e instanceof Error ? e.message : "Failed");
                          }
                        }}
                        className="text-xs text-destructive underline"
                      >
                        Cancel order
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No orders yet.{" "}
              <Link to="/" className="text-accent underline">
                Start shopping
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
