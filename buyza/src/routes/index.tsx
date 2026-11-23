import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  bestSellers,
  brands,
  bySlug,
  categories,
  deals,
  flashSale,
  newArrivals,
  pick,
  products,
} from "@/lib/catalog";
import { Grid, Section, Stars } from "@/components/shop/ProductCard";
import { Countdown } from "@/components/shop/Countdown";
import pools0 from "@/lib/images.json";
import { useStore } from "@/lib/store";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () =>
    seo(
      "Shop Smart, Live Better",
      "Pakistan's premium marketplace: flash sales, top brands, Cash on Delivery nationwide.",
    ),
  component: Home,
});

const pools = pools0 as Record<string, string[]>;
const slides = [
  {
    t: "Mega Tech Week",
    s: "Up to 60% off phones, earbuds & smart watches",
    to: "/category/mobiles-and-electronics",
    img: pools["smartphones"]![3]!,
  },
  {
    t: "Eid Fashion Edit",
    s: "Fresh lawn, kurtis & shalwar kameez — new drops daily",
    to: "/category/womens-fashion",
    img: pools["womens-dresses"]![0]!,
  },
  {
    t: "Home Glow-Up",
    s: "Furniture, decor & kitchen must-haves from Rs. 499",
    to: "/category/home-and-kitchen",
    img: pools["furniture"]![0]!,
  },
];
const reviews = [
  ["Ayesha K.", "Lahore", "Order arrived in 2 days, packaging was beautiful. COD made it so easy!"],
  ["Hamza R.", "Karachi", "Best prices on earbuds I found anywhere. Returns were painless too."],
  ["Fatima S.", "Islamabad", "Love the wishlist and how quickly I find things. My go-to app now."],
];

function Home() {
  const [i, setI] = useState(0);
  const { recent } = useStore();
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, []);
  const recentP = recent
    .map((id) => products.find((p) => p.id === id))
    .filter((p) => p !== undefined);
  const sl = slides[i]!;
  return (
    <div>
      <div className="mx-auto mt-4 grid max-w-7xl gap-4 px-4 lg:grid-cols-[240px_1fr]">
        <aside className="hidden rounded-2xl bg-card p-2 shadow-card lg:block">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to="/category/$cat"
              params={{ cat: c.slug }}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-accent-soft hover:text-accent"
            >
              {c.emoji} {c.name}
            </Link>
          ))}
        </aside>
        <div className="relative overflow-hidden rounded-3xl bg-hero text-primary-foreground">
          <div className="grid min-h-[340px] items-center md:grid-cols-2">
            <div
              key={i}
              className="animate-in fade-in slide-in-from-left-4 p-8 duration-700 md:p-12"
            >
              <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
                LIMITED TIME
              </span>
              <h1 className="mt-4 text-4xl font-extrabold md:text-6xl">{sl.t}</h1>
              <p className="mt-3 max-w-md opacity-85">{sl.s}</p>
              <Link
                to={sl.to as "/"}
                className="mt-6 inline-block rounded-full bg-accent-grad px-7 py-3 font-semibold text-accent-foreground shadow-lift transition hover:scale-105"
              >
                Shop now →
              </Link>
            </div>
            <img
              key={sl.img}
              src={sl.img}
              alt={sl.t}
              className="hidden h-full max-h-[380px] w-full object-contain p-6 drop-shadow-2xl animate-in fade-in duration-700 md:block"
            />
          </div>
          <div className="absolute bottom-4 left-8 flex gap-2">
            {slides.map((_, k) => (
              <button
                key={k}
                onClick={() => setI(k)}
                aria-label={`Slide ${k + 1}`}
                className={`h-2 rounded-full transition-all ${k === i ? "w-8 bg-accent" : "w-2 bg-primary-foreground/50"}`}
              />
            ))}
          </div>
        </div>
      </div>
      <Section
        title="⚡ Flash Sale"
        to="/flash-sale"
        extra={
          <div className="mr-auto ml-4 flex items-center gap-2 text-sm">
            Ends in <Countdown />
          </div>
        }
      >
        <Grid items={flashSale.slice(0, 5)} />
      </Section>
      <Section title="Featured Categories" to="/categories">
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-7">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to="/category/$cat"
              params={{ cat: c.slug }}
              className="flex flex-col items-center gap-2 rounded-2xl bg-card p-4 text-center text-xs font-medium shadow-card transition hover:-translate-y-1 hover:shadow-lift"
            >
              <span className="text-3xl">{c.emoji}</span>
              {c.name}
            </Link>
          ))}
        </div>
      </Section>
      <Section title="Trending Now" to="/best-sellers">
        <Grid
          items={pick(
            products.filter((p) => p.rating > 4.5),
            3,
            10,
          )}
        />
      </Section>
      <Section title="Top Deals" to="/deals">
        <Grid items={deals.slice(0, 5)} />
      </Section>
      <div className="mx-auto mt-10 grid max-w-7xl gap-4 px-4 md:grid-cols-2">
        <Link
          to="/deals"
          className="rounded-3xl bg-accent-grad p-8 text-accent-foreground shadow-lift transition hover:scale-[1.01]"
        >
          <p className="text-sm font-bold">SPECIAL OFFER</p>
          <p className="font-display text-3xl font-extrabold">Extra 10% off with BUYZA10</p>
          <p className="mt-2 opacity-90">On your entire order. Tap to shop deals.</p>
        </Link>
        <Link
          to="/category/$cat"
          params={{ cat: "grocery-and-food" }}
          className="rounded-3xl bg-hero p-8 text-primary-foreground shadow-lift transition hover:scale-[1.01]"
        >
          <p className="text-sm font-bold text-accent">GROCERY</p>
          <p className="font-display text-3xl font-extrabold">Pantry restock, delivered</p>
          <p className="mt-2 opacity-80">Rice, tea, snacks & more at everyday low prices.</p>
        </Link>
      </div>
      <Section title="Best Sellers" to="/best-sellers">
        <Grid items={bestSellers.slice(0, 10)} />
      </Section>
      <Section title="New Arrivals" to="/new-arrivals">
        <Grid items={newArrivals.slice(0, 5)} />
      </Section>
      <Section title="Popular Brands" to="/brands">
        <div className="flex flex-wrap gap-3">
          {brands.map((b) => (
            <Link
              key={b}
              to="/brands"
              hash={b}
              className="rounded-2xl bg-card px-6 py-4 font-display text-lg font-bold text-primary shadow-card hover:text-accent"
            >
              {b}
            </Link>
          ))}
        </div>
      </Section>
      <Section title="Recommended For You">
        <Grid items={pick(products, 77, 10)} />
      </Section>
      {recentP.length > 0 && (
        <Section title="Recently Viewed">
          <Grid items={recentP.slice(0, 5)} />
        </Section>
      )}
      <Section title="Happy Customers">
        <div className="grid gap-4 md:grid-cols-3">
          {reviews.map(([n, c, t]) => (
            <div key={n} className="rounded-2xl bg-card p-6 shadow-card">
              <Stars r={5} />
              <p className="mt-3 text-sm">"{t}"</p>
              <p className="mt-4 text-sm font-semibold">
                {n} <span className="font-normal text-muted-foreground">· {c}</span>
              </p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
void bySlug;
