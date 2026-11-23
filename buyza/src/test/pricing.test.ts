import { describe, expect, it } from "vitest";
import { applyCoupon, deliveryFee } from "@/lib/pricing";
describe("pricing", () => {
  it("free delivery from Rs. 2,999", () => {
    expect(deliveryFee(2999)).toBe(0);
    expect(deliveryFee(2998)).toBe(199);
  });
  it("BUYZA10 gives 10%", () => {
    expect(applyCoupon("buyza10", 5000)).toEqual({ ok: true, discount: 500 });
  });
  it("SAVE500 needs Rs. 5,000", () => {
    expect(applyCoupon("SAVE500", 4999).ok).toBe(false);
    expect(applyCoupon("SAVE500", 5000)).toEqual({ ok: true, discount: 500 });
  });
});
