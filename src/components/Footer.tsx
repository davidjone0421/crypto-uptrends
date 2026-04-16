import { Link } from "@tanstack/react-router";
import { Twitter, Facebook, Linkedin, Rss } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-border bg-[var(--surface)]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-3 md:px-6">
        <div>
          <h3 className="font-display text-lg font-bold">
            Crypto<span className="text-gradient-brand">Uptrend</span>
          </h3>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Daily cryptocurrency news, market analysis, and Web3 insights you can trust.
          </p>
          <div className="mt-5 flex gap-2">
            {[Twitter, Facebook, Linkedin, Rss].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Social"
                className="flex h-9 w-9 items-center justify-center rounded-md bg-accent text-foreground/80 transition-colors hover:bg-brand hover:text-primary-foreground"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground/60">
            Quick Links
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              { to: "/category/$slug", params: { slug: "bitcoin-news" }, label: "Bitcoin News" },
              { to: "/category/$slug", params: { slug: "ai-web3" }, label: "AI & Web3" },
              { to: "/category/$slug", params: { slug: "altcoin-updates" }, label: "Altcoin Updates" },
              { to: "/category/$slug", params: { slug: "price-predictions" }, label: "Price Predictions" },
            ].map((l) => (
              <li key={l.label}>
                <Link
                  to={l.to}
                  params={l.params}
                  className="text-foreground/80 transition-colors hover:text-brand"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground/60">
            About
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link to="/about" className="text-foreground/80 transition-colors hover:text-brand">
                About CryptoUptrend
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-foreground/80 transition-colors hover:text-brand">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="text-foreground/80 transition-colors hover:text-brand">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="text-foreground/80 transition-colors hover:text-brand">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-muted-foreground md:flex-row md:px-6">
          <p>© {year} CryptoUptrend. All rights reserved.</p>
          <p>
            Information on this site is for educational purposes only and does not constitute
            financial advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
