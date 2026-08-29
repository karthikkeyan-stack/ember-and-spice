import type { Metadata } from "next";
import { Phone, Clock, Users, CalendarCheck } from "lucide-react";
import PageHero from "@/components/site/page-hero";
import ReservationForm from "@/components/site/reservation-form";
import { Reveal } from "@/components/bits";
import { getOpenStatus, getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Reserve a Table",
  description:
    "Request a table at EMBER & SPICE, Coimbatore. Pick a date, time and party size — the team confirms shortly.",
};

export default async function ReservePage() {
  const settings = await getSettings();
  const status = getOpenStatus(settings.hours);

  return (
    <>
      <PageHero
        eyebrow="Reservations"
        image="https://images.pexels.com/photos/30420679/pexels-photo-30420679.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
        title={
          <>
            Your table is <span className="it text-ember">waiting</span>
          </>
        }
        sub="Request a table below — this demo saves your request to the restaurant's admin panel in real time. For same-evening tables, calling is faster."
      />

      <section className="bg-cream py-20 md:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <Reveal>
              <p className="eyebrow mb-6">Good to know</p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="display-3 mb-8">Before you book</h2>
            </Reveal>
            <div className="space-y-4">
              {[
                {
                  Icon: CalendarCheck,
                  title: "Requests land instantly",
                  text: "Your request appears in the manager's dashboard the moment you send it. Demo or not, the plumbing is real.",
                },
                {
                  Icon: Users,
                  title: "Groups of 8+",
                  text: "For large tables, banana-leaf lunches or celebrations, call or WhatsApp and we'll set the room up properly.",
                },
                {
                  Icon: Clock,
                  title: "Kitchen timing",
                  text: "Last kitchen orders go in 30 minutes before closing. Breakfast service starts sharp at opening.",
                },
                {
                  Icon: Phone,
                  title: "Rather talk?",
                  text: settings.phone,
                },
              ].map(({ Icon, title, text }, i) => (
                <Reveal key={title} delay={i * 80}>
                  <div className="flex gap-4 bg-paper border border-line rounded-2xl p-5">
                    <span className="w-10 h-10 rounded-full bg-ember/10 border border-ember/25 flex items-center justify-center flex-none">
                      <Icon className="w-4.5 h-4.5 text-ember" />
                    </span>
                    <div>
                      <h3 className="font-display text-base mb-1">{title}</h3>
                      <p className="text-sm text-mute leading-relaxed">{text}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={300}>
              <p className="mt-8 inline-flex items-center gap-2 text-[0.7rem] font-extrabold tracking-[0.18em] uppercase text-mute">
                <span className={`w-1.5 h-1.5 rounded-full ${status.open ? "bg-leaf" : "bg-ember"}`} />
                {status.label}
              </p>
            </Reveal>
          </div>

          <Reveal delay={150}>
            <div className="bg-paper border border-line rounded-3xl p-7 md:p-10 shadow-xl shadow-ink/5">
              <h2 className="display-3 mb-2">Request a table</h2>
              <p className="text-sm text-mute mb-8">
                Fill this in and the team will confirm. Demo mode — no payment, no spam.
              </p>
              <ReservationForm />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
