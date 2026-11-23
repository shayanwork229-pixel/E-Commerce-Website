import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { pkr, products } from "@/lib/catalog";
import { useStore } from "@/lib/store";
import { seo } from "@/lib/seo";
import { applyCoupon, deliveryFee } from "@/lib/pricing";
export const Route = createFileRoute("/cart")({
  head: () => seo("Your Cart", "Review items in your BUYZA cart."),
  component: Cart,
});
function Cart() {
  const { cart, setQty, removeFromCart } = useStore();
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState("");
  const lines = cart
    .map((i) => ({ ...i, p: products.find((p) => p.id === i.id)! }))
    .filter((l) => l.p);
  const subtotal = lines.reduce((s, l) => s + l.p.price * l.qty, 0);
  const c = applied ? applyCoupon(applied, subtotal) : null;
  const discount = c && c.ok ? c.discount : 0;
  const ship = deliveryFee(subtotal - discount);
  if (!lines.length)
    return (
      <div className="py-24 text-center">
        <p className="text-6xl">🛒</p>
        <h1 className="mt-4 text-3xl font-bold">Your cart is empty</h1>
        <Link
          to="/deals"
          className="mt-6 inline-block rounded-full bg-accent-grad px-6 py-3 font-semibold text-accent-foreground"
        >
          Discover deals
        </Link>
      </div>
    );
  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold">Cart ({lines.length})</h1>
        {lines.map((l) => (
          <div key={l.id} className="flex gap-4 rounded-2xl bg-card p-4 shadow-card">
            <img src={l.p.images[0]} alt="" className="h-24 w-24 rounded-xl object-cover" />
            <div className="flex-1">
              <Link
                to="/product/$slug"
                params={{ slug: l.p.slug }}
                className="font-medium hover:text-accent"
              >
                {l.p.name}
              </Link>
              <p className="text-xs text-muted-foreground">
                {[l.color, l.size].filter(Boolean).join(" · ")}
              </p>
              <p className="mt-1 font-bold text-accent">{pkr(l.p.price)}</p>
              <div className="mt-2 flex items-center gap-3">
                <select
                  value={l.qty}
                  onChange={(e) => setQty(l.id, +e.target.value)}
                  className="rounded border px-2 py-1 text-sm"
                >
                  {Array.from({ length: Math.min(10, l.p.stock) }, (_, k) => (
                    <option key={k}>{k + 1}</option>
                  ))}
                </select>
                <button
                  onClick={() => removeFromCart(l.id)}
                  className="text-muted-foreground hover:text-destructive"
                  aria-label="Remove"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="font-semibold">{pkr(l.p.price * l.qty)}</p>
          </div>
        ))}
      </div>
      <div className="h-fit space-y-3 rounded-2xl bg-card p-6 shadow-card">
        <h2 className="text-xl font-bold">Order Summary</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const r = applyCoupon(code, subtotal);
            if (r.ok) {
              setApplied(code);
              toast.success("Coupon applied!");
            } else toast.error(r.error);
          }}
          className="flex gap-2"
        >
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Coupon code"
            className="flex-1 rounded-full border px-3 py-2 text-sm"
          />
          <button className="rounded-full bg-primary px-4 text-sm text-primary-foreground">
            Apply
          </button>
        </form>
        <p className="text-xs text-muted-foreground">
          Try BUYZA10 (10% off) or SAVE500 (Rs. 500 off orders over Rs. 5,000)
        </p>
        <Row k="Subtotal" v={pkr(subtotal)} />
        {discount > 0 && <Row k={`Discount (${applied})`} v={`- ${pkr(discount)}`} />}
        <Row k="Delivery" v={ship ? pkr(ship) : "FREE"} />
        <div className="border-t pt-3">
          <Row k="Total" v={pkr(subtotal - discount + ship)} bold />
        </div>
        <Link
          to="/checkout"
          className="block rounded-full bg-accent-grad py-3 text-center font-semibold text-accent-foreground"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
function Row({ k, v, bold }: { k: string; v: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between text-sm ${bold ? "text-lg font-bold" : ""}`}>
      <span>{k}</span>
      <span>{v}</span>
    </div>
  );
}
