import { createFileRoute, notFound } from "@tanstack/react-router";
import { PageHead } from "@/components/shop/ProductCard";
import { seo } from "@/lib/seo";
const pages: Record<string, [string, string[]]> = {
  privacy: [
    "Privacy Policy",
    [
      "We collect only the information needed to process your orders, such as name, phone and address.",
      "We never sell your personal data. Payment details are handled by secure payment partners.",
      "You can ask us to delete your account data at any time by contacting support.",
    ],
  ],
  terms: [
    "Terms & Conditions",
    [
      "By using BUYZA you agree to provide accurate information when ordering.",
      "Prices and availability may change without notice. Orders are confirmed once dispatched.",
      "BUYZA may cancel orders suspected of fraud.",
    ],
  ],
  returns: [
    "Return & Refund Policy",
    [
      "Most items can be returned within 7 days of delivery in original condition and packaging.",
      "Innerwear, perishable grocery and personal care items cannot be returned once opened.",
      "Refunds are issued within 5–7 working days after inspection.",
    ],
  ],
  shipping: [
    "Shipping Policy",
    [
      "We deliver across Pakistan. Delivery is free on orders of Rs. 2,999 or more; otherwise Rs. 199.",
      "Major cities: 2–4 working days. Other areas: 4–7 working days.",
      "You'll receive tracking updates once your parcel ships.",
    ],
  ],
  payment: [
    "Payment Information",
    [
      "Cash on Delivery is available nationwide.",
      "Bank Transfer, Easypaisa and JazzCash will be shown at checkout once those services are connected.",
      "We never ask for your card PIN or OTP over the phone.",
    ],
  ],
};
export const Route = createFileRoute("/policies/$page")({
  loader: ({ params }) => {
    if (!pages[params.page]) throw notFound();
    return null;
  },
  head: ({ params }) =>
    seo(pages[params.page]?.[0] ?? "Policy", `BUYZA ${pages[params.page]?.[0] ?? "policy"}.`),
  component: function PolicyPage() {
    const { page } = Route.useParams();
    const [t, ps] = pages[page]!;
    return (
      <div>
        <PageHead title={t} />
        <div className="mx-auto max-w-3xl space-y-4 px-4 py-10">
          {ps.map((p) => (
            <p key={p} className="rounded-2xl bg-card p-5 shadow-card">
              {p}
            </p>
          ))}
        </div>
      </div>
    );
  },
});
