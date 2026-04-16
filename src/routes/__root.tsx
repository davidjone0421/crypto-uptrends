import { Outlet, createRootRoute, HeadContent, Scripts, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import appCss from "../styles.css?url";

const SITE_URL = "https://cryptouptrend.com";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-20">
        <div className="max-w-md text-center">
          <p className="font-display text-7xl font-bold text-gradient-brand">404</p>
          <h1 className="mt-4 font-display text-2xl font-bold">Page not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            That story has wandered off the chain. Try the homepage.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center justify-center rounded-md bg-gradient-brand px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Back to home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "CryptoUptrend — Cryptocurrency News, Markets & Web3 Insights" },
      {
        name: "description",
        content:
          "CryptoUptrend delivers daily cryptocurrency news, Bitcoin and altcoin market analysis, AI & Web3 coverage, and expert price predictions.",
      },
      { name: "author", content: "CryptoUptrend" },
      { name: "theme-color", content: "#0a1226" },
      { property: "og:site_name", content: "CryptoUptrend" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@CryptoUptrend" },
      { property: "og:title", content: "CryptoUptrend — Cryptocurrency News, Markets & Web3 Insights" },
      { name: "twitter:title", content: "CryptoUptrend — Cryptocurrency News, Markets & Web3 Insights" },
      { name: "description", content: "CryptoUptrend Hub is a modern, responsive cryptocurrency news website." },
      { property: "og:description", content: "CryptoUptrend Hub is a modern, responsive cryptocurrency news website." },
      { name: "twitter:description", content: "CryptoUptrend Hub is a modern, responsive cryptocurrency news website." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "apple-touch-icon", href: "/favicon.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
