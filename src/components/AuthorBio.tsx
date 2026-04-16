import { Twitter } from "lucide-react";
import type { Author } from "@/lib/articles";

export function AuthorBio({ author }: { author: Author }) {
  return (
    <div className="mt-10 flex gap-4 rounded-lg border border-border bg-[var(--surface)] p-5">
      {author.avatar_url && (
        <img
          src={author.avatar_url}
          alt={author.name}
          width={64}
          height={64}
          className="h-16 w-16 flex-shrink-0 rounded-full border border-border object-cover"
        />
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="font-display font-bold">{author.name}</p>
          {author.twitter_handle && (
            <a
              href={`https://twitter.com/${author.twitter_handle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-brand"
              aria-label="Twitter"
            >
              <Twitter className="h-4 w-4" />
            </a>
          )}
        </div>
        {author.title && (
          <p className="text-xs uppercase tracking-wider text-brand">{author.title}</p>
        )}
        {author.bio && <p className="mt-2 text-sm text-muted-foreground">{author.bio}</p>}
      </div>
    </div>
  );
}

export function FinancialDisclaimer({ custom }: { custom?: string | null }) {
  return (
    <div className="mt-6 rounded-lg border border-amber-500/20 bg-amber-500/5 p-5 text-sm text-amber-200/90">
      <p className="font-display font-bold uppercase tracking-wider text-amber-400">
        Financial Disclaimer
      </p>
      <p className="mt-2 leading-relaxed">
        {custom ??
          "This article is for informational and educational purposes only and should not be construed as financial, investment, or trading advice. Cryptocurrency investments are highly volatile and risky. Always conduct your own research (DYOR) and consult a licensed financial advisor before making any investment decisions. CryptoUptrend is not liable for any losses incurred."}
      </p>
    </div>
  );
}
