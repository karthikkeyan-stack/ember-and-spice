"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  UtensilsCrossed,
  ListTree,
  Images,
  CalendarDays,
  MessageSquareQuote,
  Mail,
  ArrowRight,
  Check,
  X,
} from "lucide-react";
import { api, Spinner, StatusPill, useToast } from "@/components/admin/ui";
import { formatDate, formatTime12 } from "@/lib/utils";

type Reservation = {
  id: number;
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  status: string;
  specialRequest: string;
};
type Message = {
  id: number;
  name: string;
  subject: string;
  message: string;
  read: boolean;
  email: string;
};

export default function DashboardPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({ menu: 0, categories: 0, gallery: 0, reservations: 0, reviews: 0 });
  const [pending, setPending] = useState<Reservation[]>([]);
  const [unread, setUnread] = useState<Message[]>([]);

  async function load() {
    try {
      const [menu, cats, gallery, res, revs, msgs] = await Promise.all([
        api<{ items: unknown[] }>("/api/admin/menu"),
        api<{ categories: unknown[] }>("/api/admin/categories"),
        api<{ images: unknown[] }>("/api/admin/gallery"),
        api<{ reservations: Reservation[] }>("/api/admin/reservations"),
        api<{ reviews: unknown[] }>("/api/admin/reviews"),
        api<{ messages: Message[] }>("/api/admin/messages"),
      ]);
      setCounts({
        menu: menu.items.length,
        categories: cats.categories.length,
        gallery: gallery.images.length,
        reservations: res.reservations.length,
        reviews: revs.reviews.length,
      });
      setPending(res.reservations.filter((r) => r.status === "pending").slice(0, 6));
      setUnread(msgs.messages.filter((m) => !m.read).slice(0, 4));
    } catch (e) {
      toast(e instanceof Error ? e.message : "Couldn't load dashboard", "err");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function setStatus(r: Reservation, status: string) {
    try {
      await api(`/api/admin/reservations/${r.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      toast(`Reservation ${status}`);
      load();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Update failed", "err");
    }
  }

  async function markRead(m: Message) {
    try {
      await api(`/api/admin/messages/${m.id}`, { method: "PATCH", body: JSON.stringify({ read: !m.read }) });
      load();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Update failed", "err");
    }
  }

  if (loading) return <Spinner />;

  const stats = [
    { label: "Menu items", value: counts.menu, href: "/admin/menu", Icon: UtensilsCrossed },
    { label: "Categories", value: counts.categories, href: "/admin/categories", Icon: ListTree },
    { label: "Gallery photos", value: counts.gallery, href: "/admin/gallery", Icon: Images },
    { label: "Reservations", value: counts.reservations, href: "/admin/reservations", Icon: CalendarDays },
    { label: "Reviews", value: counts.reviews, href: "/admin/reviews", Icon: MessageSquareQuote },
  ];

  return (
    <div className="space-y-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-3">Overview</p>
          <h1 className="display-2">Good service starts here</h1>
          <p className="text-sm text-mute mt-2">
            Everything the dining room needs — menu, photos, tables and reviews — in one place.
          </p>
        </div>
      </header>

      {/* stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {stats.map(({ label, value, href, Icon }) => (
          <Link
            key={label}
            href={href}
            className="group bg-paper border border-line rounded-2xl p-5 hover:border-ember/50 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-ink/10 transition-all duration-300"
          >
            <span className="w-9 h-9 rounded-xl bg-ember/10 border border-ember/25 flex items-center justify-center mb-4">
              <Icon className="w-4 h-4 text-ember" />
            </span>
            <p className="font-display text-3xl">{value}</p>
            <p className="text-[0.66rem] font-extrabold tracking-[0.18em] uppercase text-mute mt-1 group-hover:text-ink transition-colors">
              {label}
            </p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {/* pending reservations */}
        <section className="bg-paper border border-line rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-line">
            <h2 className="font-display text-lg">Pending reservations</h2>
            <Link href="/admin/reservations" className="link-arrow !text-[0.66rem]">
              All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {pending.length === 0 ? (
            <p className="px-6 py-10 text-sm text-mute">Nothing waiting — all clear.</p>
          ) : (
            <ul className="divide-y divide-line/70">
              {pending.map((r) => (
                <li key={r.id} className="px-6 py-4 flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-ink text-cream flex items-center justify-center text-sm font-extrabold flex-none">
                    {r.name.slice(0, 1)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{r.name}</p>
                    <p className="text-xs text-mute">
                      {formatDate(r.date)} · {formatTime12(r.time)} · {r.guests} guests
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setStatus(r, "confirmed")}
                      aria-label={`Confirm ${r.name}`}
                      className="w-9 h-9 rounded-full bg-leaf/10 border border-leaf/40 text-leaf flex items-center justify-center hover:bg-leaf hover:text-cream transition-all"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatus(r, "cancelled")}
                      aria-label={`Cancel ${r.name}`}
                      className="w-9 h-9 rounded-full bg-[#8e3b2c]/10 border border-[#8e3b2c]/40 text-[#8e3b2c] flex items-center justify-center hover:bg-[#8e3b2c] hover:text-cream transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* inbox */}
        <section className="bg-paper border border-line rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-line">
            <h2 className="font-display text-lg">Contact inbox</h2>
            <span className="inline-flex items-center gap-2 text-[0.66rem] font-extrabold tracking-[0.16em] uppercase text-mute">
              <Mail className="w-3.5 h-3.5" /> {unread.length} unread
            </span>
          </div>
          {unread.length === 0 ? (
            <p className="px-6 py-10 text-sm text-mute">Inbox zero. Messages from the contact page appear here.</p>
          ) : (
            <ul className="divide-y divide-line/70">
              {unread.map((m) => (
                <li key={m.id} className="px-6 py-4">
                  <div className="flex items-center justify-between gap-4 mb-1">
                    <p className="font-semibold text-sm">{m.name}</p>
                    <StatusPill status={m.subject} />
                  </div>
                  <p className="text-xs text-mute line-clamp-2 mb-2.5">{m.message}</p>
                  <button
                    type="button"
                    onClick={() => markRead(m)}
                    className="text-[0.66rem] font-extrabold tracking-[0.14em] uppercase text-ember hover:text-ember-deep transition-colors"
                  >
                    Mark as read
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
