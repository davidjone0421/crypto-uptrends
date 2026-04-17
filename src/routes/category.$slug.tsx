import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { fetchArticlesByCategory, type Article } from "@/lib/articles";
import { ArticleCard } from "@/components/ArticleCard";
import { AdSlot } from "@/components/AdSlot";
import { FearGreedWidget } from "@/components/FearGreedWidget";

export const Route = createFileRoute("/category/$slug")({
  loader: async ({ params }) => {
    const result = await fetchArticlesByCategory(params.slug);
    if (!result.category) throw notFound();
    return result;
  },
  head: ({ loaderData }) => {
    const cat = loaderData?.category;
    if (!cat) {
      return {
        meta: [{ title: "Category — CryptoUptrend" }],
      };
    }
    const title = `${cat.name} — CryptoUptrend`;
    const description = cat.description ?? `Latest ${cat.name} stories from CryptoUptrend.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:image", content: "https://cryptouptrend.com/og-image.jpg" },
        { name: "twitter:image", content: "https://cryptouptrend.com/og-image.jpg" },
      ],
    };
  },
  component: CategoryPage,
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-3xl p-8 text-center text-destructive">{error.message}</div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl p-8 text-center">
      <h1 className="font-display text-2xl font-bold">Category not found</h1>
      <Link to="/" className="mt-4 inline-block text-brand hover:underline">
        Back to home
      </Link>
    </div>
  ),
});

function CategoryPage() {
  const { category, articles } = Route.useLoaderData();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <AdSlot variant="mobile-banner" />

      <header className="border-b border-border pb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand">Category</p>
        <h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">{category!.name}</h1>
        {category!.description && (
          <p className="mt-3 max-w-2xl text-muted-foreground">{category!.description}</p>
        )}
      </header>

      {articles.length === 0 ? (
        <p className="mt-10 text-center text-muted-foreground">No articles yet in this category.</p>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="grid gap-5 sm:grid-cols-2">
            {(articles as Article[]).map((a: Article) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
          <aside className="space-y-6">
            <FearGreedWidget />
            <div className="hidden lg:block">
              <AdSlot variant="sidebar" />
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
