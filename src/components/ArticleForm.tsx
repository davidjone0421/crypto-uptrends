import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { fetchCategories, fetchSubcategories, fetchAuthors, type Category, type Subcategory, type Author, type Article } from "@/lib/articles";

type FormData = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  read_minutes: number;
  is_featured: boolean;
  category_id: string;
  subcategory_id: string;
  author_id: string;
  disclaimer: string;
};

const empty: FormData = {
  title: "", slug: "", excerpt: "", content: "", cover_image: "",
  read_minutes: 4, is_featured: false,
  category_id: "", subcategory_id: "", author_id: "", disclaimer: "",
};

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function ArticleForm({ existing }: { existing?: Article | null }) {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormData>(empty);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([fetchCategories(), fetchSubcategories(), fetchAuthors()]).then(([c, s, a]) => {
      setCategories(c); setSubcategories(s); setAuthors(a);
    });
  }, []);

  useEffect(() => {
    if (existing) {
      setForm({
        title: existing.title, slug: existing.slug, excerpt: existing.excerpt,
        content: existing.content, cover_image: existing.cover_image,
        read_minutes: existing.read_minutes, is_featured: existing.is_featured,
        category_id: existing.category_id ?? "",
        subcategory_id: existing.subcategory_id ?? "",
        author_id: existing.author_id ?? "",
        disclaimer: existing.disclaimer ?? "",
      });
    }
  }, [existing]);

  const set = <K extends keyof FormData>(k: K, v: FormData[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError("");
    const payload = {
      ...form,
      slug: form.slug || slugify(form.title),
      category_id: form.category_id || null,
      subcategory_id: form.subcategory_id || null,
      author_id: form.author_id || null,
      disclaimer: form.disclaimer || null,
    };
    const op = existing
      ? supabase.from("articles").update(payload).eq("id", existing.id)
      : supabase.from("articles").insert(payload);
    const { error } = await op;
    setSaving(false);
    if (error) { setError(error.message); return; }
    navigate({ to: "/admin" });
  };

  const filteredSubs = subcategories.filter((s) => s.category_id === form.category_id);

  return (
    <form onSubmit={submit} className="space-y-5">
      <Field label="Title">
        <input required value={form.title} onChange={(e) => { set("title", e.target.value); if (!existing && !form.slug) set("slug", slugify(e.target.value)); }} className={inputCls} />
      </Field>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Slug"><input required value={form.slug} onChange={(e) => set("slug", e.target.value)} className={inputCls} /></Field>
        <Field label="Cover image URL"><input required value={form.cover_image} onChange={(e) => set("cover_image", e.target.value)} className={inputCls} placeholder="https://…" /></Field>
      </div>
      <Field label="Excerpt"><textarea required rows={2} value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} className={inputCls} /></Field>
      <Field label="Content (use blank lines between paragraphs)"><textarea required rows={14} value={form.content} onChange={(e) => set("content", e.target.value)} className={inputCls + " font-mono text-xs"} /></Field>
      <div className="grid gap-5 md:grid-cols-3">
        <Field label="Category">
          <select value={form.category_id} onChange={(e) => { set("category_id", e.target.value); set("subcategory_id", ""); }} className={inputCls}>
            <option value="">— None —</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </Field>
        <Field label="Subcategory">
          <select value={form.subcategory_id} onChange={(e) => set("subcategory_id", e.target.value)} className={inputCls} disabled={!form.category_id}>
            <option value="">— None —</option>
            {filteredSubs.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </Field>
        <Field label="Author">
          <select value={form.author_id} onChange={(e) => set("author_id", e.target.value)} className={inputCls}>
            <option value="">— None —</option>
            {authors.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </Field>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Read minutes"><input type="number" min={1} value={form.read_minutes} onChange={(e) => set("read_minutes", parseInt(e.target.value) || 1)} className={inputCls} /></Field>
        <label className="flex items-center gap-2 pt-7 text-sm">
          <input type="checkbox" checked={form.is_featured} onChange={(e) => set("is_featured", e.target.checked)} />
          Featured on homepage
        </label>
      </div>
      <Field label="Custom disclaimer (optional)"><textarea rows={2} value={form.disclaimer} onChange={(e) => set("disclaimer", e.target.value)} className={inputCls} placeholder="Leave blank for default financial disclaimer" /></Field>

      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex gap-2">
        <button type="submit" disabled={saving} className="rounded-md bg-gradient-brand px-5 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50">
          {saving ? "Saving…" : existing ? "Update Article" : "Publish Article"}
        </button>
        <button type="button" onClick={() => navigate({ to: "/admin" })} className="rounded-md border border-border px-5 py-2 text-sm hover:bg-accent">Cancel</button>
      </div>
    </form>
  );
}

const inputCls = "w-full rounded-md border border-border bg-[var(--surface)] px-3 py-2 text-sm focus:border-brand focus:outline-none";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-foreground/80">{label}</label>
      {children}
    </div>
  );
}
