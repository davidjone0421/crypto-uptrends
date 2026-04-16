import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — CryptoUptrend" },
      { name: "description", content: "The terms governing your use of the CryptoUptrend website." },
    ],
  }),
  component: () => (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-6">
      <h1 className="font-display text-4xl font-bold">Terms of Service</h1>
      <p className="mt-5 text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
      <p className="mt-6 text-foreground/85">
        By using CryptoUptrend, you agree to use the site for lawful purposes only. Content on this
        site is provided for informational purposes and does not constitute financial, investment,
        legal, or tax advice.
      </p>
      <p className="mt-4 text-foreground/85">
        Cryptocurrency markets are volatile. You are solely responsible for your investment decisions.
      </p>
    </div>
  ),
});
