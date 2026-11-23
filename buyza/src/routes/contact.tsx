import { createFileRoute } from "@tanstack/react-router";
import { PageHead } from "@/components/shop/ProductCard";
import { seo } from "@/lib/seo";
export const Route = createFileRoute("/contact")({
  head: () => seo("Contact Us", "Get in touch with BUYZA customer support."),
  component: () => (
    <div>
      <PageHead title="Contact Us" sub="We usually reply within a few hours." />
      <div className="mx-auto grid max-w-4xl gap-4 px-4 py-10 sm:grid-cols-3">
        {[
          ["📧", "Email", "support@buyza.pk", "mailto:support@buyza.pk"],
          ["📞", "Phone", "0300-1234567", "tel:+923001234567"],
          ["💬", "WhatsApp", "Chat with us", "https://wa.me/923001234567"],
        ].map(([e, t, v, h]) => (
          <a
            key={t}
            href={h}
            className="rounded-2xl bg-card p-6 text-center shadow-card transition hover:-translate-y-1 hover:shadow-lift"
          >
            <p className="text-3xl">{e}</p>
            <p className="mt-2 font-bold">{t}</p>
            <p className="text-sm text-accent">{v}</p>
          </a>
        ))}
        <p className="text-center text-sm text-muted-foreground sm:col-span-3">
          Support hours: Mon–Sat, 9am–9pm PKT
        </p>
      </div>
    </div>
  ),
});
