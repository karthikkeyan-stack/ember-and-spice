"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/site/logo";
import type { OpenStatus } from "@/lib/settings";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/about", label: "About" },
  { href: "/gallery", label: "Gallery" },
  { href: "/reviews", label: "Reviews" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar({ status }: { status: OpenStatus }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const dark = scrolled || open;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-cream/95 backdrop-blur-md border-b border-line shadow-[0_10px_40px_-20px_rgba(24,19,16,0.25)]"
            : "bg-transparent border-b border-transparent"
        )}
      >
        <div className="container-wide flex items-center justify-between h-[4.75rem]">
          <Link href="/" aria-label="Ember & Spice — home" className="relative z-50">
            <Logo tone={dark ? "ink" : "cream"} />
          </Link>

          <nav className="hidden lg:flex items-center gap-8" aria-label="Primary">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "relative text-[0.72rem] font-bold tracking-[0.18em] uppercase transition-colors py-2",
                  dark ? "text-ink/70 hover:text-ink" : "text-cream/75 hover:text-cream",
                  pathname === l.href && (dark ? "text-ink" : "text-cream")
                )}
              >
                {l.label}
                <span
                  className={cn(
                    "absolute left-0 -bottom-0.5 h-px bg-ember transition-all duration-300",
                    pathname === l.href ? "w-full" : "w-0"
                  )}
                />
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <span
              className={cn(
                "hidden xl:inline-flex items-center gap-2 text-[0.68rem] font-bold tracking-[0.14em] uppercase",
                dark ? "text-mute" : "text-cream/70"
              )}
            >
              <span
                className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  status.open ? "bg-leaf" : "bg-ember"
                )}
              />
              {status.open ? "Open now" : "Closed"}
            </span>
            <Link href="/reserve" className="btn btn-primary !py-3 !px-6">
              Reserve a table
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className={cn(
              "lg:hidden relative z-50 inline-flex items-center justify-center w-11 h-11 rounded-full border transition-colors",
              dark ? "border-line text-ink" : "border-line-light text-cream"
            )}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-ink text-cream transition-all duration-500 lg:hidden",
          open ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        )}
      >
        <div className="h-full flex flex-col justify-between px-6 pt-28 pb-10 overflow-y-auto">
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {LINKS.map((l, i) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "font-display text-4xl py-3 border-b border-line-light/60 transition-all duration-500",
                  open ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4",
                  pathname === l.href ? "text-ember" : "text-cream hover:text-ember"
                )}
                style={{ transitionDelay: `${80 + i * 55}ms` }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="space-y-5">
            <p className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-cream/60 font-bold">
              <Flame className="w-3.5 h-3.5 text-ember" /> {status.label}
            </p>
            <Link href="/reserve" className="btn btn-primary w-full !py-4">
              Reserve a table
            </Link>
            <p className="text-xs text-cream/40 tracking-[0.14em] uppercase">
              Coimbatore · Tamil Nadu
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
