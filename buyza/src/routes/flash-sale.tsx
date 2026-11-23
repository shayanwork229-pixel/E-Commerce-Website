import { createFileRoute } from "@tanstack/react-router";
import { flashSale } from "@/lib/catalog";
import { Listing } from "@/components/shop/Listing";
import { Countdown } from "@/components/shop/Countdown";
import { seo } from "@/lib/seo";
export const Route = createFileRoute("/flash-sale")({
  head: () => seo("Flash Sale", "Limited-time offers of 45% off and more — ends at midnight."),
  component: () => (
    <div>
      <div className="bg-accent-grad text-accent-foreground">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-10">
          <div>
            <h1 className="text-4xl font-extrabold md:text-5xl">⚡ Flash Sale</h1>
            <p className="mt-2">45%+ off. Prices reset at midnight.</p>
          </div>
          <div className="text-center">
            <p className="mb-1 text-sm font-semibold">Ends in</p>
            <Countdown />
          </div>
        </div>
      </div>
      <Listing items={flashSale} showCategory />
    </div>
  ),
});
