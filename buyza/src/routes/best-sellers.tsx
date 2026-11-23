import { createFileRoute } from "@tanstack/react-router";
import { bestSellers } from "@/lib/catalog";
import { PageHead } from "@/components/shop/ProductCard";
import { Listing } from "@/components/shop/Listing";
import { seo } from "@/lib/seo";
export const Route = createFileRoute("/best-sellers")({
  head: () => seo("Best Sellers", "Our most-sold products, ranked by units sold."),
  component: () => (
    <div>
      <PageHead title="Best Sellers" sub="Our most-sold products, ranked by units sold." />
      <Listing items={bestSellers} showCategory />
    </div>
  ),
});
