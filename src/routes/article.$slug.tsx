import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { Clock, User, Calendar } from "lucide-react";
import { fetchArticleBySlug, formatDate } from "@/lib/articles";
import { AdSlot } from "@/components/AdSlot";

export const Route = createFileRoute("/article/$slug")({
  loader: async ({ params }) => {
    const article = await fetchArticleBySlug(params.slug);
    if (!article) throw notFound();
    return article;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Article — CryptoUptrend" }] };
    const a = loaderData;
    const url = `https://cryptouptrend.com/article/${a.slug}`;
    return {
      meta: [
        { title: `${a.title} — CryptoUptrend` },
        { name: "description", content: a.excerpt },
        { name: "author", content: a.author },
        { property: "og:title", content: a.title },
        { property: "og:description", content: a.excerpt },
        { property: "og:image", content: a.cover_image },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "article:published_time", content: a.published_at },
        { property: "article:author", content: a.author },
        ...(a.category
          ? [{ property: "article:section", content: a.category.name }]
          : []),
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: a.title },
        { name: "twitter:description", content: a.excerpt },
        { name: "twitter:image", content: a.cover_image },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: ArticlePage,
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-3xl p-8 text-center text-destructive">{error.message}</div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl p-12 text-center">
      <h1 className="font-display text-3xl font-bold">Article not found</h1>
      <Link to="/" className="mt-4 inline-block text-brand hover:underline">
        Back to home
      </Link>
    </div>
  ),
});

function ArticlePage() {
  const article = Route.useLoaderData();
  const paragraphs = article.content.split(/\n\n+/);
  const mid = Math.floor(paragraphs.length / 2);

  const ldJson = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    image: [article.cover_image],
    datePublished: article.published_at,
    author: { "@type": "Person", name: article.author },
    publisher: {
      "@type": "Organization",
      name: "CryptoUptrend",
      logo: {
        "@type": "ImageObject",
        url: "https://cryptouptrend.com/favicon.png",
      },
    },
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-8 md:px-6">
      <AdSlot variant="leaderboard" className="hidden md:flex" />
      <AdSlot variant="mobile-banner" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }}
      />

      <header className="border-b border-border pb-6">
        {article.category && (
          <Link
            to="/category/$slug"
            params={{ slug: article.category.slug }}
            className="category-chip"
          >
            {article.category.name}
          </Link>
        )}
        <h1 className="mt-4 font-display text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
          {article.title}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">{article.excerpt}</p>
        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><User className="h-4 w-4" /> {article.author}</span>
          <span className="inline-flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {formatDate(article.published_at)}</span>
          <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" /> {article.read_minutes} min read</span>
        </div>
      </header>

      <figure className="my-6 overflow-hidden rounded-xl">
        <img
          src={article.cover_image}
          alt={article.title}
          width={1200}
          height={675}
          className="aspect-[16/9] w-full object-cover"
        />
      </figure>

      <div className="prose-article space-y-5 text-base leading-relaxed text-foreground/90">
        {paragraphs.map((p, i) => (
          <div key={i}>
            <p>{p}</p>
            {i === mid && <AdSlot variant="in-article" />}
          </div>
        ))}
      </div>

      <footer className="mt-12 rounded-lg border border-border bg-[var(--surface)] p-5 text-sm text-muted-foreground">
        Disclaimer: This article is for informational purposes only and does not constitute
        financial advice. Always do your own research before investing.
      </footer>
    </article>
  );
}
