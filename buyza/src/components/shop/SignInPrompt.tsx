import { Link } from "@tanstack/react-router";
export function SignInPrompt({ next, text }: { next: string; text: string }) {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <p className="text-5xl">👤</p>
      <h2 className="mt-4 text-2xl font-bold">{text}</h2>
      <Link
        to="/auth"
        search={{ next }}
        className="mt-6 inline-block rounded-full bg-accent-grad px-8 py-3 font-semibold text-accent-foreground"
      >
        Sign in / Create account
      </Link>
    </div>
  );
}
export const statusStyle: Record<string, string> = {
  pending: "bg-accent-soft text-accent",
  confirmed: "bg-secondary text-primary",
  shipped: "bg-primary text-primary-foreground",
  delivered: "bg-success text-primary-foreground",
  cancelled: "bg-muted text-muted-foreground",
};
