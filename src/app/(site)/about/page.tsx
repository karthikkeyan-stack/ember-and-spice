import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Wheat, Leaf, Flame, UtensilsCrossed } from "lucide-react";
import PageHero from "@/components/site/page-hero";
import { Reveal } from "@/components/bits";

export const metadata: Metadata = {
  title: "About",
  description:
    "The story of EMBER & SPICE — a premium South Indian dining room in Coimbatore built on fresh-ground masalas, slow breakfasts and warm hospitality.",
};

const PRINCIPLES = [
  {
    Icon: Wheat,
    title: "Ground in-house",
    text: "Podi, sambar powder and Chettinad masala are stone-ground in small weekly batches. You can taste the difference in the first bite.",
  },
  {
    Icon: Flame,
    title: "Made to order",
    text: "Dosas hit the tawa when you order them, not before. Tempering is done per dish — the crackle arrives at the table with the food.",
  },
  {
    Icon: Leaf,
    title: "Sourced with care",
    text: "Vegetables from morning markets, dairy from farms we know, seeraga samba rice for biryani because it earns its place.",
  },
  {
    Icon: UtensilsCrossed,
    title: "Served warmly",
    text: "No rushing, no theatre. Our team reads the table — quick filter coffee refills, quiet suggestions, space when you want it.",
  },
];

const TIMELINE = [
  { year: "The idea", text: "Two friends from Coimbatore keep coming back to one thought: the tiffin we grew up on deserves a great dining room." },
  { year: "The kitchen", text: "Recipes collected from home kitchens across Kongu Nadu and Chettinad — tested, sharpened, and written down properly." },
  { year: "The room", text: "Warm timber, cane light, an open tawa station. Designed to feel like a special evening and a regular Tuesday at once." },
  { year: "Today", text: "Breakfast regulars, Sunday banana-leaf lunches, and a steady line for the evening filter coffee. Slow and steady, by design." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        image="/images/kitchen.jpg"
        title={
          <>
            Familiar food, <span className="it text-ember">a little more polish</span>
          </>
        }
        sub="Ember & Spice brings the South Indian dishes we grew up with into a modern, welcoming dining room in Coimbatore."
      />

      {/* story */}
      <section className="py-24 md:py-32 bg-cream">
        <div className="container-x grid gap-14 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <div className="img-frame rounded-3xl aspect-[4/3] shadow-xl shadow-ink/15">
              <img
                src="/images/food/meals.jpg"
                alt="A full banana-leaf meal served at Ember & Spice"
                loading="lazy"
              />
            </div>
          </Reveal>
          <div>
            <Reveal>
              <p className="eyebrow mb-6">Our story</p>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="display-2 mb-6">
                Comfort, quality, and the <span className="it text-ember">right amount of heat</span>
              </h2>
            </Reveal>
            <Reveal delay={180}>
              <p className="text-mute leading-relaxed">
                Coimbatore eats well — the city doesn't need convincing about good food.
                What we wanted to build was a room: somewhere you could take a client,
                bring your grandmother, or sit alone with a coffee and nobody would look
                twice. The food stays close to home — Kongu breakfasts, Chettinad
                gravies, Chettinad-spice biryani — prepared with more patience than
                shortcuts.
              </p>
            </Reveal>
            <Reveal delay={260}>
              <p className="mt-4 text-mute leading-relaxed">
                We ferment our batter overnight, grind our podi ourselves, and pull the
                coffee decoction every morning. None of it is complicated. All of it
                matters. That's the whole philosophy, really.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* principles */}
      <section className="py-24 md:py-28 bg-ink text-cream">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow eyebrow--cream mb-5">How we work</p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="display-2 max-w-2xl mb-14">
              Four things we don't <span className="it text-ember-tint">compromise on</span>
            </h2>
          </Reveal>
          <div className="grid gap-px bg-line-light/60 sm:grid-cols-2 rounded-2xl overflow-hidden border border-line-light">
            {PRINCIPLES.map(({ Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 90}>
                <div className="bg-ink h-full p-8 md:p-10">
                  <Icon className="w-6 h-6 text-ember mb-5" />
                  <h3 className="font-display text-xl mb-3">{title}</h3>
                  <p className="text-sm text-cream/60 leading-relaxed">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* timeline */}
      <section className="py-24 md:py-32 bg-cream-2/50">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow mb-5">So far</p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="display-2 mb-14">The road to the <span className="it text-ember">first dosa</span></h2>
          </Reveal>
          <div className="grid gap-10 md:grid-cols-4">
            {TIMELINE.map((t, i) => (
              <Reveal key={t.year} delay={i * 110}>
                <div className="border-t-2 border-ember pt-5">
                  <p className="font-display it text-2xl text-ember mb-3">{t.year}</p>
                  <p className="text-sm text-mute leading-relaxed">{t.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={200}>
            <div className="mt-16 flex flex-wrap gap-4">
              <Link href="/menu" className="btn btn-dark">
                Browse the menu <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/reserve" className="btn btn-outline">
                Reserve a table
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
