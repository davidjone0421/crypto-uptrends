import { useEffect, useState } from "react";

type FngData = { value: number; classification: string };

function getColor(value: number) {
  if (value < 25) return { bg: "#dc2626", label: "Extreme Fear" };
  if (value < 45) return { bg: "#ea580c", label: "Fear" };
  if (value < 55) return { bg: "#eab308", label: "Neutral" };
  if (value < 75) return { bg: "#84cc16", label: "Greed" };
  return { bg: "#16a34a", label: "Extreme Greed" };
}

export function FearGreedWidget() {
  const [data, setData] = useState<FngData | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("https://api.alternative.me/fng/?limit=1")
      .then((r) => r.json())
      .then((j) => {
        if (cancelled) return;
        const d = j?.data?.[0];
        if (d) {
          setData({ value: parseInt(d.value, 10), classification: d.value_classification });
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="rounded-lg border border-border bg-[var(--surface)] p-5">
      <h3 className="font-display text-sm font-bold uppercase tracking-wider text-foreground/80">
        Fear &amp; Greed Index
      </h3>
      {data ? (
        <div className="mt-4 text-center">
          <div
            className="mx-auto flex h-28 w-28 items-center justify-center rounded-full text-4xl font-bold text-white shadow-lg"
            style={{ backgroundColor: getColor(data.value).bg }}
          >
            {data.value}
          </div>
          <p className="mt-3 text-sm font-semibold">{data.classification}</p>
          <p className="mt-1 text-xs text-muted-foreground">Updated daily · alternative.me</p>
        </div>
      ) : (
        <div className="mt-4 flex h-28 items-center justify-center text-xs text-muted-foreground">
          Loading…
        </div>
      )}
    </div>
  );
}
