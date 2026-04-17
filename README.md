# Cryptoupturn

Modern cryptocurrency news portal built on **TanStack Start** (React 19 + Vite 7) and **Lovable Cloud** (Supabase under the hood). Deployed to Cloudflare Workers.

## Features

- Sticky black navigation with dropdowns and active-state highlighting
- Live CoinGecko price ticker
- Crypto Fear & Greed widget
- Admin CMS at `/admin` with role-based access (first signup is auto-promoted to admin)
- Newsletter signup (footer + popup) backed by Lovable Cloud
- Dynamic `/sitemap.xml` and `/rss.xml`
- Per-route SEO via TanStack `head()` (no `react-helmet-async` needed)
- AdSense-ready ad slots (leaderboard above nav, in-article, sidebar)

## Local development

```bash
npm install
npm run dev
```

The Lovable Cloud `.env` is generated automatically — never edit it by hand.

## Deployment (Lovable)

This project deploys through **Lovable Publish**, not Netlify or Vercel.

1. Click **Publish** in the top-right of the Lovable editor.
2. On first publish you get a free `*.lovable.app` subdomain.
3. To attach a custom domain (e.g. `cryptouptrend.com`), open **Project Settings → Domains** after publishing.

### Frontend vs backend changes

- **Frontend** (UI, components, styles): require clicking **Update** in the Publish dialog to go live.
- **Backend** (edge functions, database migrations): deploy automatically and immediately.

### Environment variables

Lovable Cloud manages all required secrets automatically:

- `SUPABASE_URL` / `VITE_SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY` / `VITE_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only)
- `LOVABLE_API_KEY` (for AI features)

Add additional secrets via **Cloud → Secrets** in the Lovable sidebar.

## Admin access

1. Visit `/auth` and create an account with email + password.
2. The first registered user is **auto-promoted to admin** by a database trigger.
3. Manage articles, authors, and categories at `/admin`.
