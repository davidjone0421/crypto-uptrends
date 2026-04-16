import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — CryptoUptrend" },
      { name: "description", content: "Get in touch with the CryptoUptrend editorial team for tips, partnerships, or press inquiries." },
      { property: "og:title", content: "Contact CryptoUptrend" },
      { property: "og:description", content: "Tips, partnerships, and press inquiries." },
    ],
  }),
  component: () => (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-6">
      <h1 className="font-display text-4xl font-bold">Contact Us</h1>
      <p className="mt-5 text-muted-foreground">
        For news tips, story pitches, partnerships, or press inquiries, reach our team at:
      </p>
      <div className="mt-6 space-y-2 text-foreground/90">
        <p><strong>Editorial:</strong> editorial@cryptouptrend.com</p>
        <p><strong>Press:</strong> press@cryptouptrend.com</p>
        <p><strong>Partnerships:</strong> partners@cryptouptrend.com</p>
      </div>
    </div>
  ),
});
