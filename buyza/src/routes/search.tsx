import { createFileRoute } from "@tanstack/react-router";
import { searchProducts } from "@/lib/catalog";
import { PageHead } from "@/components/shop/ProductCard";
import { Listing } from "@/components/shop/Listing";
import { seo } from "@/lib/seo";
export const Route = createFileRoute("/search")({
  validateSearch: (s: Record<string, unknown>) => ({ q: typeof s["q"] === "string" ? s["q"] : "" }),
  head: () => seo("Search", "Search products on BUYZA."),
  component: function SearchPage() {
    const { q } = Route.useSearch();
    const r = searchProducts(q);
    return (
      <div>
        <PageHead title={`Results for "${q}"`} sub={`${r.length} products found`} />
        {r.length ? (
          <Listing key={q} items={r} showCategory />
        ) : (
          <p className="py-20 text-center text-muted-foreground">
            Nothing found. Try "earbuds", "lawn" or "sneakers".
          </p>
        )}
      </div>
    );
  },
});
