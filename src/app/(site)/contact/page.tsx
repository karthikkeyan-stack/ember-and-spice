import type { Metadata } from "next";
import { MapPin, Phone, Mail, MessageCircle, Clock } from "lucide-react";

function Instagram({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}
import PageHero from "@/components/site/page-hero";
import ContactForm from "@/components/site/contact-form";
import { Reveal } from "@/components/bits";
import { getOpenStatus, getSettings, DAY_LABELS, DAY_ORDER } from "@/lib/settings";
import { formatTime12 } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Reach EMBER & SPICE in Coimbatore — phone, email, WhatsApp and directions. Send us a message and we'll get back to you.",
};

export default async function ContactPage() {
  const settings = await getSettings();
  const status = getOpenStatus(settings.hours);

  const channels = [
    {
      Icon: Phone,
      label: "Call us",
      value: settings.phone,
      href: `tel:${settings.phone}`,
    },
    {
      Icon: Mail,
      label: "Email",
      value: settings.email,
      href: `mailto:${settings.email}`,
    },
    {
      Icon: MessageCircle,
      label: "WhatsApp",
      value: settings.phone,
      href: `https://wa.me/${settings.whatsappNumber}`,
    },
    {
      Icon: Instagram,
      label: "Instagram",
      value: "@emberandspice",
      href: settings.instagramUrl,
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Say hello — <span className="it text-ember">we answer fast</span>
          </>
        }
        sub="Questions, large bookings, catering or just to check if the biryani is still on. All contact details are editable in the admin panel."
      />

      <section className="bg-cream py-20 md:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          {/* info */}
          <div>
            <Reveal>
              <p className="eyebrow mb-6">Reach us</p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="display-3 mb-8">Every channel is open</h2>
            </Reveal>
            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              {channels.map(({ Icon, label, value, href }, i) => (
                <Reveal key={label} delay={i * 70}>
                  <a
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    className="group block bg-paper border border-line rounded-2xl p-5 hover:border-ember/60 hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <Icon className="w-5 h-5 text-ember mb-3" />
                    <p className="text-[0.62rem] font-extrabold tracking-[0.2em] uppercase text-mute mb-1">
                      {label}
                    </p>
                    <p className="font-display text-base group-hover:text-ember transition-colors break-all">
                      {value}
                    </p>
                  </a>
                </Reveal>
              ))}
            </div>

            <Reveal delay={200}>
              <div className="bg-paper border border-line rounded-2xl p-6">
                <p className="flex items-center gap-2.5 text-[0.68rem] font-extrabold tracking-[0.2em] uppercase text-mute mb-4">
                  <Clock className="w-4 h-4 text-ember" /> Opening hours · {status.label}
                </p>
                <ul className="space-y-2 text-sm">
                  {DAY_ORDER.map((d) => {
                    const h = settings.hours[d];
                    return (
                      <li key={d} className="flex justify-between">
                        <span className="text-ink/80">{DAY_LABELS[d]}</span>
                        <span className="text-mute">
                          {h.closed ? "Closed" : `${formatTime12(h.open)} – ${formatTime12(h.close)}`}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={260}>
              <p className="mt-8 flex gap-3 text-sm text-mute">
                <MapPin className="w-4 h-4 mt-0.5 flex-none text-ember" />
                {settings.address}
              </p>
            </Reveal>
          </div>

          {/* form */}
          <Reveal delay={150}>
            <div className="bg-paper border border-line rounded-3xl p-7 md:p-10 shadow-xl shadow-ink/5">
              <h2 className="display-3 mb-2">Send a message</h2>
              <p className="text-sm text-mute mb-8">
                We typically reply within a day. For same-day tables, call or WhatsApp instead.
              </p>
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
