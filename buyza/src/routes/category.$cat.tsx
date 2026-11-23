import { createFileRoute, Link, notFound, Outlet, useMatch } from "@tanstack/react-router";
import { findCategory, products } from "@/lib/catalog";
import { PageHead } from "@/components/shop/ProductCard";
import { Listing } from "@/components/shop/Listing";
import { seo } from "@/lib/seo";
export const Route = createFileRoute("/category/$cat")({
  loader: ({ params }) => {
    const c = findCategory(params.cat);
    if (!c) throw notFound();
    return { slug: c.slug };
  },
  head: ({ params }) => {
    const c = findCategory(params.cat);
    return seo(c?.name ?? "Category", `Shop ${c?.name ?? ""} at the best prices in Pakistan.`);
  },
  component: Cat,
});
function Cat() {
  const { cat } = Route.useParams();
  const c = findCategory(cat)!;
  const child = useMatch({ from: "/category/$cat/$sub", shouldThrow: false });
  if (child) return <Outlet />;
  return (
    <div>
      <PageHead title={`${c.emoji} ${c.name}`} />
      <div className="mx-auto flex max-w-7xl flex-wrap gap-2 px-4 pt-6">
        {c.subs.map((s) => (
          <Link
            key={s.slug}
            to="/category/$cat/$sub"
            params={{ cat: c.slug, sub: s.slug }}
            className="rounded-full bg-card px-4 py-2 text-sm shadow-card hover:text-accent"
          >
            {s.name}
          </Link>
        ))}
      </div>
      <Listing key={cat} items={products.filter((p) => p.category === cat)} />
    </div>
  );
}
