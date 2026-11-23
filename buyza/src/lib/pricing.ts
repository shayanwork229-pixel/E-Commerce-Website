export const FREE_SHIPPING_MIN = 2999;
export const DELIVERY_FEE = 199;
export const deliveryFee = (amount: number) =>
  amount >= FREE_SHIPPING_MIN || amount <= 0 ? 0 : DELIVERY_FEE;
const coupons: Record<string, { type: "pct" | "fixed"; value: number; min: number }> = {
  BUYZA10: { type: "pct", value: 10, min: 0 },
  SAVE500: { type: "fixed", value: 500, min: 5000 },
};
export function applyCoupon(
  code: string,
  subtotal: number,
): { ok: true; discount: number } | { ok: false; error: string } {
  const c = coupons[code.trim().toUpperCase()];
  if (!c) return { ok: false, error: "Invalid coupon code" };
  if (subtotal < c.min) return { ok: false, error: `Minimum order Rs. ${c.min.toLocaleString()}` };
  return {
    ok: true,
    discount: c.type === "pct" ? Math.round((subtotal * c.value) / 100) : c.value,
  };
}
