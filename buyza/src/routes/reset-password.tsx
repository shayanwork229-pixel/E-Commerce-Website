import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { seo } from "@/lib/seo";
export const Route = createFileRoute("/reset-password")({
  head: () => seo("Reset password", "Choose a new BUYZA password."),
  component: Reset,
});
function Reset() {
  const [pw, setPw] = useState("");
  const nav = useNavigate();
  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (pw.length < 8) {
            toast.error("At least 8 characters");
            return;
          }
          const { error } = await supabase.auth.updateUser({ password: pw });
          if (error) {
            toast.error(error.message);
            return;
          }
          toast.success("Password updated");
          nav({ to: "/account" });
        }}
        className="space-y-4 rounded-3xl bg-card p-8 shadow-lift"
      >
        <h1 className="text-3xl font-extrabold">Set a new password</h1>
        <input
          type="password"
          required
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="New password"
          className="w-full rounded-xl border px-4 py-3 text-sm"
        />
        <button className="w-full rounded-full bg-accent-grad py-3 font-semibold text-accent-foreground">
          Update password
        </button>
      </form>
    </div>
  );
}
