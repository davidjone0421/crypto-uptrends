import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Edit, Trash2, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { fetchArticles, formatDate, type Article } from "@/lib/articles";

export const Route = createFileRoute("/admin/")({
  component: AdminList,
});

function AdminList() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const data = await fetchArticles(200);
    setArticles(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (error) {
      alert(error.message);
      return;
    }
    load();
  };

  if (loading) return <p className="text-muted-foreground">Loading…</p>;

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead className="bg-[var(--surface)] text-xs uppercase tracking-wider text-foreground/70">
          <tr>
            <th className="px-4 py-3 text-left">Title</th>
            <th className="px-4 py-3 text-left">Category</th>
            <th className="px-4 py-3 text-left">Date</th>
            <th className="px-4 py-3 text-left">Featured</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((a) => (
            <tr key={a.id} className="border-t border-border hover:bg-accent/30">
              <td className="px-4 py-3 font-medium">{a.title}</td>
              <td className="px-4 py-3 text-muted-foreground">{a.category?.name ?? "—"}</td>
              <td className="px-4 py-3 text-muted-foreground">{formatDate(a.published_at)}</td>
              <td className="px-4 py-3">{a.is_featured ? "★" : ""}</td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <Link to="/article/$slug" params={{ slug: a.slug }} className="rounded-md p-1.5 hover:bg-accent" aria-label="View"><ExternalLink className="h-4 w-4" /></Link>
                  <Link to="/admin/edit/$id" params={{ id: a.id }} className="rounded-md p-1.5 hover:bg-accent" aria-label="Edit"><Edit className="h-4 w-4" /></Link>
                  <button onClick={() => remove(a.id, a.title)} className="rounded-md p-1.5 text-destructive hover:bg-destructive/10" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
                </div>
              </td>
            </tr>
          ))}
          {articles.length === 0 && (
            <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No articles yet. <Link to="/admin/new" className="text-brand hover:underline">Create one</Link>.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
