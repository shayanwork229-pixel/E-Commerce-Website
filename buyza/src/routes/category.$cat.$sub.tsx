import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { findCategory, products } from "@/lib/catalog";
import { PageHead } from "@/components/shop/ProductCard";
import { Listing } from "@/components/shop/Listing";
import { seo } from "@/lib/seo";
export const Route = createFileRoute("/category/$cat/$sub")({
  loader: ({ params }) => {
    const s = findCategory(params.cat)?.subs.find((x) => x.slug === params.sub);
    if (!s) throw notFound();
    return null;
  },
  head: ({ params }) => {
    const s = findCategory(params.cat)?.subs.find((x) => x.slug === params.sub);
    return seo(s?.name ?? "Shop", `Buy ${s?.name ?? "products"} online at BUYZA.`);
  },
  component: Sub,
});
function Sub() {
  const { cat, sub } = Route.useParams();
  const c = findCategory(cat)!;
  const s = c.subs.find((x) => x.slug === sub)!;
  return (
    <div>
      <PageHead title={s.name} sub={c.name} />
      <div className="mx-auto max-w-7xl px-4 pt-4 text-sm text-muted-foreground">
        <Link to="/">Home</Link> /{" "}
        <Link to="/category/$cat" params={{ cat }}>
          {c.name}
        </Link>{" "}
        / {s.name}
      </div>
      <Listing key={sub} items={products.filter((p) => p.sub === sub && p.category === cat)} />
    </div>
  );
}
