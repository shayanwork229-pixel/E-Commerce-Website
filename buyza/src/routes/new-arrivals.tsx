import { createFileRoute } from "@tanstack/react-router";
import { newArrivals } from "@/lib/catalog";
import { PageHead } from "@/components/shop/ProductCard";
import { Listing } from "@/components/shop/Listing";
import { seo } from "@/lib/seo";
export const Route = createFileRoute("/new-arrivals")({
  head: () => seo("New Arrivals", "Freshly added products from all categories."),
  component: () => (
    <div>
      <PageHead title="New Arrivals" sub="Freshly added products from all categories." />
      <Listing items={newArrivals} showCategory />
    </div>
  ),
});
