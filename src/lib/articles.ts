import { supabase } from "@/integrations/supabase/client";

export type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string;
  author: string;
  read_minutes: number;
  is_featured: boolean;
  published_at: string;
  category_id: string | null;
  category?: Category | null;
};

export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
};

const ARTICLE_SELECT = `
  id, slug, title, excerpt, content, cover_image, author, read_minutes,
  is_featured, published_at, category_id,
  category:categories(id, slug, name, description)
`;

export async function fetchArticles(limit = 50): Promise<Article[]> {
  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_SELECT)
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as unknown as Article[];
}

export async function fetchArticleBySlug(slug: string): Promise<Article | null> {
  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_SELECT)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return (data ?? null) as unknown as Article | null;
}

export async function fetchArticlesByCategory(categorySlug: string): Promise<{
  category: Category | null;
  articles: Article[];
}> {
  const { data: cat, error: catErr } = await supabase
    .from("categories")
    .select("id, slug, name, description")
    .eq("slug", categorySlug)
    .maybeSingle();
  if (catErr) throw catErr;
  if (!cat) return { category: null, articles: [] };

  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_SELECT)
    .eq("category_id", cat.id)
    .order("published_at", { ascending: false });
  if (error) throw error;

  return { category: cat as Category, articles: (data ?? []) as unknown as Article[] };
}

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("id, slug, name, description")
    .order("name");
  if (error) throw error;
  return (data ?? []) as Category[];
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
