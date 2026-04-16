import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — CryptoUptrend" },
      { name: "description", content: "How CryptoUptrend collects, uses, and protects your information." },
    ],
  }),
  component: () => (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-6 prose-article">
      <h1 className="font-display text-4xl font-bold">Privacy Policy</h1>
      <p className="mt-5 text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
      <p className="mt-6 text-foreground/85">
        CryptoUptrend respects your privacy. We collect minimal analytics to understand how readers use our
        site, serve advertising via Google AdSense, and operate the service. We do not sell your personal data.
      </p>
      <h2 className="mt-8 font-display text-2xl font-bold">Information we collect</h2>
      <p className="mt-3 text-foreground/85">
        Standard server logs, anonymized analytics events, and optional newsletter sign-ups.
      </p>
      <h2 className="mt-6 font-display text-2xl font-bold">Advertising</h2>
      <p className="mt-3 text-foreground/85">
        We use Google AdSense, which may use cookies and identifiers as described in Google's policies.
      </p>
    </div>
  ),
});
