import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { Heart, Minus, Plus, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { bySlug, pkr, products } from "@/lib/catalog";
import { Grid, Section, Stars } from "@/components/shop/ProductCard";
import { useStore } from "@/lib/store";
export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    if (!bySlug.has(params.slug)) throw notFound();
    return null;
  },
  head: ({ params }) => {
    const p = bySlug.get(params.slug);
    return {
      meta: p
        ? [
            { title: `${p.name} | BUYZA` },
            { name: "description", content: p.description },
            { property: "og:title", content: p.name },
            { property: "og:description", content: p.description },
            { property: "og:type", content: "product" },
            { name: "twitter:card", content: "summary_large_image" },
            { property: "og:image", content: p.images[0]! },
            { name: "twitter:image", content: p.images[0]! },
          ]
        : [{ title: "Unavailable | BUYZA" }, { name: "robots", content: "noindex" }],
    };
  },
  component: PDP,
});
function PDP() {
  const { slug } = Route.useParams();
  const p = bySlug.get(slug)!;
  const s = useStore();
  const nav = useNavigate();
  const [img, setImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [color, setColor] = useState(p.colors[0]);
  const [size, setSize] = useState(p.sizes[0]);
  const [zoom, setZoom] = useState<string | null>(null);
  useEffect(() => {
    s.addRecent(p.id);
    setImg(0);
    setQty(1);
  }, [p.id]); // eslint-disable-line react-hooks/exhaustive-deps
  const related = products.filter((x) => x.sub === p.sub && x.id !== p.id).slice(0, 10);
  const recent = s.recent
    .filter((id) => id !== p.id)
    .map((id) => products.find((x) => x.id === id))
    .filter((x) => x !== undefined)
    .slice(0, 5);
  const eta = new Date(Date.now() + 3 * 864e5).toLocaleDateString("en-PK", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  const add = () =>
    s.addToCart(p.id, qty, { ...(color ? { color } : {}), ...(size ? { size } : {}) });
  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <p className="mb-4 text-sm text-muted-foreground">
        <Link to="/">Home</Link> /{" "}
        <Link to="/category/$cat" params={{ cat: p.category }}>
          {p.categoryName}
        </Link>{" "}
        /{" "}
        <Link to="/category/$cat/$sub" params={{ cat: p.category, sub: p.sub }}>
          {p.subName}
        </Link>
      </p>
      <div className="grid gap-8 rounded-3xl bg-card p-4 shadow-card md:grid-cols-2 md:p-8">
        <div>
          <div
            className="aspect-square cursor-zoom-in overflow-hidden rounded-2xl bg-muted"
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              setZoom(
                `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`,
              );
            }}
            onMouseLeave={() => setZoom(null)}
          >
            <img
              src={p.images[img]}
              alt={p.name}
              className="h-full w-full object-cover transition-transform duration-200"
              style={zoom ? { transform: "scale(2)", transformOrigin: zoom } : undefined}
            />
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {p.images.map((u, k) => (
              <button
                key={u}
                onClick={() => setImg(k)}
                className={`overflow-hidden rounded-xl border-2 ${k === img ? "border-accent" : "border-transparent"}`}
              >
                <img src={u} alt="" className="aspect-square object-cover" />
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase text-muted-foreground">{p.brand}</p>
          <h1 className="text-3xl font-bold">{p.name}</h1>
          <div className="flex items-center gap-2 text-sm">
            <Stars r={p.rating} /> {p.rating} · {p.reviews} ratings · {p.sold.toLocaleString()} sold
          </div>
          <div className="flex items-baseline gap-3">
            <span className="font-display text-4xl font-extrabold text-accent">{pkr(p.price)}</span>
            {p.discount > 0 && (
              <>
                <span className="text-muted-foreground line-through">{pkr(p.oldPrice)}</span>
                <span className="rounded-full bg-accent-soft px-2 py-0.5 text-sm font-bold text-accent">
                  -{p.discount}%
                </span>
              </>
            )}
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold">Color: {color}</p>
            <div className="flex gap-2">
              {p.colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`rounded-full border-2 px-3 py-1 text-sm ${c === color ? "border-accent" : ""}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          {p.sizes.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-semibold">Size</p>
              <div className="flex flex-wrap gap-2">
                {p.sizes.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSize(c)}
                    className={`h-10 min-w-10 rounded-lg border-2 px-2 text-sm ${c === size ? "border-accent bg-accent-soft" : ""}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="flex items-center gap-4">
            <div className="flex items-center rounded-full border">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-2">
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center">{qty}</span>
              <button onClick={() => setQty(Math.min(p.stock, qty + 1))} className="p-2">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <span className={`text-sm ${p.stock ? "text-success" : "text-destructive"}`}>
              {p.stock ? `${p.stock} in stock` : "Out of stock"}
            </span>
          </div>
          <div className="flex gap-3">
            <button
              disabled={!p.stock}
              onClick={add}
              className="flex-1 rounded-full bg-primary py-3 font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-40"
            >
              Add to Cart
            </button>
            <button
              disabled={!p.stock}
              onClick={() => {
                add();
                nav({ to: "/cart" });
              }}
              className="flex-1 rounded-full bg-accent-grad py-3 font-semibold text-accent-foreground disabled:opacity-40"
            >
              Buy Now
            </button>
            <button
              onClick={() => s.toggleWish(p.id)}
              className="rounded-full border-2 p-3"
              aria-label="Wishlist"
            >
              <Heart className={s.wishlist.includes(p.id) ? "fill-accent text-accent" : ""} />
            </button>
          </div>
          <div className="grid gap-2 rounded-2xl bg-muted p-4 text-sm">
            <p className="flex gap-2">
              <Truck className="h-4 w-4 text-accent" /> Estimated delivery by <b>{eta}</b> ·{" "}
              {p.price >= 2999 ? "Free delivery" : "Rs. 199 delivery"}
            </p>
            <p className="flex gap-2">
              <RotateCcw className="h-4 w-4 text-accent" /> 7-day easy returns
            </p>
            <p className="flex gap-2">
              <ShieldCheck className="h-4 w-4 text-accent" /> 100% genuine · Cash on Delivery
              available
            </p>
          </div>
        </div>
      </div>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl bg-card p-6 shadow-card">
          <h2 className="text-xl font-bold">Description</h2>
          <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
          <h3 className="mt-4 font-bold">Specifications</h3>
          <table className="mt-2 w-full text-sm">
            {[
              ["Brand", p.brand],
              ["Category", p.subName],
              ["Colors", p.colors.join(", ")],
              ["Warranty", "6 months brand warranty"],
              ["SKU", `BZ-${p.id.padStart(6, "0")}`],
            ].map(([k, v]) => (
              <tr key={k} className="border-b">
                <td className="py-2 text-muted-foreground">{k}</td>
                <td>{v}</td>
              </tr>
            ))}
          </table>
        </div>
        <div className="rounded-2xl bg-card p-6 shadow-card">
          <h2 className="text-xl font-bold">Ratings & Reviews</h2>
          <div className="mt-3 flex items-center gap-4">
            <span className="font-display text-5xl font-extrabold">{p.rating}</span>
            <div>
              <Stars r={p.rating} />
              <p className="text-sm text-muted-foreground">{p.reviews} ratings</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Written reviews from verified buyers will appear here once customer accounts and orders
            go live.
          </p>
        </div>
      </div>
      {related.length > 0 && (
        <Section title="Related Products">
          <Grid items={related} />
        </Section>
      )}
      {recent.length > 0 && (
        <Section title="Recently Viewed">
          <Grid items={recent} />
        </Section>
      )}
    </div>
  );
}
