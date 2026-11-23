import { createFileRoute } from "@tanstack/react-router";
import { PageHead } from "@/components/shop/ProductCard";
import { seo } from "@/lib/seo";
export const Route = createFileRoute("/about")({
  head: () => seo("About Us", "BUYZA's story and promise to Pakistani shoppers."),
  component: () => (
    <div>
      <PageHead title="About BUYZA" sub="Shop Smart, Live Better." />
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-10">
        <p className="text-lg">
          BUYZA was built with one idea: shopping online in Pakistan should feel joyful, honest and
          effortless. From Karachi to Gilgit, we bring thousands of genuine products to your door
          with Cash on Delivery and easy returns.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ["🛍️", "Huge selection", "Electronics to groceries, all in one place."],
            ["🤝", "Trust first", "Genuine products and transparent prices."],
            ["🚚", "Nationwide", "Fast delivery to 300+ cities."],
          ].map(([e, t, d]) => (
            <div key={t} className="rounded-2xl bg-card p-6 shadow-card">
              <p className="text-3xl">{e}</p>
              <p className="mt-2 font-bold">{t}</p>
              <p className="text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
});
