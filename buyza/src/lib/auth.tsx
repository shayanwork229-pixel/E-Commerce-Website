import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
type Auth = { user: User | null; loading: boolean; isAdmin: boolean };
const Ctx = createContext<Auth>({ user: null, loading: true, isAdmin: false });
const hasSupabaseConfig = Boolean(
  import.meta.env["VITE_SUPABASE_URL"] && import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"],
);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Auth>({ user: null, loading: true, isAdmin: false });
  useEffect(() => {
    if (!hasSupabaseConfig) {
      console.warn(
        "[Auth] Supabase is not configured. Storefront browsing is available, but sign-in and other backend features require Supabase environment variables.",
      );
      setState({ user: null, loading: false, isAdmin: false });
      return;
    }

    const load = async (user: User | null) => {
      let isAdmin = false;
      if (user) {
        const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
        isAdmin = !!data?.some((r) => r.role === "admin");
      }
      setState({ user, loading: false, isAdmin });
    };
    supabase.auth.getUser().then(({ data }) => load(data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED")
        void load(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);
  return <Ctx.Provider value={state}>{children}</Ctx.Provider>;
}
export const useAuth = () => useContext(Ctx);
