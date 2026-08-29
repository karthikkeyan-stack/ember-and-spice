"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export default function ContactForm() {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Something went wrong");
      setDone(true);
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="text-center py-10">
        <CheckCircle2 className="w-12 h-12 text-leaf mx-auto mb-4" />
        <h3 className="font-display text-2xl mb-2">Message received</h3>
        <p className="text-sm text-mute max-w-sm mx-auto mb-6">
          Thanks for writing in. This demo stores messages in the restaurant's admin
          panel — a real backend, not a mailto link.
        </p>
        <button type="button" className="btn btn-outline" onClick={() => setDone(false)}>
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate={false}>
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="cf-name" className="field-label">Name</label>
          <input id="cf-name" name="name" required className="field" placeholder="Your name" />
        </div>
        <div>
          <label htmlFor="cf-phone" className="field-label">Phone</label>
          <input id="cf-phone" name="phone" type="tel" className="field" placeholder="+91" />
        </div>
      </div>
      <div>
        <label htmlFor="cf-email" className="field-label">Email</label>
        <input id="cf-email" name="email" type="email" required className="field" placeholder="you@example.com" />
      </div>
      <div>
        <label htmlFor="cf-subject" className="field-label">Subject</label>
        <select id="cf-subject" name="subject" className="field" defaultValue="General enquiry">
          <option>General enquiry</option>
          <option>Large group booking</option>
          <option>Catering</option>
          <option>Feedback</option>
          <option>Something else</option>
        </select>
      </div>
      <div>
        <label htmlFor="cf-message" className="field-label">Message</label>
        <textarea
          id="cf-message"
          name="message"
          required
          rows={5}
          className="field resize-none"
          placeholder="Tell us what you need…"
        />
      </div>
      {error ? (
        <p className="flex items-center gap-2 text-sm text-[#8e3b2c]">
          <AlertCircle className="w-4 h-4" /> {error}
        </p>
      ) : null}
      <button type="submit" disabled={busy} className="btn btn-primary w-full !py-4 disabled:opacity-60">
        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
        {busy ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
