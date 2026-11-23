import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
export function Footer() {
  const [e, setE] = useState("");
  return (
    <footer className="mt-16 bg-primary text-primary-foreground">
      <div className="bg-accent-grad">
        <form
          onSubmit={(ev) => {
            ev.preventDefault();
            if (!/^\S+@\S+\.\S+$/.test(e)) {
              toast.error("Enter a valid email");
              return;
            }
            toast.success("Subscribed! Watch your inbox for deals.");
            setE("");
          }}
          className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 py-6 text-accent-foreground md:flex-row"
        >
          <p className="flex-1 font-display text-xl font-bold">
            Get exclusive deals in your inbox 💌
          </p>
          <input
            value={e}
            onChange={(x) => setE(x.target.value)}
            placeholder="you@email.com"
            className="w-full rounded-full bg-card px-4 py-2 text-sm text-foreground outline-none md:w-80"
          />
          <button className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground">
            Subscribe
          </button>
        </form>
      </div>
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 md:grid-cols-4 text-sm">
        <div>
          <p className="font-display text-2xl font-extrabold">
            BUY<span className="text-accent">ZA</span>
          </p>
          <p className="mt-2 opacity-80">
            Shop Smart, Live Better. Pakistan's friendliest marketplace.
          </p>
          <div className="mt-4 flex gap-3 opacity-80">
            <a href="https://facebook.com">Facebook</a>
            <a href="https://instagram.com">Instagram</a>
            <a href="https://tiktok.com">TikTok</a>
          </div>
        </div>
        <Col
          title="Customer Service"
          links={[
            ["/help", "Help Center & FAQs"],
            ["/track-order", "Track Order"],
            ["/contact", "Contact Us"],
            ["/policies/returns", "Return & Refund"],
          ]}
        />
        <Col
          title="About"
          links={[
            ["/about", "About BUYZA"],
            ["/brands", "Brands"],
            ["/policies/privacy", "Privacy Policy"],
            ["/policies/terms", "Terms & Conditions"],
          ]}
        />
        <Col
          title="Shopping"
          links={[
            ["/policies/shipping", "Shipping Policy"],
            ["/policies/payment", "Payment Information"],
            ["/deals", "Today's Deals"],
            ["/categories", "All Categories"],
          ]}
        />
      </div>
      <p className="border-t border-primary-foreground/10 py-4 text-center text-xs opacity-70">
        © 2026 BUYZA. All rights reserved.
      </p>
    </footer>
  );
}
function Col({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <p className="mb-3 font-semibold">{title}</p>
      <ul className="space-y-2 opacity-80">
        {links.map(([to, l]) => (
          <li key={to}>
            <Link to={to as "/"} className="hover:text-accent">
              {l}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
