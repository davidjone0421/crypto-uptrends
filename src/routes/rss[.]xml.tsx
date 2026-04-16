import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const SITE = "https://cryptouptrend.com";

function escapeXml(s: string) {
  return s.replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c]!));
}

export const Route = createFileRoute("/rss.xml")({
  server: {
    handlers: {
      GET: async () => {
        const { data: articles } = await supabaseAdmin
          .from("articles")
          .select("slug, title, excerpt, published_at, author, cover_image")
          .order("published_at", { ascending: false })
          .limit(50);

        const items = (articles ?? []).map((a) => `
    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${SITE}/article/${a.slug}</link>
      <guid isPermaLink="true">${SITE}/article/${a.slug}</guid>
      <description>${escapeXml(a.excerpt)}</description>
      <author>editorial@cryptouptrend.com (${escapeXml(a.author)})</author>
      <pubDate>${new Date(a.published_at).toUTCString()}</pubDate>
      <enclosure url="${escapeXml(a.cover_image)}" type="image/jpeg" />
    </item>`).join("");

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>CryptoUptrend</title>
    <link>${SITE}</link>
    <description>Daily cryptocurrency news, market analysis, and Web3 insights.</description>
    <language>en-us</language>
    <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${items}
  </channel>
</rss>`;

        return new Response(xml, {
          headers: {
            "Content-Type": "application/rss+xml; charset=utf-8",
            "Cache-Control": "public, max-age=600",
          },
        });
      },
    },
  },
});
