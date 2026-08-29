"use client";

import { useEffect, useState } from "react";
import { Loader2, Save, Clock } from "lucide-react";
import { api, Spinner, Toggle, useToast } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

type DayHours = { open: string; close: string; closed: boolean };
type Settings = {
  restaurantName: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  instagramUrl: string;
  facebookUrl: string;
  whatsappNumber: string;
  mapsUrl: string;
  mapsEmbedUrl: string;
  hours: Record<string, DayHours>;
};

const DAYS: [string, string][] = [
  ["mon", "Monday"],
  ["tue", "Tuesday"],
  ["wed", "Wednesday"],
  ["thu", "Thursday"],
  ["fri", "Friday"],
  ["sat", "Saturday"],
  ["sun", "Sunday"],
];

const FALLBACK_DAY: DayHours = { open: "07:00", close: "22:30", closed: false };

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [s, setS] = useState<Settings | null>(null);

  useEffect(() => {
    api<{ settings: Settings }>("/api/admin/settings")
      .then((d) => setS(d.settings))
      .catch((e) => toast(e instanceof Error ? e.message : "Load failed", "err"))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function save() {
    if (!s) return;
    setSaving(true);
    try {
      await api("/api/admin/settings", { method: "PATCH", body: JSON.stringify(s) });
      toast("Settings saved — live across the site");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Save failed", "err");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !s) return <Spinner />;

  const set = (key: keyof Settings, value: string) => setS({ ...s, [key]: value });
  const setDay = (day: string, patch: Partial<DayHours>) =>
    setS({ ...s, hours: { ...s.hours, [day]: { ...(s.hours[day] ?? FALLBACK_DAY), ...patch } } });

  return (
    <div className="space-y-8 max-w-3xl">
      <header>
        <p className="eyebrow mb-3">Restaurant</p>
        <h1 className="display-2">Settings</h1>
        <p className="text-sm text-mute mt-2">
          These values feed the navbar, footer, contact page and the open-now badge. Colours and the
          logo itself live in the design system (see README).
        </p>
      </header>

      <section className="bg-paper border border-line rounded-2xl p-6 md:p-8 space-y-5">
        <h2 className="font-display text-lg">Identity</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="field-label" htmlFor="st-name">Restaurant name</label>
            <input id="st-name" className="field" value={s.restaurantName} onChange={(e) => set("restaurantName", e.target.value)} />
          </div>
          <div>
            <label className="field-label" htmlFor="st-tag">Tagline</label>
            <input id="st-tag" className="field" value={s.tagline} onChange={(e) => set("tagline", e.target.value)} />
          </div>
        </div>
      </section>

      <section className="bg-paper border border-line rounded-2xl p-6 md:p-8 space-y-5">
        <h2 className="font-display text-lg">Contact</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="field-label" htmlFor="st-phone">Phone</label>
            <input id="st-phone" className="field" value={s.phone} onChange={(e) => set("phone", e.target.value)} />
          </div>
          <div>
            <label className="field-label" htmlFor="st-email">Email</label>
            <input id="st-email" className="field" value={s.email} onChange={(e) => set("email", e.target.value)} />
          </div>
        </div>
        <div>
          <label className="field-label" htmlFor="st-addr">Address</label>
          <textarea
            id="st-addr"
            className="field resize-none"
            rows={2}
            value={s.address}
            onChange={(e) => set("address", e.target.value)}
          />
        </div>
      </section>

      <section className="bg-paper border border-line rounded-2xl p-6 md:p-8 space-y-5">
        <h2 className="font-display text-lg">Social & maps</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="field-label" htmlFor="st-ig">Instagram URL</label>
            <input id="st-ig" className="field" value={s.instagramUrl} onChange={(e) => set("instagramUrl", e.target.value)} />
          </div>
          <div>
            <label className="field-label" htmlFor="st-fb">Facebook URL</label>
            <input id="st-fb" className="field" value={s.facebookUrl} onChange={(e) => set("facebookUrl", e.target.value)} />
          </div>
          <div>
            <label className="field-label" htmlFor="st-wa">WhatsApp number (international, digits only)</label>
            <input id="st-wa" className="field" value={s.whatsappNumber} onChange={(e) => set("whatsappNumber", e.target.value)} placeholder="91XXXXXXXXXX" />
          </div>
          <div>
            <label className="field-label" htmlFor="st-maps">Google Maps link URL</label>
            <input id="st-maps" className="field" value={s.mapsUrl} onChange={(e) => set("mapsUrl", e.target.value)} />
          </div>
        </div>
        <div>
          <label className="field-label" htmlFor="st-embed">Google Maps embed URL (optional)</label>
          <input
            id="st-embed"
            className="field"
            value={s.mapsEmbedUrl}
            onChange={(e) => set("mapsEmbedUrl", e.target.value)}
            placeholder="https://www.google.com/maps/embed?pb=…"
          />
          <p className="text-xs text-mute mt-2">
            Paste the “Share → Embed a map” src to replace the map placeholder on the homepage with a live map.
          </p>
        </div>
      </section>

      <section className="bg-paper border border-line rounded-2xl p-6 md:p-8">
        <h2 className="font-display text-lg flex items-center gap-2.5 mb-6">
          <Clock className="w-4.5 h-4.5 text-ember" /> Opening hours
        </h2>
        <ul className="space-y-3">
          {DAYS.map(([key, label]) => {
            const h = s.hours[key] ?? FALLBACK_DAY;
            return (
              <li
                key={key}
                className={cn(
                  "flex items-center gap-3 sm:gap-5 flex-wrap rounded-xl border border-line px-4 py-3",
                  h.closed && "opacity-55"
                )}
              >
                <span className="font-semibold text-sm w-24 flex-none">{label}</span>
                <div className="flex items-center gap-2 flex-1 min-w-[12rem]">
                  <input
                    type="time"
                    className="field !py-2 !px-3 !w-[8.2rem]"
                    value={h.open}
                    disabled={h.closed}
                    onChange={(e) => setDay(key, { open: e.target.value })}
                    aria-label={`${label} opening time`}
                  />
                  <span className="text-mute text-sm">–</span>
                  <input
                    type="time"
                    className="field !py-2 !px-3 !w-[8.2rem]"
                    value={h.close}
                    disabled={h.closed}
                    onChange={(e) => setDay(key, { close: e.target.value })}
                    aria-label={`${label} closing time`}
                  />
                </div>
                <Toggle
                  checked={!h.closed}
                  onChange={(v) => setDay(key, { closed: !v })}
                  label={h.closed ? "Closed" : "Open"}
                />
              </li>
            );
          })}
        </ul>
      </section>

      <div className="sticky bottom-5 flex justify-end">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="btn btn-primary !py-4 !px-8 shadow-2xl shadow-ember/30"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving…" : "Save all settings"}
        </button>
      </div>
    </div>
  );
}
