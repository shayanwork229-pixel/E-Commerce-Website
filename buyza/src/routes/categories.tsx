import { createFileRoute, Link } from "@tanstack/react-router";
import { categories, products } from "@/lib/catalog";
import { PageHead } from "@/components/shop/ProductCard";
import { seo } from "@/lib/seo";
export const Route = createFileRoute("/categories")({
  head: () => seo("All Categories", "Browse every BUYZA category and subcategory."),
  component: () => (
    <div>
      <PageHead
        title="All Categories"
        sub={`${products.length.toLocaleString()} products across ${categories.length} departments`}
      />
      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-8 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <div key={c.slug} className="rounded-2xl bg-card p-5 shadow-card">
            <Link
              to="/category/$cat"
              params={{ cat: c.slug }}
              className="font-display text-xl font-bold hover:text-accent"
            >
              {c.emoji} {c.name}
            </Link>
            <div className="mt-3 flex flex-wrap gap-2">
              {c.subs.map((s) => (
                <Link
                  key={s.slug}
                  to="/category/$cat/$sub"
                  params={{ cat: c.slug, sub: s.slug }}
                  className="rounded-full bg-secondary px-3 py-1 text-xs hover:bg-accent-soft hover:text-accent"
                >
                  {s.name}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
});
