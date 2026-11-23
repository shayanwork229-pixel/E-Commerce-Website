import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHead } from "@/components/shop/ProductCard";
import { SignInPrompt } from "@/components/shop/SignInPrompt";
import { pkr, products } from "@/lib/catalog";
import { applyCoupon, deliveryFee } from "@/lib/pricing";
import { provinces } from "@/lib/pakistan";
import { useAuth } from "@/lib/auth";
import { useStore } from "@/lib/store";
import { supabase } from "@/integrations/supabase/client";
import { placeOrder } from "@/lib/orders.functions";
import { seo } from "@/lib/seo";
export const Route = createFileRoute("/checkout")({
  head: () => seo("Checkout", "Complete your BUYZA order."),
  component: Checkout,
});
type Addr = {
  full_name: string;
  phone: string;
  province: string;
  city: string;
  area: string;
  postal_code: string;
};
function Checkout() {
  const { user, loading } = useAuth();
  const { cart, clearCart } = useStore();
  const place = useServerFn(placeOrder);
  const [a, setA] = useState<Addr>({
    full_name: "",
    phone: "",
    province: "Punjab",
    city: "Lahore",
    area: "",
    postal_code: "",
  });
  const [coupon, setCoupon] = useState("");
  const [save, setSave] = useState(true);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState("");
  const [saved, setSaved] = useState<Addr[]>([]);
  useEffect(() => {
    if (!user) return;
    supabase
      .from("addresses")
      .select("full_name, phone, province, city, area, postal_code")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        const list = (data ?? []).map((x) => ({ ...x, postal_code: x.postal_code ?? "" }));
        setSaved(list);
        if (list[0]) {
          setA(list[0]);
          setSave(false);
        }
      });
  }, [user]);
  if (done)
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="text-6xl">🎉</p>
        <h1 className="mt-4 text-3xl font-extrabold">Order placed!</h1>
        <p className="mt-2 text-muted-foreground">Your order number is</p>
        <p className="font-display text-3xl font-bold text-accent">{done}</p>
        <p className="mt-2 text-sm text-muted-foreground">Pay in cash when it arrives.</p>
        <Link
          to="/account"
          className="mt-6 inline-block rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground"
        >
          View my orders
        </Link>
      </div>
    );
  if (loading) return <p className="py-20 text-center text-muted-foreground">Loading…</p>;
  if (!user) return <SignInPrompt next="/checkout" text="Sign in to place your order" />;
  const lines = cart
    .map((i) => ({ ...i, p: products.find((p) => p.id === i.id) }))
    .filter((l) => l.p);
  if (!lines.length)
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <Link to="/" className="mt-4 inline-block text-accent underline">
          Continue shopping
        </Link>
      </div>
    );
  const subtotal = lines.reduce((s, l) => s + l.p!.price * l.qty, 0);
  const c = coupon ? applyCoupon(coupon, subtotal) : null;
  const discount = c && c.ok ? c.discount : 0;
  const ship = deliveryFee(subtotal - discount);
  const set = (k: keyof Addr) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setA((x) => ({
      ...x,
      [k]: e.target.value,
      ...(k === "province" ? { city: provinces[e.target.value]![0]! } : {}),
    }));
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const r = await place({
        data: {
          items: lines.map((l) => ({
            id: l.id,
            qty: l.qty,
            ...(l.color ? { color: l.color } : {}),
            ...(l.size ? { size: l.size } : {}),
          })),
          ...(coupon && c?.ok ? { coupon } : {}),
          address: { ...a, ...(a.postal_code ? {} : { postal_code: undefined }) } as Addr,
          saveAddress: save,
        },
      });
      clearCart();
      setDone(r.orderNumber);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message.replace(/^\[.*?\]\s*/, "") : "Could not place order",
      );
    } finally {
      setBusy(false);
    }
  };
  const inp = "w-full rounded-xl border bg-card px-4 py-2.5 text-sm";
  return (
    <div>
      <PageHead title="Checkout" />
      <form
        onSubmit={submit}
        className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[1fr_380px]"
      >
        <div className="space-y-4">
          <div className="space-y-3 rounded-2xl bg-card p-6 shadow-card">
            <h2 className="text-xl font-bold">Delivery address</h2>
            {saved.length > 0 && (
              <select
                onChange={(e) => {
                  const s = saved[+e.target.value];
                  if (s) setA(s);
                }}
                className={inp}
              >
                {saved.map((s, i) => (
                  <option key={i} value={i}>
                    {s.full_name} — {s.area}, {s.city}
                  </option>
                ))}
              </select>
            )}
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                required
                value={a.full_name}
                onChange={set("full_name")}
                placeholder="Full name"
                className={inp}
              />
              <input
                required
                value={a.phone}
                onChange={set("phone")}
                placeholder="Mobile e.g. 03001234567"
                className={inp}
              />
              <select value={a.province} onChange={set("province")} className={inp}>
                {Object.keys(provinces).map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
              <select value={a.city} onChange={set("city")} className={inp}>
                {provinces[a.province]!.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
              <input
                required
                value={a.area}
                onChange={set("area")}
                placeholder="House #, street, area"
                className={`${inp} sm:col-span-2`}
              />
              <input
                value={a.postal_code}
                onChange={set("postal_code")}
                placeholder="Postal code (optional)"
                className={inp}
              />
            </div>
            <label className="flex gap-2 text-sm">
              <input type="checkbox" checked={save} onChange={(e) => setSave(e.target.checked)} />{" "}
              Save this address
            </label>
          </div>
          <div className="space-y-2 rounded-2xl bg-card p-6 shadow-card">
            <h2 className="text-xl font-bold">Payment method</h2>
            <label className="flex items-center gap-3 rounded-xl border-2 border-accent p-3 text-sm">
              <input type="radio" checked readOnly /> 💵 Cash on Delivery
            </label>
            {["Bank Transfer", "Easypaisa", "JazzCash"].map((m) => (
              <div
                key={m}
                className="flex items-center gap-3 rounded-xl border p-3 text-sm text-muted-foreground opacity-60"
              >
                <input type="radio" disabled /> {m}{" "}
                <span className="ml-auto text-xs">Coming soon</span>
              </div>
            ))}
          </div>
        </div>
        <div className="h-fit space-y-3 rounded-2xl bg-card p-6 shadow-card">
          <h2 className="text-xl font-bold">Order summary</h2>
          {lines.map((l) => (
            <div key={l.id} className="flex gap-3 text-sm">
              <img src={l.p!.images[0]} alt="" className="h-12 w-12 rounded-lg object-cover" />
              <span className="flex-1">
                {l.p!.name} × {l.qty}
              </span>
              <span>{pkr(l.p!.price * l.qty)}</span>
            </div>
          ))}
          <input
            value={coupon}
            onChange={(e) => setCoupon(e.target.value.toUpperCase())}
            placeholder="Coupon code"
            className={inp}
          />
          {coupon && c && !c.ok && <p className="text-xs text-destructive">{c.error}</p>}
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>{pkr(subtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm">
              <span>Discount</span>
              <span>- {pkr(discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span>Delivery</span>
            <span>{ship ? pkr(ship) : "FREE"}</span>
          </div>
          <div className="flex justify-between border-t pt-3 text-lg font-bold">
            <span>Total</span>
            <span>{pkr(subtotal - discount + ship)}</span>
          </div>
          <button
            disabled={busy}
            className="w-full rounded-full bg-accent-grad py-3 font-semibold text-accent-foreground disabled:opacity-50"
          >
            {busy ? "Placing order…" : "Place Order"}
          </button>
        </div>
      </form>
    </div>
  );
}
