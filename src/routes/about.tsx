import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — CryptoUptrend" },
      { name: "description", content: "Learn about CryptoUptrend, our editorial mission, and the team covering crypto markets and Web3." },
      { property: "og:title", content: "About CryptoUptrend" },
      { property: "og:description", content: "Our mission: clear, accurate cryptocurrency news and analysis." },
    ],
  }),
  component: () => (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-6">
      <h1 className="font-display text-4xl font-bold">About CryptoUptrend</h1>
      <p className="mt-5 text-lg text-muted-foreground">
        CryptoUptrend is an independent cryptocurrency news publication covering Bitcoin,
        Ethereum, AI &amp; Web3 infrastructure, altcoin markets, and analyst price forecasts.
      </p>
      <p className="mt-4 text-foreground/85">
        Our editorial team brings together experienced market reporters, on-chain analysts,
        and technologists. We publish daily news and original analysis with a focus on
        clarity, accuracy, and reader trust.
      </p>
    </div>
  ),
});
