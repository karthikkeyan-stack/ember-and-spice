import { db } from "@/db";
import { settings } from "@/db/schema";
import { formatTime12, toMinutes } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  TYPES                                                             */
/* ------------------------------------------------------------------ */

export type DayHours = { open: string; close: string; closed: boolean };
export type WeekHours = Record<string, DayHours>;

export const DAY_ORDER = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;

export const DAY_LABELS: Record<string, string> = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
};

export type SiteSettings = {
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
  hours: WeekHours;
};

/* ------------------------------------------------------------------ */
/*  DEFAULTS — all fully editable in /admin/settings                  */
/* ------------------------------------------------------------------ */

export const DEFAULT_HOURS: WeekHours = {
  mon: { open: "07:00", close: "22:30", closed: false },
  tue: { open: "07:00", close: "22:30", closed: false },
  wed: { open: "07:00", close: "22:30", closed: false },
  thu: { open: "07:00", close: "22:30", closed: false },
  fri: { open: "07:00", close: "22:30", closed: false },
  sat: { open: "07:00", close: "23:00", closed: false },
  sun: { open: "07:00", close: "23:00", closed: false },
};

export const DEFAULT_SETTINGS: SiteSettings = {
  restaurantName: "Ember & Spice",
  tagline: "Premium South Indian dining in Coimbatore.",
  phone: "+91 00000 00000",
  email: "hello@emberandspice.example",
  address: "[Restaurant Address], Coimbatore, Tamil Nadu — 641 001",
  instagramUrl: "https://www.instagram.com/",
  facebookUrl: "https://www.facebook.com/",
  whatsappNumber: "910000000000",
  mapsUrl: "https://maps.google.com/?q=Coimbatore,+Tamil+Nadu",
  mapsEmbedUrl: "",
  hours: DEFAULT_HOURS,
};

/* ------------------------------------------------------------------ */
/*  READ / WRITE                                                      */
/* ------------------------------------------------------------------ */

export async function getSettings(): Promise<SiteSettings> {
  try {
    const rows = await db.select().from(settings);
    const map = new Map(rows.map((r) => [r.key, r.value]));
    const parsed: Record<string, unknown> = { ...DEFAULT_SETTINGS };
    for (const [key, value] of map) {
      if (key === "hours") {
        try {
          parsed.hours = { ...DEFAULT_HOURS, ...(JSON.parse(value) as WeekHours) };
        } catch {
          parsed.hours = DEFAULT_HOURS;
        }
      } else if (key in DEFAULT_SETTINGS) {
        parsed[key] = value;
      }
    }
    return parsed as unknown as SiteSettings;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function setSetting(key: string, value: string) {
  await db
    .insert(settings)
    .values({ key, value })
    .onConflictDoUpdate({ target: settings.key, set: { value } });
}

/* ------------------------------------------------------------------ */
/*  OPEN NOW LOGIC (Asia/Kolkata)                                     */
/* ------------------------------------------------------------------ */

export type OpenStatus = {
  open: boolean;
  label: string;
};

export function getOpenStatus(hours: WeekHours, now = new Date()): OpenStatus {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Kolkata",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).formatToParts(now);
    const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
    const weekday = DAY_ORDER[
      ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"))
    ] as string;
    const minutes = Number(get("hour")) % 24 * 60 + Number(get("minute"));
    const today = hours[weekday] ?? DEFAULT_HOURS[weekday];

    if (today && !today.closed) {
      const openM = toMinutes(today.open);
      const closeM = toMinutes(today.close);
      if (minutes >= openM && minutes < closeM) {
        return { open: true, label: `Open now · Closes ${formatTime12(today.close)}` };
      }
      if (minutes < openM) {
        return { open: false, label: `Closed · Opens ${formatTime12(today.open)}` };
      }
    }
    // find next opening day
    for (let i = 1; i <= 7; i++) {
      const nextDay = DAY_ORDER[(DAY_ORDER.indexOf(weekday as never) + i) % 7] as string;
      const next = hours[nextDay];
      if (next && !next.closed) {
        const name = i === 1 ? "tomorrow" : DAY_LABELS[nextDay];
        return { open: false, label: `Closed · Opens ${formatTime12(next.open)} ${name}` };
      }
    }
    return { open: false, label: "Closed" };
  } catch {
    return { open: true, label: "Open today" };
  }
}
