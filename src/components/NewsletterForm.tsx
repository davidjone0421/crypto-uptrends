import { useState } from "react";
import { Mail, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function NewsletterForm({
  source = "footer",
  variant = "default",
}: {
  source?: string;
  variant?: "default" | "compact";
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setMessage("Please enter a valid email.");
      return;
    }
    setStatus("loading");
    const { error } = await supabase.from("newsletter_subscribers").insert({ email, source });
    if (error) {
      if (error.code === "23505") {
        setStatus("success");
        setMessage("You're already subscribed — thanks!");
      } else {
        setStatus("error");
        setMessage("Something went wrong. Try again.");
      }
      return;
    }
    setStatus("success");
    setMessage("Subscribed! Check your inbox soon.");
    setEmail("");
  };

  if (status === "success") {
    return (
      <div className="flex items-center gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-400">
        <Check className="h-4 w-4 flex-shrink-0" /> {message}
      </div>
    );
  }

  return (
    <form onSubmit={submit} className={variant === "compact" ? "space-y-2" : "space-y-3"}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            maxLength={255}
            className="h-10 w-full rounded-md border border-border bg-[var(--surface)] pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-md bg-gradient-brand px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {status === "loading" ? "…" : "Subscribe"}
        </button>
      </div>
      {status === "error" && <p className="text-xs text-destructive">{message}</p>}
      <p className="text-[11px] text-muted-foreground">
        Daily crypto news. No spam. Unsubscribe anytime.
      </p>
    </form>
  );
}
