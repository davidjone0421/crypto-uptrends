import { Link } from "@tanstack/react-router";
import { Clock } from "lucide-react";
import { type Article, formatDate } from "@/lib/articles";
import { cn } from "@/lib/utils";

type Variant = "default" | "compact" | "hero";

export function ArticleCard({
  article,
  variant = "default",
}: {
  article: Article;
  variant?: Variant;
}) {
  if (variant === "compact") {
    return (
      <Link
        to="/article/$slug"
        params={{ slug: article.slug }}
        className="group flex gap-3 rounded-lg p-2 transition-colors hover:bg-accent"
      >
        <img
          src={article.cover_image}
          alt={article.title}
          loading="lazy"
          width={96}
          height={72}
          className="h-[72px] w-24 flex-shrink-0 rounded-md object-cover"
        />
        <div className="min-w-0 flex-1">
          <h4 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-brand">
            {article.title}
          </h4>
          <p className="mt-1.5 text-[11px] text-muted-foreground">
            {formatDate(article.published_at)} · {article.read_minutes} min read
          </p>
        </div>
      </Link>
    );
  }

  if (variant === "hero") {
    return (
      <Link
        to="/article/$slug"
        params={{ slug: article.slug }}
        className="group relative block h-full min-h-[420px] overflow-hidden rounded-xl shadow-card"
      >
        <img
          src={article.cover_image}
          alt={article.title}
          width={1200}
          height={800}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        <div className="relative flex h-full flex-col justify-end p-6 md:p-8">
          {article.category && <span className="category-chip mb-3 w-fit">{article.category.name}</span>}
          <h2 className="font-display text-2xl font-bold leading-tight text-white md:text-4xl">
            {article.title}
          </h2>
          <p className="mt-3 line-clamp-2 max-w-2xl text-sm text-white/80 md:text-base">
            {article.excerpt}
          </p>
          <p className="mt-4 text-xs text-white/60">
            By {article.author} · {formatDate(article.published_at)}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to="/article/$slug"
      params={{ slug: article.slug }}
      className={cn(
        "group flex flex-col overflow-hidden rounded-lg bg-card shadow-card transition-all hover:-translate-y-0.5 hover:shadow-glow",
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={article.cover_image}
          alt={article.title}
          loading="lazy"
          width={640}
          height={400}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {article.category && (
          <span className="category-chip absolute left-3 top-3">
            {article.category.name}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 font-display text-base font-bold leading-snug transition-colors group-hover:text-brand md:text-lg">
          {article.title}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted-foreground">
          {article.excerpt}
        </p>
        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>{formatDate(article.published_at)}</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> {article.read_minutes} min
          </span>
        </div>
      </div>
    </Link>
  );
}
