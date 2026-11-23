import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, Menu, Search, ShoppingCart, User, X } from "lucide-react";
import { useMemo, useState } from "react";
import { categories, searchProducts } from "@/lib/catalog";
import { useStore } from "@/lib/store";
import { useAuth } from "@/lib/auth";

const nav = [
  { to: "/categories", label: "All Categories" },
  { to: "/deals", label: "Deals" },
  { to: "/flash-sale", label: "Flash Sale ⚡" },
  { to: "/best-sellers", label: "Best Sellers" },
  { to: "/new-arrivals", label: "New Arrivals" },
  { to: "/brands", label: "Brands" },
  { to: "/track-order", label: "Track Order" },
  { to: "/help", label: "Help Center" },
] as const;
const popular = ["earbuds", "lawn suit", "sneakers", "air fryer", "cricket bat", "laptop"];

export function Header() {
  const { cart, wishlist } = useStore();
  const { user } = useAuth();
  const [q, setQ] = useState("");
  const [focus, setFocus] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const sugg = useMemo(() => (q.length > 1 ? searchProducts(q).slice(0, 6) : []), [q]);
  const go = (term: string) => {
    if (!term.trim()) return;
    const r = JSON.parse(localStorage.getItem("buyza-searches") || "[]");
    localStorage.setItem(
      "buyza-searches",
      JSON.stringify([term, ...r.filter((x: string) => x !== term)].slice(0, 5)),
    );
    setFocus(false);
    navigate({ to: "/search", search: { q: term } });
  };
  const count = cart.reduce((s, i) => s + i.qty, 0);
  return (
    <header className="sticky top-0 z-40 bg-card shadow-card">
      <div className="overflow-hidden bg-primary text-primary-foreground text-xs py-1.5">
        <div className="flex w-max animate-marquee gap-12 whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, k) => (
            <span key={k} className="flex gap-12">
              <span>🚚 Free delivery on orders over Rs. 2,999</span>
              <span>💵 Cash on Delivery all over Pakistan</span>
              <span>
                🎁 Use code <b className="text-accent">BUYZA10</b> for 10% off
              </span>
              <span>↩️ 7-day easy returns</span>
            </span>
          ))}
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
        <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Menu">
          <Menu />
        </button>
        <Link to="/" className="font-display text-2xl font-extrabold text-primary">
          BUY<span className="text-accent">ZA</span>
        </Link>
        <div className="relative flex-1">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              go(q);
            }}
            className="flex overflow-hidden rounded-full border-2 border-primary bg-card"
          >
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onFocus={() => setFocus(true)}
              onBlur={() => setTimeout(() => setFocus(false), 180)}
              placeholder="Search products, brands, categories…"
              className="min-w-0 flex-1 bg-transparent px-4 py-2 text-sm outline-none"
            />
            <button className="bg-accent-grad px-4 text-accent-foreground" aria-label="Search">
              <Search className="h-4 w-4" />
            </button>
          </form>
          {focus && (
            <div className="absolute inset-x-0 top-full mt-2 rounded-xl border bg-popover p-3 shadow-lift">
              {sugg.length ? (
                sugg.map((p) => (
                  <Link
                    key={p.id}
                    to="/product/$slug"
                    params={{ slug: p.slug }}
                    className="flex items-center gap-3 rounded-lg p-2 text-sm hover:bg-muted"
                  >
                    <img src={p.images[0]} alt="" className="h-9 w-9 rounded object-cover" />
                    <span className="flex-1 truncate">{p.name}</span>
                    <span className="text-xs text-muted-foreground">{p.subName}</span>
                  </Link>
                ))
              ) : (
                <div className="space-y-3 text-sm">
                  <RecentSearches onPick={go} />
                  <div>
                    <p className="mb-2 text-xs font-semibold text-muted-foreground">POPULAR</p>
                    <div className="flex flex-wrap gap-2">
                      {popular.map((t) => (
                        <button
                          key={t}
                          onMouseDown={() => go(t)}
                          className="rounded-full bg-secondary px-3 py-1 hover:bg-accent-soft"
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <Link to="/account" className="hidden items-center gap-1 text-sm sm:flex">
          <User className="h-5 w-5" /> {user ? "Account" : "Sign in"}
        </Link>
        <Link to="/wishlist" className="relative" aria-label="Wishlist">
          <Heart className="h-6 w-6" />
          {wishlist.length > 0 && <Badge n={wishlist.length} />}
        </Link>
        <Link to="/cart" className="relative" aria-label="Cart">
          <ShoppingCart className="h-6 w-6" />
          {count > 0 && <Badge n={count} />}
        </Link>
      </div>
      <nav className="hidden border-t lg:block">
        <div className="mx-auto flex max-w-7xl gap-6 px-4 py-2 text-sm font-medium">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="hover:text-accent"
              activeProps={{ className: "text-accent" }}
            >
              {n.label}
            </Link>
          ))}
        </div>
      </nav>
      {open && (
        <div className="fixed inset-0 z-50 bg-foreground/40" onClick={() => setOpen(false)}>
          <div
            className="h-full w-72 overflow-y-auto bg-card p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex justify-between">
              <span className="font-display text-xl font-bold">Menu</span>
              <button onClick={() => setOpen(false)}>
                <X />
              </button>
            </div>
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="block border-b py-2 text-sm"
              >
                {n.label}
              </Link>
            ))}
            <p className="mt-4 mb-2 text-xs font-semibold text-muted-foreground">CATEGORIES</p>
            {categories.map((c) => (
              <Link
                key={c.slug}
                to="/category/$cat"
                params={{ cat: c.slug }}
                onClick={() => setOpen(false)}
                className="block py-1.5 text-sm"
              >
                {c.emoji} {c.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
function Badge({ n }: { n: number }) {
  return (
    <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
      {n}
    </span>
  );
}
function RecentSearches({ onPick }: { onPick: (t: string) => void }) {
  const [r] = useState<string[]>(() =>
    typeof window === "undefined" ? [] : JSON.parse(localStorage.getItem("buyza-searches") || "[]"),
  );
  if (!r.length) return null;
  return (
    <div>
      <p className="mb-2 text-xs font-semibold text-muted-foreground">RECENT</p>
      {r.map((t) => (
        <button
          key={t}
          onMouseDown={() => onPick(t)}
          className="block w-full rounded px-2 py-1 text-left hover:bg-muted"
        >
          🕘 {t}
        </button>
      ))}
    </div>
  );
}
