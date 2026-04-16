import { Link } from "@tanstack/react-router";
import { Menu, X, Search, ChevronDown } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/logo-mark.svg";

type DropdownItem = { slug: string; label: string };
type NavItem = {
  label: string;
  to?: "/" | "/category/$slug";
  params?: { slug: string };
  dropdown?: DropdownItem[];
};

const NAV: NavItem[] = [
  { label: "HOME", to: "/" },
  { label: "CRYPTO NEWS", to: "/category/$slug", params: { slug: "crypto-news" } },
  { label: "BITCOIN NEWS", to: "/category/$slug", params: { slug: "bitcoin-news" } },
  { label: "AI & WEB3", to: "/category/$slug", params: { slug: "ai-web3" } },
  {
    label: "ALTCOIN UPDATES",
    to: "/category/$slug",
    params: { slug: "altcoin-updates" },
    dropdown: [
      { slug: "blockchain", label: "Blockchain" },
      { slug: "defi", label: "DeFi" },
      { slug: "meme-coins", label: "Meme Coins" },
    ],
  },
  {
    label: "PRICE PREDICTIONS",
    to: "/category/$slug",
    params: { slug: "price-predictions" },
    dropdown: [
      { slug: "investment", label: "Investment" },
      { slug: "market-analysis", label: "Market Analysis" },
      { slug: "exchange", label: "Exchange" },
      { slug: "trading", label: "Trading" },
    ],
  },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-black text-white shadow-md">
      {/* Top brand strip */}
      <div className="border-b border-white/10">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={logo} alt="" className="h-8 w-8" width={32} height={32} />
            <span className="font-display text-xl font-bold tracking-tight text-white">
              Crypto<span className="text-[#0088FF]">Uptrend</span>
            </span>
          </Link>

          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-md text-white/70 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Black nav bar with blue active blocks */}
      <nav className="hidden lg:block">
        <div className="mx-auto flex max-w-7xl items-stretch justify-between px-4 md:px-6">
          <ul className="flex items-stretch">
            {NAV.map((item) => (
              <NavItem key={item.label} item={item} />
            ))}
          </ul>
          <div className="flex items-center">
            {search ? (
              <div className="flex items-center gap-2 px-3">
                <input
                  autoFocus
                  type="search"
                  placeholder="Search articles…"
                  className="h-9 w-56 rounded-sm border border-white/20 bg-black/60 px-3 text-sm text-white placeholder:text-white/40 focus:border-[#0088FF] focus:outline-none"
                  onBlur={() => setSearch(false)}
                />
              </div>
            ) : (
              <button
                aria-label="Search"
                onClick={() => setSearch(true)}
                className="flex h-12 w-12 items-center justify-center text-white/80 transition-colors hover:bg-[#0088FF] hover:text-white"
              >
                <Search className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <nav className="border-t border-white/10 bg-black lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col px-4 py-2">
            {NAV.map((item) => (
              <MobileNavItem key={item.label} item={item} onClose={() => setOpen(false)} />
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}

function NavItem({ item }: { item: NavItem }) {
  const linkClass =
    "group relative flex h-12 items-center gap-1 px-4 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#0088FF]";

  if (item.to === "/") {
    return (
      <li className="relative">
        <Link
          to="/"
          className={linkClass}
          activeProps={{ className: "bg-[#0088FF]" }}
          activeOptions={{ exact: true }}
        >
          {item.label}
          <span className="absolute bottom-0 left-1/2 h-[3px] w-6 -translate-x-1/2 bg-white opacity-0 group-[.bg-\\[\\#0088FF\\]]:opacity-100" />
        </Link>
      </li>
    );
  }

  if (!item.dropdown) {
    return (
      <li>
        <Link
          to={item.to!}
          params={item.params}
          className={linkClass}
          activeProps={{ className: "bg-[#0088FF]" }}
        >
          {item.label}
        </Link>
      </li>
    );
  }

  return (
    <li className="group relative">
      <Link
        to={item.to!}
        params={item.params}
        className={linkClass}
        activeProps={{ className: "bg-[#0088FF]" }}
      >
        {item.label}
        <ChevronDown className="h-3 w-3" />
      </Link>
      <div className="invisible absolute left-0 top-full z-50 min-w-[200px] border border-white/10 bg-black opacity-0 shadow-xl transition-all group-hover:visible group-hover:opacity-100">
        {item.dropdown.map((sub) => (
          <Link
            key={sub.slug}
            to="/category/$slug"
            params={{ slug: sub.slug }}
            className="block px-5 py-3 text-sm text-white/90 transition-colors hover:bg-[#0088FF] hover:text-white"
          >
            {sub.label}
          </Link>
        ))}
      </div>
    </li>
  );
}

function MobileNavItem({ item, onClose }: { item: NavItem; onClose: () => void }) {
  const [expanded, setExpanded] = useState(false);

  if (!item.dropdown) {
    return (
      <Link
        to={item.to!}
        params={item.params}
        onClick={onClose}
        className="rounded-sm px-3 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#0088FF]"
        activeProps={{ className: "bg-[#0088FF]" }}
        activeOptions={item.to === "/" ? { exact: true } : undefined}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div>
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between rounded-sm px-3 py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-white/10"
      >
        {item.label}
        <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>
      {expanded && (
        <div className="ml-3 border-l border-white/10 pl-3">
          <Link
            to={item.to!}
            params={item.params}
            onClick={onClose}
            className="block rounded-sm px-3 py-2 text-sm font-medium text-white/90 hover:bg-[#0088FF]"
          >
            All {item.label.replace(/^[A-Z]/, (c) => c)}
          </Link>
          {item.dropdown.map((sub) => (
            <Link
              key={sub.slug}
              to="/category/$slug"
              params={{ slug: sub.slug }}
              onClick={onClose}
              className="block rounded-sm px-3 py-2 text-sm text-white/80 hover:bg-[#0088FF] hover:text-white"
            >
              {sub.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
