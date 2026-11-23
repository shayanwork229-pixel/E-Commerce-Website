import { createFileRoute } from "@tanstack/react-router";
import { deals } from "@/lib/catalog";
import { PageHead } from "@/components/shop/ProductCard";
import { Listing } from "@/components/shop/Listing";
import { seo } from "@/lib/seo";
export const Route = createFileRoute("/deals")({
  head: () => seo("Today's Deals", "Top discounts of 30% and more across every category."),
  component: () => (
    <div>
      <PageHead title="Today's Deals" sub="Top discounts of 30% and more across every category." />
      <Listing items={deals} showCategory />
    </div>
  ),
});
