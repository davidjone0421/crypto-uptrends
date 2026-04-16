import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const SITE = "https://cryptouptrend.com";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const [{ data: articles }, { data: categories }] = await Promise.all([
          supabaseAdmin.from("articles").select("slug, published_at").order("published_at", { ascending: false }),
          supabaseAdmin.from("categories").select("slug"),
        ]);

        const staticUrls = ["", "about", "contact", "privacy", "terms"];
        const urls: string[] = [];

        for (const u of staticUrls) {
          urls.push(`<url><loc>${SITE}/${u}</loc><changefreq>weekly</changefreq></url>`);
        }
        for (const c of categories ?? []) {
          urls.push(`<url><loc>${SITE}/category/${c.slug}</loc><changefreq>daily</changefreq></url>`);
        }
        for (const a of articles ?? []) {
          urls.push(
            `<url><loc>${SITE}/article/${a.slug}</loc><lastmod>${new Date(a.published_at).toISOString()}</lastmod></url>`,
          );
        }

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
