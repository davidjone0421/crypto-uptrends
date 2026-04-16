import { cn } from "@/lib/utils";

type AdSlotProps = {
  variant: "leaderboard" | "in-article" | "sidebar" | "mobile-banner";
  className?: string;
  label?: string;
};

/**
 * Google AdSense-compliant ad placeholder.
 * Each variant has fixed dimensions matching standard AdSense unit sizes,
 * with proper margins so they never overlap content.
 *
 * To go live: drop AdSense <ins class="adsbygoogle" .../> code inside
 * the placeholder div and remove the dashed border styling.
 */
export function AdSlot({ variant, className, label }: AdSlotProps) {
  const sizes: Record<AdSlotProps["variant"], string> = {
    leaderboard: "h-[90px] md:h-[90px] max-w-[728px]",
    "mobile-banner": "h-[100px] max-w-[320px] md:hidden",
    "in-article": "h-[250px] max-w-[336px]",
    sidebar: "h-[600px] max-w-[300px]",
  };

  const labels: Record<AdSlotProps["variant"], string> = {
    leaderboard: "Advertisement · 728×90",
    "mobile-banner": "Advertisement · 320×100",
    "in-article": "Advertisement · 336×280",
    sidebar: "Advertisement · 300×600",
  };

  return (
    <div
      className={cn(
        "mx-auto my-6 flex w-full items-center justify-center rounded-md border border-dashed bg-[var(--ad-bg)] text-xs text-muted-foreground",
        sizes[variant],
        className,
      )}
      role="complementary"
      aria-label="Advertisement"
      data-ad-slot={variant}
    >
      <span className="font-medium tracking-wider uppercase">
        {label ?? labels[variant]}
      </span>
    </div>
  );
}
