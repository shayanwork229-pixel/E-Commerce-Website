import { createFileRoute } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PageHead } from "@/components/shop/ProductCard";
import { seo } from "@/lib/seo";
const faqs: [string, string][] = [
  [
    "How long does delivery take?",
    "2–4 working days in major cities, 4–7 days elsewhere in Pakistan.",
  ],
  ["How much is delivery?", "Free on orders of Rs. 2,999 or more. Otherwise Rs. 199."],
  [
    "Which payment methods are available?",
    "Cash on Delivery everywhere. Bank Transfer, Easypaisa and JazzCash will be added once those payment services are connected.",
  ],
  [
    "How do returns work?",
    "You can return most items within 7 days of delivery in original condition. Refunds are processed within 5–7 working days.",
  ],
  [
    "How do I use a coupon?",
    "Enter the code in your cart and press Apply. The discount shows in your order summary.",
  ],
  ["Can I cancel an order?", "Yes, any time before it is shipped."],
];
export const Route = createFileRoute("/help")({
  head: () => seo("Help Center", "FAQs on shipping, returns, payments and support."),
  component: () => (
    <div>
      <PageHead title="Help Center" sub="Answers to the most common questions" />
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Accordion type="single" collapsible className="rounded-2xl bg-card px-6 shadow-card">
          {faqs.map(([q, a]) => (
            <AccordionItem key={q} value={q}>
              <AccordionTrigger>{q}</AccordionTrigger>
              <AccordionContent>{a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  ),
});
