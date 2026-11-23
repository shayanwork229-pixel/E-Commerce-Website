import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { products } from "@/lib/catalog";
import { applyCoupon, deliveryFee } from "@/lib/pricing";
import { provinces } from "@/lib/pakistan";

const input = z.object({
  items: z
    .array(
      z.object({
        id: z.string().max(10),
        qty: z.number().int().min(1).max(20),
        color: z.string().max(40).optional(),
        size: z.string().max(10).optional(),
      }),
    )
    .min(1)
    .max(50),
  coupon: z.string().max(30).optional(),
  address: z.object({
    full_name: z.string().trim().min(2).max(80),
    phone: z
      .string()
      .trim()
      .regex(/^(\+92|0)3\d{2}-?\d{7}$/, "Enter a valid Pakistani mobile number"),
    province: z.string(),
    city: z.string(),
    area: z.string().trim().min(3).max(200),
    postal_code: z.string().trim().max(10).optional(),
  }),
  saveAddress: z.boolean().optional(),
});

export const placeOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => input.parse(d))
  .handler(async ({ data, context }) => {
    const a = data.address;
    if (!provinces[a.province]?.includes(a.city))
      throw new Error("Please choose a valid province and city");
    const lines = data.items.map((i) => {
      const p = products.find((x) => x.id === i.id);
      if (!p) throw new Error("A product in your cart is no longer available");
      if (p.stock < i.qty) throw new Error(`${p.name} has only ${p.stock} in stock`);
      return { p, i };
    });
    const subtotal = lines.reduce((s, l) => s + l.p.price * l.i.qty, 0);
    let discount = 0;
    if (data.coupon) {
      const c = applyCoupon(data.coupon, subtotal);
      if (!c.ok) throw new Error(c.error);
      discount = c.discount;
    }
    const fee = deliveryFee(subtotal - discount);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: context.userId,
        payment_method: "cod",
        subtotal,
        discount,
        delivery_fee: fee,
        total: subtotal - discount + fee,
        coupon_code: data.coupon ? data.coupon.toUpperCase() : null,
        ...a,
        postal_code: a.postal_code || null,
      })
      .select("id, order_number")
      .single();
    if (error || !order) throw new Error("Could not place your order. Please try again.");
    const { error: e2 } = await supabaseAdmin.from("order_items").insert(
      lines.map(({ p, i }) => ({
        order_id: order.id,
        product_id: p.id,
        product_name: p.name,
        image: p.images[0] ?? null,
        unit_price: p.price,
        quantity: i.qty,
        color: i.color ?? null,
        size: i.size ?? null,
      })),
    );
    if (e2) {
      await supabaseAdmin.from("orders").delete().eq("id", order.id);
      throw new Error("Could not place your order. Please try again.");
    }
    if (data.saveAddress)
      await context.supabase
        .from("addresses")
        .insert({ user_id: context.userId, ...a, postal_code: a.postal_code || null });
    return { orderNumber: order.order_number };
  });

export const cancelOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: o } = await supabaseAdmin
      .from("orders")
      .select("user_id, status")
      .eq("id", data.id)
      .single();
    if (!o || o.user_id !== context.userId) throw new Error("Order not found");
    if (o.status !== "pending" && o.status !== "confirmed")
      throw new Error("This order has already shipped and can't be cancelled");
    await supabaseAdmin.from("orders").update({ status: "cancelled" }).eq("id", data.id);
    return { ok: true };
  });
