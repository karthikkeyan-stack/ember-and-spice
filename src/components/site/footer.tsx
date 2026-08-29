import Link from "next/link";
import { MessageCircle, Phone, Mail, MapPin, ArrowUpRight } from "lucide-react";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}
import { Logo } from "@/components/site/logo";
import { DAY_LABELS, DAY_ORDER, getOpenStatus, type SiteSettings } from "@/lib/settings";
import { formatTime12 } from "@/lib/utils";

export default function Footer({ settings }: { settings: SiteSettings }) {
  const status = getOpenStatus(settings.hours);

  return (
    <footer className="bg-ink text-cream mt-0">
      <div className="container-x py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* brand */}
          <div className="space-y-5">
            <Logo tone="cream" />
            <p className="text-cream/60 text-sm leading-relaxed max-w-xs">
              {settings.tagline} Thoughtfully prepared food, warm hospitality, and a room
              made for lingering.
            </p>
            <div className="flex items-center gap-3">
              {[
                { href: settings.instagramUrl, label: "Instagram", Icon: InstagramIcon },
                { href: settings.facebookUrl, label: "Facebook", Icon: FacebookIcon },
                {
                  href: `https://wa.me/${settings.whatsappNumber}`,
                  label: "WhatsApp",
                  Icon: MessageCircle,
                },
              ].map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-line-light text-cream/70 hover:text-cream hover:border-cream/60 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* explore */}
          <div>
            <h3 className="text-[0.68rem] font-extrabold tracking-[0.26em] uppercase text-cream/40 mb-5">
              Explore
            </h3>
            <ul className="space-y-2.5 text-sm">
              {[
                ["Menu", "/menu"],
                ["About", "/about"],
                ["Gallery", "/gallery"],
                ["Reviews", "/reviews"],
                ["Contact", "/contact"],
                ["Reserve a table", "/reserve"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="group inline-flex items-center gap-1.5 text-cream/70 hover:text-cream transition-colors"
                  >
                    {label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* visit */}
          <div>
            <h3 className="text-[0.68rem] font-extrabold tracking-[0.26em] uppercase text-cream/40 mb-5">
              Visit us
            </h3>
            <ul className="space-y-3.5 text-sm text-cream/70">
              <li className="flex gap-3">
                <MapPin className="w-4 h-4 mt-0.5 flex-none text-ember" />
                <span>{settings.address}</span>
              </li>
              <li className="flex gap-3">
                <Phone className="w-4 h-4 mt-0.5 flex-none text-ember" />
                <a href={`tel:${settings.phone}`} className="hover:text-cream transition-colors">
                  {settings.phone}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="w-4 h-4 mt-0.5 flex-none text-ember" />
                <a href={`mailto:${settings.email}`} className="hover:text-cream transition-colors">
                  {settings.email}
                </a>
              </li>
            </ul>
          </div>

          {/* hours */}
          <div>
            <h3 className="text-[0.68rem] font-extrabold tracking-[0.26em] uppercase text-cream/40 mb-5">
              Opening hours
            </h3>
            <ul className="space-y-1.5 text-sm text-cream/70 mb-4">
              {DAY_ORDER.map((d) => {
                const h = settings.hours[d];
                return (
                  <li key={d} className="flex justify-between gap-4">
                    <span>{DAY_LABELS[d].slice(0, 3)}</span>
                    <span className="text-cream/50">
                      {h.closed ? "Closed" : `${formatTime12(h.open)} – ${formatTime12(h.close)}`}
                    </span>
                  </li>
                );
              })}
            </ul>
            <p className="inline-flex items-center gap-2 text-[0.68rem] font-bold tracking-[0.14em] uppercase text-cream/60">
              <span className={`w-1.5 h-1.5 rounded-full ${status.open ? "bg-leaf" : "bg-ember"}`} />
              {status.label}
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-line-light">
        <div className="container-x py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-cream/40">
          <p>© 2026 {settings.restaurantName}. Demo portfolio project — sample content throughout.</p>
          <div className="flex items-center gap-5">
            <span>Coimbatore · Tamil Nadu</span>
            <Link href="/admin/login" className="hover:text-cream/70 transition-colors">
              Team sign-in
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
