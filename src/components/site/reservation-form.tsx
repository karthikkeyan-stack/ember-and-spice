"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export default function ReservationForm() {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<number | null>(null);
  const [error, setError] = useState("");

  const today = new Date().toISOString().slice(0, 10);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Something went wrong");
      setDone(json.id);
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  if (done !== null) {
    return (
      <div className="text-center py-10">
        <CheckCircle2 className="w-12 h-12 text-leaf mx-auto mb-4" />
        <h3 className="font-display text-2xl mb-2">Request received</h3>
        <p className="text-sm text-mute max-w-sm mx-auto mb-2">
          Reference <span className="font-extrabold text-ink">E&amp;S-{String(done).padStart(4, "0")}</span>
        </p>
        <p className="text-sm text-mute max-w-sm mx-auto mb-6">
          Your table request is now sitting in the restaurant's admin panel as
          “pending”. In a live deployment the manager would confirm by phone or SMS.
        </p>
        <button type="button" className="btn btn-outline" onClick={() => setDone(null)}>
          Make another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="rs-name" className="field-label">Name</label>
          <input id="rs-name" name="name" required className="field" placeholder="Your name" />
        </div>
        <div>
          <label htmlFor="rs-phone" className="field-label">Phone</label>
          <input id="rs-phone" name="phone" type="tel" required className="field" placeholder="+91" />
        </div>
      </div>
      <div>
        <label htmlFor="rs-email" className="field-label">Email (optional)</label>
        <input id="rs-email" name="email" type="email" className="field" placeholder="you@example.com" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
        <div>
          <label htmlFor="rs-date" className="field-label">Date</label>
          <input id="rs-date" name="date" type="date" min={today} required className="field" />
        </div>
        <div>
          <label htmlFor="rs-time" className="field-label">Time</label>
          <input id="rs-time" name="time" type="time" min="07:00" max="22:30" required className="field" defaultValue="19:30" />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label htmlFor="rs-guests" className="field-label">Guests</label>
          <select id="rs-guests" name="guests" className="field" defaultValue="2">
            {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="rs-note" className="field-label">Special request</label>
        <textarea
          id="rs-note"
          name="specialRequest"
          rows={3}
          className="field resize-none"
          placeholder="Window seat, high chair, quiet corner, dietary notes…"
        />
      </div>
      {error ? (
        <p className="flex items-center gap-2 text-sm text-[#8e3b2c]">
          <AlertCircle className="w-4 h-4" /> {error}
        </p>
      ) : null}
      <button type="submit" disabled={busy} className="btn btn-primary w-full !py-4 disabled:opacity-60">
        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
        {busy ? "Sending…" : "Request a table"}
      </button>
    </form>
  );
}
