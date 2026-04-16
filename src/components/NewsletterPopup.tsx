import { useEffect, useState } from "react";
import { X, TrendingUp } from "lucide-react";
import { NewsletterForm } from "./NewsletterForm";

const STORAGE_KEY = "cu_newsletter_popup_dismissed";

export function NewsletterPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(STORAGE_KEY)) return;
    const t = setTimeout(() => setOpen(true), 15_000);
    return () => clearTimeout(t);
  }, []);

  const close = () => {
    setOpen(false);
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, "1");
  };

  if (!open) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex justify-end p-4 sm:bottom-4 sm:right-4 sm:inset-x-auto">
      <div className="relative w-full max-w-sm overflow-hidden rounded-lg border border-border bg-card shadow-2xl">
        <button
          aria-label="Dismiss"
          onClick={close}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="bg-gradient-brand p-4">
          <TrendingUp className="h-6 w-6 text-primary-foreground" />
        </div>
        <div className="p-5">
          <h3 className="font-display text-lg font-bold">Don't miss the next pump</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Get daily crypto market updates delivered to your inbox.
          </p>
          <div className="mt-4">
            <NewsletterForm source="popup" variant="compact" />
          </div>
        </div>
      </div>
    </div>
  );
}
