import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArticleForm } from "@/components/ArticleForm";
import type { Article } from "@/lib/articles";

export const Route = createFileRoute("/admin/edit/$id")({
  component: EditPage,
});

function EditPage() {
  const { id } = Route.useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("articles")
      .select("*")
      .eq("id", id)
      .maybeSingle()
      .then(({ data }) => {
        setArticle(data as unknown as Article);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="text-muted-foreground">Loading…</p>;
  if (!article) return <p className="text-destructive">Article not found.</p>;

  return (
    <div>
      <h2 className="mb-5 font-display text-xl font-bold">Edit Article</h2>
      <ArticleForm existing={article} />
    </div>
  );
}
