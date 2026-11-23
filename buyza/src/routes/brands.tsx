import { createFileRoute } from "@tanstack/react-router";
import { brands, products } from "@/lib/catalog";
import { Grid, PageHead } from "@/components/shop/ProductCard";
import { seo } from "@/lib/seo";
export const Route = createFileRoute("/brands")({
  head: () => seo("Brands", "Shop popular brands on BUYZA."),
  component: () => (
    <div>
      <PageHead title="Popular Brands" sub="Genuine products from brands you trust" />
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex flex-wrap gap-2">
          {brands.map((b) => (
            <a
              key={b}
              href={`#${b}`}
              className="rounded-full bg-card px-4 py-2 text-sm font-semibold shadow-card hover:text-accent"
            >
              {b}
            </a>
          ))}
        </div>
        {brands.map((b) => {
          const ps = products.filter((p) => p.brand === b).sort((x, y) => y.sold - x.sold);
          return (
            <section key={b} id={b} className="mt-10 scroll-mt-32">
              <h2 className="mb-4 text-2xl font-bold">
                {b}{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  · {ps.length} products
                </span>
              </h2>
              <Grid items={ps.slice(0, 5)} />
            </section>
          );
        })}
      </div>
    </div>
  ),
});
