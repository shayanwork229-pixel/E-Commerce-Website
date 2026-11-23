import { Link } from "@tanstack/react-router";
import { Eye, Heart, ShoppingCart, Star } from "lucide-react";
import { useState } from "react";
import { pkr, type Product } from "@/lib/catalog";
import { useStore } from "@/lib/store";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export function Stars({ r }: { r: number }) {
  return (
    <span className="inline-flex">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${i <= Math.round(r) ? "fill-star text-star" : "text-border"}`}
        />
      ))}
    </span>
  );
}

export function ProductCard({ p }: { p: Product }) {
  const { addToCart, toggleWish, wishlist } = useStore();
  const [qv, setQv] = useState(false);
  const wished = wishlist.includes(p.id);
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-card shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="absolute left-2 top-2 z-10 flex flex-col items-start gap-1">
        {p.discount > 0 && (
          <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-accent-foreground">
            -{p.discount}%
          </span>
        )}
        {p.isNew && (
          <span className="rounded-full bg-success px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
            NEW
          </span>
        )}
        {p.sold > 7000 && (
          <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
            BESTSELLER
          </span>
        )}
      </div>
      <div className="absolute right-2 top-2 z-10 flex flex-col gap-1.5">
        <button
          onClick={() => toggleWish(p.id)}
          aria-label="Wishlist"
          className="grid h-8 w-8 place-items-center rounded-full bg-card shadow-card"
        >
          <Heart className={`h-4 w-4 ${wished ? "fill-accent text-accent" : ""}`} />
        </button>
        <button
          onClick={() => setQv(true)}
          aria-label="Quick view"
          className="grid h-8 w-8 place-items-center rounded-full bg-card opacity-0 shadow-card transition group-hover:opacity-100"
        >
          <Eye className="h-4 w-4" />
        </button>
      </div>
      <Link
        to="/product/$slug"
        params={{ slug: p.slug }}
        className="aspect-square overflow-hidden bg-muted"
      >
        <img
          src={p.images[0]}
          alt={p.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          {p.brand}
        </p>
        <Link
          to="/product/$slug"
          params={{ slug: p.slug }}
          className="line-clamp-2 text-sm font-medium leading-snug hover:text-accent"
        >
          {p.name}
        </Link>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Stars r={p.rating} /> ({p.reviews})
        </div>
        <div className="mt-auto flex items-baseline gap-2 pt-1">
          <span className="font-display text-lg font-bold text-accent">{pkr(p.price)}</span>
          {p.discount > 0 && (
            <span className="text-xs text-muted-foreground line-through">{pkr(p.oldPrice)}</span>
          )}
        </div>
        <p className={`text-[11px] ${p.stock ? "text-success" : "text-destructive"}`}>
          {p.stock ? (p.stock < 10 ? `Only ${p.stock} left` : "In stock") : "Out of stock"}
        </p>
        <button
          disabled={!p.stock}
          onClick={() => addToCart(p.id)}
          className="mt-1 flex items-center justify-center gap-2 rounded-full bg-primary py-2 text-xs font-semibold text-primary-foreground transition hover:bg-accent disabled:opacity-40"
        >
          <ShoppingCart className="h-3.5 w-3.5" /> Add to Cart
        </button>
      </div>
      <Dialog open={qv} onOpenChange={setQv}>
        <DialogContent className="max-w-2xl">
          <DialogTitle className="sr-only">{p.name}</DialogTitle>
          <div className="grid gap-4 sm:grid-cols-2">
            <img src={p.images[0]} alt={p.name} className="rounded-xl" />
            <div className="space-y-2">
              <p className="text-xs uppercase text-muted-foreground">{p.brand}</p>
              <h3 className="text-xl font-bold">{p.name}</h3>
              <Stars r={p.rating} />
              <p className="font-display text-2xl font-bold text-accent">{pkr(p.price)}</p>
              <p className="text-sm text-muted-foreground">{p.description}</p>
              <button
                disabled={!p.stock}
                onClick={() => addToCart(p.id)}
                className="w-full rounded-full bg-accent-grad py-2.5 text-sm font-semibold text-accent-foreground disabled:opacity-40"
              >
                Add to Cart
              </button>
              <Link
                to="/product/$slug"
                params={{ slug: p.slug }}
                className="block text-center text-sm underline"
              >
                View full details
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
export function Grid({ items }: { items: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-5">
      {items.map((p) => (
        <ProductCard key={p.id} p={p} />
      ))}
    </div>
  );
}
export function Section({
  title,
  to,
  children,
  extra,
}: {
  title: string;
  to?: string;
  children: React.ReactNode;
  extra?: React.ReactNode;
}) {
  return (
    <section className="mx-auto mt-10 max-w-7xl px-4">
      <div className="mb-4 flex items-end justify-between gap-3">
        <h2 className="text-2xl font-bold md:text-3xl">{title}</h2>
        {extra}
        {to && (
          <Link to={to as "/"} className="text-sm font-semibold text-accent hover:underline">
            View all →
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
export function PageHead({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="bg-hero text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="text-3xl font-extrabold md:text-5xl">{title}</h1>
        {sub && <p className="mt-2 opacity-80">{sub}</p>}
      </div>
    </div>
  );
}
