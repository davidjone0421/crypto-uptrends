import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

type Coin = {
  id: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
};

const COIN_IDS = "bitcoin,ethereum,solana,binancecoin,ripple,cardano,dogecoin,tron,avalanche-2,polkadot";

export function PriceTicker() {
  const [coins, setCoins] = useState<Coin[]>([]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${COIN_IDS}&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`,
        );
        if (!res.ok) return;
        const data = (await res.json()) as Coin[];
        if (!cancelled) setCoins(data);
      } catch {
        /* silent fail — ticker is decorative */
      }
    };
    load();
    const interval = setInterval(load, 60_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  if (coins.length === 0) {
    return (
      <div className="h-9 border-b border-border bg-black text-xs text-white/50">
        <div className="flex h-full items-center px-4">Loading prices…</div>
      </div>
    );
  }

  // Duplicate for seamless scroll
  const items = [...coins, ...coins];

  return (
    <div className="overflow-hidden border-b border-white/10 bg-black text-xs text-white">
      <div className="flex animate-ticker whitespace-nowrap py-2">
        {items.map((c, i) => {
          const up = c.price_change_percentage_24h >= 0;
          return (
            <div key={`${c.id}-${i}`} className="mx-5 flex items-center gap-2">
              <span className="font-semibold uppercase">{c.symbol}</span>
              <span className="font-mono text-white/90">
                ${c.current_price.toLocaleString(undefined, { maximumFractionDigits: c.current_price < 1 ? 4 : 2 })}
              </span>
              <span
                className={`inline-flex items-center gap-0.5 font-mono ${up ? "text-emerald-400" : "text-red-400"}`}
              >
                {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {up ? "+" : ""}
                {c.price_change_percentage_24h.toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
