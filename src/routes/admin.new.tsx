import { createFileRoute } from "@tanstack/react-router";
import { ArticleForm } from "@/components/ArticleForm";

export const Route = createFileRoute("/admin/new")({
  component: () => (
    <div>
      <h2 className="mb-5 font-display text-xl font-bold">New Article</h2>
      <ArticleForm />
    </div>
  ),
});
