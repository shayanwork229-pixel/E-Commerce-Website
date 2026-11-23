import { createFileRoute, Link } from "@tanstack/react-router";
import { products } from "@/lib/catalog";
import { useStore } from "@/lib/store";
import { Grid, PageHead } from "@/components/shop/ProductCard";
import { seo } from "@/lib/seo";
export const Route = createFileRoute("/wishlist")({
  head: () => seo("Wishlist", "Products you've saved on BUYZA."),
  component: function WishlistPage() {
    const { wishlist } = useStore();
    const items = products.filter((p) => wishlist.includes(p.id));
    return (
      <div>
        <PageHead title="My Wishlist ♥" />
        <div className="mx-auto max-w-7xl px-4 py-8">
          {items.length ? (
            <Grid items={items} />
          ) : (
            <p className="py-16 text-center text-muted-foreground">
              No saved items yet.{" "}
              <Link to="/" className="text-accent underline">
                Start exploring
              </Link>
            </p>
          )}
        </div>
      </div>
    );
  },
});
