import { Link } from "@tanstack/react-router";
import { Twitter, Facebook, Linkedin, Rss } from "lucide-react";
import { NewsletterForm } from "./NewsletterForm";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="mt-16"
      style={{ background: "var(--footer-bg)", color: "var(--footer-fg)" }}
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-4 md:px-6">
        <div className="md:col-span-2">
          <h3 className="font-display text-2xl font-extrabold tracking-tight" style={{ letterSpacing: "-0.02em" }}>
            Cryptoupturn
          </h3>
          <p className="mt-3 max-w-md text-sm" style={{ color: "var(--footer-muted)" }}>
            Daily cryptocurrency news, market analysis, and Web3 insights you can trust.
          </p>
          <div className="mt-5">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--footer-fg)" }}>
              Join our Crypto Newsletter
            </p>
            <NewsletterForm source="footer" />
          </div>
          <div className="mt-5 flex gap-2">
            {[
              { Icon: Twitter, label: "Twitter" },
              { Icon: Facebook, label: "Facebook" },
              { Icon: Linkedin, label: "LinkedIn" },
            ].map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-[#0088FF]"
                style={{ background: "var(--footer-bg-deep)" }}
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
            <a
              href="/rss.xml"
              aria-label="RSS"
              className="flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-[#0088FF]"
              style={{ background: "var(--footer-bg-deep)" }}
            >
              <Rss className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--footer-muted)" }}>
            Categories
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              { slug: "crypto-news", label: "Crypto News" },
              { slug: "bitcoin-news", label: "Bitcoin News" },
              { slug: "ai-web3", label: "AI & Web3" },
              { slug: "altcoin-updates", label: "Altcoin Updates" },
              { slug: "price-predictions", label: "Price Predictions" },
            ].map((l) => (
              <li key={l.label}>
                <Link
                  to="/category/$slug"
                  params={{ slug: l.slug }}
                  className="transition-colors hover:text-white"
                  style={{ color: "var(--footer-muted)" }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--footer-muted)" }}>
            About
          </h4>
          <ul className="mt-4 space-y-2 text-sm" style={{ color: "var(--footer-muted)" }}>
            <li><Link to="/about" className="transition-colors hover:text-white">About</Link></li>
            <li><Link to="/contact" className="transition-colors hover:text-white">Contact</Link></li>
            <li><Link to="/privacy" className="transition-colors hover:text-white">Privacy Policy</Link></li>
            <li><Link to="/terms" className="transition-colors hover:text-white">Terms of Service</Link></li>
            <li><a href="/sitemap.xml" className="transition-colors hover:text-white">Sitemap</a></li>
            <li><a href="/rss.xml" className="transition-colors hover:text-white">RSS Feed</a></li>
          </ul>
        </div>
      </div>

      <div style={{ background: "var(--footer-bg-deep)" }}>
        <div
          className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs md:flex-row md:px-6"
          style={{ color: "var(--footer-muted)" }}
        >
          <p>© {year} Cryptoupturn. All rights reserved.</p>
          <p>
            Information on this site is for educational purposes only and does not constitute
            financial advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
