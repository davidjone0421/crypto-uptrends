import { Link } from "@tanstack/react-router";
import { Menu, X, Search } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/logo-mark.svg";

const NAV = [
  { to: "/category/$slug", params: { slug: "bitcoin-news" }, label: "Bitcoin News" },
  { to: "/category/$slug", params: { slug: "ai-web3" }, label: "AI & Web3" },
  { to: "/category/$slug", params: { slug: "altcoin-updates" }, label: "Altcoin Updates" },
  { to: "/category/$slug", params: { slug: "price-predictions" }, label: "Price Predictions" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={logo} alt="" className="h-8 w-8" width={32} height={32} />
          <span className="font-display text-xl font-bold tracking-tight">
            Crypto<span className="text-gradient-brand">Uptrend</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              params={item.params}
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
              activeProps={{ className: "text-brand bg-accent" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            aria-label="Search"
            className="hidden h-9 w-9 items-center justify-center rounded-md text-foreground/70 transition-colors hover:bg-accent hover:text-foreground md:flex"
          >
            <Search className="h-4 w-4" />
          </button>
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-md text-foreground/70 transition-colors hover:bg-accent hover:text-foreground lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border bg-background lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col px-4 py-2">
            {NAV.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                params={item.params}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent"
                activeProps={{ className: "text-brand bg-accent" }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
