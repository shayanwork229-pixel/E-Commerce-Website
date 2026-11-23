import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/lib/auth";
import { seo } from "@/lib/seo";
export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>) => ({
    next:
      typeof s["next"] === "string" && s["next"].startsWith("/") && !s["next"].startsWith("//")
        ? s["next"]
        : "/account",
  }),
  head: () => seo("Sign in", "Sign in or create your BUYZA account."),
  component: AuthPage,
});
function AuthPage() {
  const { next } = Route.useSearch();
  const nav = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState<"in" | "up" | "forgot">("in");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState("");
  useEffect(() => {
    if (user) nav({ to: next as "/" });
  }, [user, next, nav]);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "in") {
        const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
        if (error) throw error;
        toast.success("Welcome back!");
      } else if (mode === "up") {
        if (pw.length < 8) throw new Error("Password must be at least 8 characters");
        const { error } = await supabase.auth.signUp({
          email,
          password: pw,
          options: { emailRedirectTo: window.location.origin + next, data: { full_name: name } },
        });
        if (error) throw error;
        setSent(
          "We've sent a confirmation link to " + email + ". Click it to activate your account.",
        );
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + "/reset-password",
        });
        if (error) throw error;
        setSent("Password reset link sent to " + email + ".");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };
  const google = async () => {
    const r = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/auth?next=" + encodeURIComponent(next),
    });
    if (r.error) toast.error("Google sign-in failed");
  };
  const inp = "w-full rounded-xl border bg-card px-4 py-3 text-sm outline-none focus:border-accent";
  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-3xl bg-card p-8 shadow-lift">
        <h1 className="text-3xl font-extrabold">
          {mode === "in" ? "Welcome back" : mode === "up" ? "Create account" : "Reset password"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Shop Smart, Live Better.</p>
        {sent ? (
          <p className="mt-6 rounded-xl bg-accent-soft p-4 text-sm">{sent}</p>
        ) : (
          <>
            <form onSubmit={submit} className="mt-6 space-y-3">
              {mode === "up" && (
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  className={inp}
                />
              )}
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className={inp}
              />
              {mode !== "forgot" && (
                <input
                  required
                  type="password"
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  placeholder="Password"
                  className={inp}
                />
              )}
              <button
                disabled={busy}
                className="w-full rounded-full bg-accent-grad py-3 font-semibold text-accent-foreground disabled:opacity-50"
              >
                {busy
                  ? "Please wait…"
                  : mode === "in"
                    ? "Sign in"
                    : mode === "up"
                      ? "Create account"
                      : "Send reset link"}
              </button>
            </form>
            {mode !== "forgot" && (
              <>
                <div className="my-4 text-center text-xs text-muted-foreground">or</div>
                <button
                  onClick={google}
                  className="flex w-full items-center justify-center gap-2.5 rounded-full border border-[#747775] bg-[#FFFFFF] py-3 text-sm font-medium text-[#1F1F1F]"
                >
                  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.730-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.160-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
                    />
                  </svg>
                  Continue with Google
                </button>
              </>
            )}
          </>
        )}
        <div className="mt-6 space-y-1 text-center text-sm">
          {mode === "in" && (
            <>
              <button
                onClick={() => {
                  setMode("forgot");
                  setSent("");
                }}
                className="text-muted-foreground hover:text-accent"
              >
                Forgot password?
              </button>
              <p>
                New to BUYZA?{" "}
                <button
                  onClick={() => {
                    setMode("up");
                    setSent("");
                  }}
                  className="font-semibold text-accent"
                >
                  Create account
                </button>
              </p>
            </>
          )}
          {mode !== "in" && (
            <p>
              Already have an account?{" "}
              <button
                onClick={() => {
                  setMode("in");
                  setSent("");
                }}
                className="font-semibold text-accent"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
