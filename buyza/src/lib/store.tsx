import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
export type CartItem = { id: string; qty: number; color?: string; size?: string };
type Store = {
  cart: CartItem[];
  wishlist: string[];
  recent: string[];
  addToCart: (id: string, qty?: number, opts?: { color?: string; size?: string }) => void;
  setQty: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  toggleWish: (id: string) => void;
  addRecent: (id: string) => void;
};
const Ctx = createContext<Store | null>(null);
function usePersist<T>(key: string, init: T) {
  const [v, setV] = useState<T>(init);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const s = localStorage.getItem(key);
      if (s) setV(JSON.parse(s));
    } catch {
      // Keep the initial value when saved data is unavailable or invalid.
    }
    setReady(true);
  }, [key]);
  useEffect(() => {
    if (ready) localStorage.setItem(key, JSON.stringify(v));
  }, [key, v, ready]);
  return [v, setV] as const;
}
export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = usePersist<CartItem[]>("buyza-cart", []);
  const [wishlist, setWish] = usePersist<string[]>("buyza-wish", []);
  const [recent, setRecent] = usePersist<string[]>("buyza-recent", []);
  const value: Store = {
    cart,
    wishlist,
    recent,
    addToCart: (id, qty = 1, opts) => {
      setCart((c) => {
        const f = c.find((i) => i.id === id);
        return f
          ? c.map((i) => (i.id === id ? { ...i, qty: i.qty + qty } : i))
          : [...c, { id, qty, ...opts }];
      });
      toast.success("Added to cart");
    },
    setQty: (id, qty) =>
      setCart((c) => c.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i))),
    removeFromCart: (id) => setCart((c) => c.filter((i) => i.id !== id)),
    clearCart: () => setCart([]),
    toggleWish: (id) =>
      setWish((w) => {
        const has = w.includes(id);
        toast(has ? "Removed from wishlist" : "Saved to wishlist ♥");
        return has ? w.filter((x) => x !== id) : [...w, id];
      }),
    addRecent: (id) => setRecent((r) => [id, ...r.filter((x) => x !== id)].slice(0, 12)),
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export const useStore = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("no store");
  return c;
};
