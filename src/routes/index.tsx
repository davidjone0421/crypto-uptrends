import { createFileRoute } from "@tanstack/react-router";
import { fetchArticles, type Article } from "@/lib/articles";
import { ArticleCard } from "@/components/ArticleCard";
import { AdSlot } from "@/components/AdSlot";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CryptoUptrend — Cryptocurrency News, Markets & Web3 Insights" },
      {
        name: "description",
        content:
          "Stay ahead of the crypto market with CryptoUptrend: daily Bitcoin, Ethereum, AI & Web3 news, altcoin updates, and analyst price predictions.",
      },
      { property: "og:title", content: "CryptoUptrend — Cryptocurrency News & Market Insights" },
      {
        property: "og:description",
        content: "Daily Bitcoin, altcoin, AI & Web3 news and analyst price predictions.",
      },
      { property: "og:image", content: "https://cryptouptrend.com/og-image.jpg" },
      { name: "twitter:image", content: "https://cryptouptrend.com/og-image.jpg" },
    ],
  }),
  loader: () => fetchArticles(20),
  component: HomePage,
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-3xl p-8 text-center">
      <p className="text-destructive">Failed to load articles: {error.message}</p>
    </div>
  ),
  pendingComponent: () => <HomeSkeleton />,
});

function HomeSkeleton() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse p-4 md:p-6">
      <div className="h-[420px] rounded-xl bg-card" />
    </div>
  );
}

function HomePage() {
  const articles = Route.useLoaderData() as Article[];
  const featured = articles.filter((a: Article) => a.is_featured);
  const hero = featured[0] ?? articles[0];
  const sideFeatured = featured.slice(1, 3);
  const grid = articles.filter((a: Article) => a.id !== hero?.id).slice(0, 8);
  const sidebar = articles.slice(0, 5);

  if (!hero) {
    return (
      <div className="mx-auto max-w-3xl p-12 text-center text-muted-foreground">
        No articles yet.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
      <AdSlot variant="leaderboard" className="hidden md:flex" />
      <AdSlot variant="mobile-banner" />

      {/* Hero grid */}
      <section className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <ArticleCard article={hero} variant="hero" />
        </div>
        <div className="grid gap-4">
          {sideFeatured.map((a) => (
            <div key={a.id} className="h-full">
              <ArticleCard article={a} />
            </div>
          ))}
        </div>
      </section>

      {/* Latest + Sidebar */}
      <section className="mt-12 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <SectionHeading title="Latest Stories" accent />
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {grid.slice(0, 4).map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>

          <AdSlot variant="in-article" />

          <div className="grid gap-5 sm:grid-cols-2">
            {grid.slice(4).map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </div>

        <aside className="space-y-8">
          <div className="rounded-lg border border-border bg-[var(--surface)] p-4">
            <SectionHeading title="Trending Now" small />
            <div className="mt-4 space-y-2">
              {sidebar.map((a) => (
                <ArticleCard key={a.id} article={a} variant="compact" />
              ))}
            </div>
          </div>
          <div className="hidden lg:block">
            <AdSlot variant="sidebar" />
          </div>
        </aside>
      </section>
    </div>
  );
}

function SectionHeading({
  title,
  accent,
  small,
}: {
  title: string;
  accent?: boolean;
  small?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-border pb-3">
      {accent && <span className="h-5 w-1 rounded-full bg-gradient-brand" />}
      <h2
        className={
          small
            ? "font-display text-sm font-bold uppercase tracking-wider"
            : "font-display text-xl font-bold md:text-2xl"
        }
      >
        {title}
      </h2>
    </div>
  );
}
