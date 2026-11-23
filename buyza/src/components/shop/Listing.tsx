import { useMemo, useState } from "react";
import { brands as allBrands, sortProducts, type Product, type SortKey } from "@/lib/catalog";
import { Grid } from "./ProductCard";

export function Listing({ items, showCategory }: { items: Product[]; showCategory?: boolean }) {
  const [sort, setSort] = useState<SortKey>("recommended");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [brands, setBrands] = useState<string[]>([]);
  const [rating, setRating] = useState(0);
  const [inStock, setInStock] = useState(false);
  const [disc, setDisc] = useState(0);
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [cat, setCat] = useState("");
  const [limit, setLimit] = useState(40);
  const cats = useMemo(() => [...new Set(items.map((p) => p.categoryName))], [items]);
  const colors = useMemo(() => [...new Set(items.flatMap((p) => p.colors))], [items]);
  const sizes = useMemo(() => [...new Set(items.flatMap((p) => p.sizes))], [items]);
  const filtered = useMemo(
    () =>
      sortProducts(
        items.filter(
          (p) =>
            (!min || p.price >= +min) &&
            (!max || p.price <= +max) &&
            (!brands.length || brands.includes(p.brand)) &&
            p.rating >= rating &&
            (!inStock || p.stock > 0) &&
            p.discount >= disc &&
            (!color || p.colors.includes(color)) &&
            (!size || p.sizes.includes(size)) &&
            (!cat || p.categoryName === cat),
        ),
        sort,
      ),
    [items, min, max, brands, rating, inStock, disc, color, size, cat, sort],
  );
  const box = "rounded-xl bg-card p-4 shadow-card space-y-2 text-sm";
  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[240px_1fr]">
      <aside className="space-y-3">
        <div className={box}>
          <p className="font-semibold">Price (Rs.)</p>
          <div className="flex gap-2">
            <input
              value={min}
              onChange={(e) => setMin(e.target.value)}
              placeholder="Min"
              type="number"
              className="w-full rounded border px-2 py-1"
            />
            <input
              value={max}
              onChange={(e) => setMax(e.target.value)}
              placeholder="Max"
              type="number"
              className="w-full rounded border px-2 py-1"
            />
          </div>
        </div>
        {showCategory && cats.length > 1 && (
          <div className={box}>
            <p className="font-semibold">Category</p>
            <select
              value={cat}
              onChange={(e) => setCat(e.target.value)}
              className="w-full rounded border px-2 py-1"
            >
              <option value="">All</option>
              {cats.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        )}
        <div className={box}>
          <p className="font-semibold">Brand</p>
          <div className="max-h-40 space-y-1 overflow-y-auto">
            {allBrands.map((b) => (
              <label key={b} className="flex gap-2">
                <input
                  type="checkbox"
                  checked={brands.includes(b)}
                  onChange={() =>
                    setBrands((x) => (x.includes(b) ? x.filter((y) => y !== b) : [...x, b]))
                  }
                />
                {b}
              </label>
            ))}
          </div>
        </div>
        <div className={box}>
          <p className="font-semibold">Rating</p>
          {[4, 3, 0].map((r) => (
            <label key={r} className="flex gap-2">
              <input type="radio" checked={rating === r} onChange={() => setRating(r)} />
              {r ? `${r}★ & up` : "Any"}
            </label>
          ))}
        </div>
        <div className={box}>
          <p className="font-semibold">Discount</p>
          {[0, 20, 40].map((d) => (
            <label key={d} className="flex gap-2">
              <input type="radio" checked={disc === d} onChange={() => setDisc(d)} />
              {d ? `${d}% or more` : "Any"}
            </label>
          ))}
          <label className="flex gap-2 pt-2">
            <input
              type="checkbox"
              checked={inStock}
              onChange={(e) => setInStock(e.target.checked)}
            />{" "}
            In stock only
          </label>
        </div>
        <div className={box}>
          <p className="font-semibold">Color</p>
          <div className="flex flex-wrap gap-1">
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(color === c ? "" : c)}
                className={`rounded-full border px-2 py-0.5 text-xs ${color === c ? "border-accent bg-accent-soft" : ""}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        {sizes.length > 0 && (
          <div className={box}>
            <p className="font-semibold">Size</p>
            <div className="flex flex-wrap gap-1">
              {sizes.map((c) => (
                <button
                  key={c}
                  onClick={() => setSize(size === c ? "" : c)}
                  className={`rounded border px-2 py-0.5 text-xs ${size === c ? "border-accent bg-accent-soft" : ""}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}
      </aside>
      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-sm">
          <p className="text-muted-foreground">{filtered.length} products</p>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-full border bg-card px-3 py-1.5"
          >
            <option value="recommended">Recommended</option>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="popular">Most Popular</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
        {filtered.length ? (
          <Grid items={filtered.slice(0, limit)} />
        ) : (
          <p className="py-20 text-center text-muted-foreground">
            No products match these filters.
          </p>
        )}
        {filtered.length > limit && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setLimit((l) => l + 40)}
              className="rounded-full border-2 border-primary px-6 py-2 text-sm font-semibold hover:bg-primary hover:text-primary-foreground"
            >
              Load more
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
