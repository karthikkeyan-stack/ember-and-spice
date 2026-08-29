import Link from "next/link";
import {
  ArrowRight,
  ArrowDown,
  MapPin,
  Phone,
  Mail,
  Clock,
  Flame,
  Leaf,
  Wheat,
  HandPlatter,
} from "lucide-react";
import { getApprovedReviews, getSignatureItems } from "@/lib/data";
import { getOpenStatus, getSettings, DAY_ORDER, DAY_LABELS } from "@/lib/settings";
import { formatTime12, cn } from "@/lib/utils";
import { Reveal, Stars } from "@/components/bits";
import { DishCard } from "@/components/site/dish";

export const dynamic = "force-dynamic";

const MARQUEE = [
  "Masala Dosa",
  "Chicken 65",
  "Filter Coffee",
  "Chettinad Curry",
  "Ghee Podi Idli",
  "Seeraga Samba Biryani",
  "Paruppu Payasam",
  "Ghee Roast",
];

export default async function HomePage() {
  const [settings, signature, reviewsList] = await Promise.all([
    getSettings(),
    getSignatureItems(6),
    getApprovedReviews(3),
  ]);
  const status = getOpenStatus(settings.hours);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: "Ember & Spice",
    servesCuisine: ["South Indian", "Chettinad", "Indian"],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Coimbatore",
      addressRegion: "Tamil Nadu",
      addressCountry: "IN",
    },
    description:
      "Premium South Indian dining in Coimbatore — thoughtfully prepared dishes, warm hospitality.",
    // Demo placeholder — replace with real details before production use.
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ============================= HERO ============================= */}
      <section className="relative min-h-svh flex flex-col bg-ink text-cream overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: "url(/images/hero.jpg)" }}
          role="img"
          aria-label="A South Indian spread — crisp dosa, chutneys and filter coffee on a dark table"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/35 to-ink"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-ink/70 via-transparent to-transparent"
          aria-hidden="true"
        />

        <div className="container-x relative flex-1 flex flex-col justify-center pt-32 pb-24">
          <Reveal>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3 mb-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-line-light bg-ink/40 backdrop-blur px-4 py-2 text-[0.68rem] font-bold tracking-[0.2em] uppercase">
                <span className={cn("w-1.5 h-1.5 rounded-full", status.open ? "bg-leaf" : "bg-ember")} />
                {status.open ? "Open today" : "Currently closed"}
              </span>
              <span className="text-[0.68rem] font-bold tracking-[0.28em] uppercase text-cream/60">
                Coimbatore · Tamil Nadu
              </span>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <h1 className="display-1 max-w-4xl">
              South Indian flavours,
              <br />
              served with a <span className="it text-ember">modern soul</span>.
            </h1>
          </Reveal>

          <Reveal delay={240}>
            <p className="mt-7 max-w-lg text-cream/70 text-base md:text-lg leading-relaxed">
              Thoughtfully prepared South Indian dishes, warm hospitality, and an
              inviting dining room in the heart of Coimbatore.
            </p>
          </Reveal>

          <Reveal delay={360}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link href="/menu" className="btn btn-primary">
                View menu <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/contact" className="btn btn-ghost">
                Visit us
              </Link>
            </div>
          </Reveal>
        </div>

        <div className="relative border-t border-line-light/50">
          <div className="container-x py-5 flex items-center justify-between gap-4 text-[0.66rem] font-bold tracking-[0.22em] uppercase text-cream/50">
            <span className="hidden sm:block">Est. as a concept · MMXXVI</span>
            <span className="hidden md:block">11.0168° N — 76.9558° E</span>
            <span className="inline-flex items-center gap-2">
              Scroll <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
            </span>
          </div>
        </div>
      </section>

      {/* =========================== MARQUEE ============================ */}
      <div className="marquee bg-ember text-cream border-y border-ember-deep/40 py-4" aria-hidden="true">
        {[0, 1].map((n) => (
          <div className="marquee-track" key={n}>
            {MARQUEE.map((dish) => (
              <span key={`${n}-${dish}`} className="flex items-center gap-14">
                <span className="font-display it text-xl md:text-2xl whitespace-nowrap">{dish}</span>
                <Flame className="w-3.5 h-3.5 flex-none opacity-70" />
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* ============================= INTRO ============================ */}
      <section className="py-24 md:py-36 bg-cream relative overflow-hidden">
        <div className="container-x grid gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <Reveal>
              <p className="eyebrow mb-6">The restaurant</p>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="display-2 max-w-xl">
                A modern take on <span className="it text-ember">South Indian</span> dining.
              </h2>
            </Reveal>
            <Reveal delay={200}>
              <p className="mt-7 text-mute leading-relaxed max-w-xl">
                Ember & Spice grew from a simple idea — that the food we grew up with
                deserves the same care in the dining room as it gets in the kitchen.
                Podi is ground in small batches, dosa batter ferments overnight, and
                the coffee decoction is pulled every morning.
              </p>
            </Reveal>
            <Reveal delay={280}>
              <p className="mt-4 text-mute leading-relaxed max-w-xl">
                The room is warm and uncluttered; the menu stays close to home. Come for
                a slow breakfast, a banana-leaf lunch, or biryani that arrives still
                sealed and steaming.
              </p>
            </Reveal>
            <Reveal delay={340}>
              <div className="mt-9 grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { Icon: Wheat, title: "Ground fresh", text: "Masalas and podi made in-house, in small batches." },
                  { Icon: Leaf, title: "Honest produce", text: "Vegetables, dairy and meats sourced with care." },
                  { Icon: HandPlatter, title: "Warm by default", text: "Unhurried service — the way a meal should feel." },
                ].map(({ Icon, title, text }) => (
                  <div key={title} className="border-t-2 border-ink/80 pt-4">
                    <Icon className="w-5 h-5 text-ember mb-3" />
                    <h3 className="font-display text-base mb-1">{title}</h3>
                    <p className="text-xs text-mute leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={400}>
              <Link href="/about" className="link-arrow mt-10">
                Our story <ArrowRight className="w-4 h-4" />
              </Link>
            </Reveal>
          </div>

          <Reveal delay={200} className="relative">
            <div className="img-frame rounded-3xl aspect-[4/5] shadow-2xl shadow-ink/20">
              <img src="/images/interior.jpg" alt="The warm, wood-and-cane dining room at Ember & Spice" loading="lazy" />
            </div>
            <div className="absolute -bottom-8 -left-6 md:-left-10 w-40 md:w-56 img-frame rounded-2xl aspect-square border-[6px] border-cream shadow-xl shadow-ink/25 rotate-[-4deg] hidden sm:block">
              <img src="/images/kitchen.jpg" alt="Spices being tempered in the Ember & Spice kitchen" loading="lazy" />
            </div>
            <div className="absolute -top-5 -right-4 md:-right-6 bg-ink text-cream rounded-2xl px-5 py-4 rotate-2 shadow-lg">
              <p className="font-display it text-lg leading-tight">Batter fermented</p>
              <p className="text-[0.62rem] tracking-[0.24em] uppercase text-cream/50 font-bold mt-1">
                overnight, always
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========================= SIGNATURE MENU ======================== */}
      <section className="py-24 md:py-32 bg-cream-2/60">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
            <div>
              <Reveal>
                <p className="eyebrow mb-5">From the kitchen</p>
              </Reveal>
              <Reveal delay={100}>
                <h2 className="display-2">
                  Dishes we're <span className="it text-ember">known for</span>
                </h2>
              </Reveal>
            </div>
            <Reveal delay={200}>
              <Link href="/menu" className="btn btn-outline">
                View full menu <ArrowRight className="w-4 h-4" />
              </Link>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {signature.map((item, i) => (
              <Reveal key={item.id} delay={(i % 3) * 110}>
                <DishCard item={item} />
              </Reveal>
            ))}
          </div>

          <Reveal delay={150}>
            <p className="mt-12 text-center text-xs text-mute tracking-[0.14em] uppercase">
              Vegetarian and vegan-friendly choices throughout the menu · Sample prices shown for the demo
            </p>
          </Reveal>
        </div>
      </section>

      {/* =========================== THE ROOM =========================== */}
      <section className="relative bg-ink text-cream py-24 md:py-36 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: "url(/images/interior.jpg)" }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/40" aria-hidden="true" />
        <div className="container-x relative grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <Reveal>
              <p className="eyebrow eyebrow--cream mb-6">The room</p>
            </Reveal>
            <Reveal delay={120}>
              <h2 className="display-2 max-w-lg">
                Warm wood, low light, <span className="it text-ember-tint">and the smell of ghee</span>.
              </h2>
            </Reveal>
            <Reveal delay={220}>
              <p className="mt-7 text-cream/65 leading-relaxed max-w-md">
                We kept the room simple — cane lamps, dark timber, an open pass where you
                can watch dosas hit the tawa. Breakfast runs slow and bright; dinner is
                low-lit and easy. Families, first dates, solo coffee — all are regulars here.
              </p>
            </Reveal>
            <Reveal delay={300}>
              <div className="mt-9 flex flex-wrap gap-4">
                <Link href="/reserve" className="btn btn-primary">
                  Reserve a table
                </Link>
                <Link href="/gallery" className="btn btn-ghost">
                  See the gallery
                </Link>
              </div>
            </Reveal>
          </div>
          <Reveal delay={250} className="hidden lg:block">
            <div className="grid grid-cols-2 gap-5">
              <div className="img-frame rounded-2xl aspect-[3/4] mt-10 rotate-[-2deg]">
                <img src="/images/kitchen.jpg" alt="Inside the kitchen — tempering spices" loading="lazy" />
              </div>
              <div className="img-frame rounded-2xl aspect-[3/4] rotate-[2deg]">
                <img src="/images/food/filter-coffee.jpg" alt="Filter coffee being poured at the counter" loading="lazy" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================ REVIEWS =========================== */}
      <section className="py-24 md:py-32 bg-cream">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
            <div>
              <Reveal>
                <p className="eyebrow mb-5">Word of mouth</p>
              </Reveal>
              <Reveal delay={100}>
                <h2 className="display-2">
                  Notes from the <span className="it text-ember">dining room</span>
                </h2>
              </Reveal>
            </div>
            <Reveal delay={200}>
              <Link href="/reviews" className="btn btn-outline">
                All reviews <ArrowRight className="w-4 h-4" />
              </Link>
            </Reveal>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {reviewsList.map((r, i) => (
              <Reveal key={r.id} delay={i * 120}>
                <figure className="h-full bg-paper border border-line rounded-2xl p-7 flex flex-col hover:-translate-y-1.5 hover:shadow-xl hover:shadow-ink/10 transition-all duration-500">
                  <div className="flex items-center justify-between mb-4">
                    <Stars rating={r.rating} />
                    <span className="text-[0.58rem] font-extrabold tracking-[0.16em] uppercase text-mute-light border border-line rounded-full px-2.5 py-1">
                      Sample testimonial
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
        </div>
      </section>

      {/* ============================ LOCATION ========================== */}
      <section id="visit" className="py-24 md:py-32 bg-cream-2/60 border-t border-line/60">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          <div>
            <Reveal>
              <p className="eyebrow mb-6">Find us</p>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="display-2 mb-8">
                In the heart of <span className="it text-ember">Coimbatore</span>
              </h2>
            </Reveal>
            <Reveal delay={180}>
              <div className="space-y-5 max-w-md">
                <p className="flex gap-4 text-ink/80">
                  <MapPin className="w-5 h-5 mt-0.5 flex-none text-ember" />
                  <span>{settings.address}</span>
                </p>
                <p className="flex gap-4 text-ink/80">
                  <Phone className="w-5 h-5 mt-0.5 flex-none text-ember" />
                  <a href={`tel:${settings.phone}`} className="hover:text-ember transition-colors">{settings.phone}</a>
                </p>
                <p className="flex gap-4 text-ink/80">
                  <Mail className="w-5 h-5 mt-0.5 flex-none text-ember" />
                  <a href={`mailto:${settings.email}`} className="hover:text-ember transition-colors">{settings.email}</a>
                </p>
                <p className="flex gap-4 text-ink/80">
                  <Clock className="w-5 h-5 mt-0.5 flex-none text-ember" />
                  <span>{status.label} · Kitchen closes 30 min before we do</span>
                </p>
              </div>
            </Reveal>
            <Reveal delay={260}>
              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href={settings.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-dark"
                >
                  Open in Google Maps <ArrowRight className="w-4 h-4" />
                </a>
                <Link href="/reserve" className="btn btn-outline">
                  Reserve a table
                </Link>
              </div>
            </Reveal>
          </div>

          <Reveal delay={200}>
            {settings.mapsEmbedUrl ? (
              <div className="h-full min-h-[22rem] rounded-3xl overflow-hidden border border-line shadow-xl shadow-ink/10">
                <iframe
                  src={settings.mapsEmbedUrl}
                  title="Ember & Spice on Google Maps"
                  className="w-full h-full min-h-[22rem]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            ) : (
            <div className="h-full min-h-[22rem] rounded-3xl border-2 border-dashed border-line bg-paper flex flex-col items-center justify-center text-center p-10 relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-[0.06]"
                style={{
                  backgroundImage:
                    "linear-gradient(var(--color-ink) 1px, transparent 1px), linear-gradient(90deg, var(--color-ink) 1px, transparent 1px)",
                  backgroundSize: "44px 44px",
                }}
                aria-hidden="true"
              />
              <MapPin className="w-9 h-9 text-ember mb-4 relative" />
              <p className="font-display text-xl relative">Map placeholder</p>
              <p className="mt-2 text-sm text-mute max-w-xs relative">
                Paste your Google Maps embed URL in the admin settings to show a live map here.
              </p>
              <p className="mt-5 text-[0.62rem] font-extrabold tracking-[0.22em] uppercase text-mute-light relative">
                On-site parking available nearby
              </p>
            </div>
            )}
          </Reveal>
        </div>
      </section>

      {/* ========================= HOURS STRIP ========================== */}
      <section className="bg-ink text-cream py-16 md:py-20 border-t border-line-light/40">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <h2 className="display-3">
              Breakfast <span className="it text-ember">through</span> dinner
            </h2>
            <p className="inline-flex items-center gap-2 text-[0.7rem] font-bold tracking-[0.18em] uppercase text-cream/60">
              <span className={cn("w-1.5 h-1.5 rounded-full", status.open ? "bg-leaf" : "bg-ember")} />
              {status.label}
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-x-6 gap-y-6">
            {DAY_ORDER.map((d) => {
              const h = settings.hours[d];
              return (
                <div key={d} className="border-t border-line-light pt-4">
                  <p className="text-[0.66rem] font-extrabold tracking-[0.2em] uppercase text-cream/50 mb-2">
                    {DAY_LABELS[d]}
                  </p>
                  <p className="text-sm text-cream/80 font-semibold">
                    {h.closed ? "Closed" : formatTime12(h.open)}
                  </p>
                  {!h.closed && (
                    <p className="text-sm text-cream/45">{formatTime12(h.close)}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
