import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MessageSquareQuote } from "lucide-react";
import PageHero from "@/components/site/page-hero";
import { Reveal, Stars } from "@/components/bits";
import { getApprovedReviews } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Reviews",
  description:
    "What guests say about EMBER & SPICE. Entries shown here are clearly-labelled sample testimonials for the portfolio demo.",
};

export default async function ReviewsPage() {
  const all = await getApprovedReviews();

  return (
    <>
      <PageHero
        eyebrow="Guest notes"
        title={
          <>
            Kind words, <span className="it text-ember">served straight</span>
          </>
        }
        sub="Every entry on this page is clearly labelled sample content for the demo — the layout and moderation flow are real."
      />

      <section className="bg-cream py-20 md:py-28">
        <div className="container-x">
          {all.length === 0 ? (
            <div className="py-24 text-center text-mute">
              <MessageSquareQuote className="w-9 h-9 mx-auto mb-4 text-ember/40" />
              <p className="font-display text-2xl">No reviews published yet</p>
              <p className="text-sm mt-2">Approved reviews from the admin panel appear here.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {all.map((r, i) => (
                <Reveal key={r.id} delay={(i % 3) * 100}>
                  <figure className="h-full bg-paper border border-line rounded-2xl p-7 flex flex-col hover:-translate-y-1 hover:shadow-lg hover:shadow-ink/10 transition-all duration-500">
                    <div className="flex items-center justify-between mb-4">
                      <Stars rating={r.rating} />
                      <span className="text-[0.58rem] font-extrabold tracking-[0.16em] uppercase text-mute-light border border-line rounded-full px-2.5 py-1">
                        {r.sample ? "Sample testimonial" : "Verified guest"}
                      </span>
                    </div>
                    <blockquote className="font-display it text-[1.05rem] leading-relaxed text-ink/85 flex-1">
                      “{r.review}”
                    </blockquote>
                    <figcaption className="mt-5 text-xs text-mute font-bold tracking-[0.14em] uppercase">
                      {r.customerName} · {r.date}
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          )}

          <Reveal delay={150}>
            <div className="mt-16 rounded-3xl bg-ink text-cream p-10 md:p-14 text-center relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  background:
                    "radial-gradient(50% 60% at 50% 0%, rgba(188,82,39,0.35), transparent 70%)",
                }}
                aria-hidden="true"
              />
              <div className="relative">
                <h2 className="display-2 mb-4">Eat first. <span className="it text-ember-tint">Judge after.</span></h2>
                <p className="text-cream/60 max-w-md mx-auto mb-8">
                  Book a table, tell us what you think in person — that feedback matters most.
                </p>
                <Link href="/reserve" className="btn btn-primary">
                  Reserve a table <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
