"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, ArrowRight, KeyRound } from "lucide-react";
import { Logo } from "@/components/site/logo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Login failed.");
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-ink text-cream flex items-center justify-center p-5 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(55% 45% at 70% 20%, rgba(188,82,39,0.28), transparent 65%), radial-gradient(40% 40% at 15% 85%, rgba(194,155,98,0.14), transparent 60%)",
        }}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Logo tone="cream" className="justify-center" />
          <p className="mt-3 text-[0.66rem] font-extrabold tracking-[0.3em] uppercase text-cream/45">
            Restaurant CMS — sign in
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="bg-ink-2/90 backdrop-blur border border-line-light rounded-3xl p-7 md:p-9 shadow-2xl"
        >
          <div className="mb-5">
            <label htmlFor="lg-email" className="block text-[0.66rem] font-extrabold tracking-[0.2em] uppercase text-cream/50 mb-2">
              Email
            </label>
            <input
              id="lg-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="admin@emberandspice.in"
              className="w-full bg-ink border border-line-light rounded-xl px-4 py-3.5 text-sm text-cream placeholder:text-cream/30 focus:outline-none focus:border-ember focus:ring-2 focus:ring-ember/25 transition-all"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="lg-password" className="block text-[0.66rem] font-extrabold tracking-[0.2em] uppercase text-cream/50 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="lg-password"
                name="password"
                type={show ? "text" : "password"}
                required
                autoComplete="current-password"
                placeholder="••••••••••••"
                className="w-full bg-ink border border-line-light rounded-xl px-4 py-3.5 pr-12 text-sm text-cream placeholder:text-cream/30 focus:outline-none focus:border-ember focus:ring-2 focus:ring-ember/25 transition-all"
              />
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                aria-label={show ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/40 hover:text-cream transition-colors"
              >
                {show ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            </div>
          </div>

          {error ? (
            <p className="mb-5 text-sm text-ember-tint bg-ember/15 border border-ember/30 rounded-xl px-4 py-3">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={busy}
            className="btn btn-primary w-full !py-4 disabled:opacity-60"
          >
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
            {busy ? "Signing in…" : "Sign in"}
          </button>

          <div className="mt-6 flex items-start gap-2.5 text-xs text-cream/40 bg-cream/5 border border-line-light rounded-xl px-4 py-3">
            <KeyRound className="w-3.5 h-3.5 mt-0.5 flex-none text-gold" />
            <span>
              Demo credentials: <span className="text-cream/70 font-semibold">admin@emberandspice.in</span>{" "}
              / <span className="text-cream/70 font-semibold">ember-admin-2026</span>.
              Change via seed env vars before any real deployment.
            </span>
          </div>
        </form>

        <p className="text-center mt-6 text-[0.62rem] tracking-[0.2em] uppercase text-cream/30 font-bold">
          Ember &amp; Spice · Coimbatore · Demo admin
        </p>
      </div>
    </main>
  );
}
