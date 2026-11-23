import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHead } from "@/components/shop/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { pkr } from "@/lib/catalog";
import { seo } from "@/lib/seo";
export const Route = createFileRoute("/track-order")({
  head: () => seo("Track Order", "Track your BUYZA order status."),
  component: Track,
});
const steps = ["pending", "confirmed", "shipped", "delivered"];
function Track() {
  const [id, setId] = useState("");
  const [phone, setPhone] = useState("");
  const [res, setRes] = useState<
    | { order_number: string; status: string; total: number; city: string; created_at: string }
    | null
    | "none"
  >(null);
  const [busy, setBusy] = useState(false);
  return (
    <div>
      <PageHead
        title="Track Your Order"
        sub="Enter your order number and the phone number used at checkout"
      />
      <div className="mx-auto max-w-lg px-4 py-12">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            const { data } = await supabase.rpc("track_order", { _number: id, _phone: phone });
            setRes(data?.[0] ?? "none");
            setBusy(false);
          }}
          className="space-y-3"
        >
          <input
            required
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="Order number e.g. BZ-102938"
            className="w-full rounded-full border bg-card px-4 py-3"
          />
          <input
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone number"
            className="w-full rounded-full border bg-card px-4 py-3"
          />
          <button
            disabled={busy}
            className="w-full rounded-full bg-accent-grad py-3 font-semibold text-accent-foreground"
          >
            {busy ? "Checking…" : "Track"}
          </button>
        </form>
        {res === "none" && (
          <p className="mt-6 rounded-2xl bg-card p-6 text-center shadow-card">
            No order matches that number and phone.
          </p>
        )}
        {res && res !== "none" && (
          <div className="mt-6 rounded-2xl bg-card p-6 shadow-card">
            <p className="font-display text-xl font-bold">{res.order_number}</p>
            <p className="text-sm text-muted-foreground">
              {pkr(res.total)} · to {res.city} ·{" "}
              {new Date(res.created_at).toLocaleDateString("en-PK")}
            </p>
            {res.status === "cancelled" ? (
              <p className="mt-4 font-semibold text-destructive">This order was cancelled.</p>
            ) : (
              <div className="mt-5 flex justify-between">
                {steps.map((s, i) => {
                  const on = i <= steps.indexOf(res.status);
                  return (
                    <div
                      key={s}
                      className="flex flex-1 flex-col items-center gap-1 text-xs capitalize"
                    >
                      <span className={`h-4 w-4 rounded-full ${on ? "bg-accent" : "bg-muted"}`} />
                      {s}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
