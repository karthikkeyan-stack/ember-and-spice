"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UtensilsCrossed,
  ListTree,
  Images,
  CalendarDays,
  MessageSquareQuote,
  Settings,
  LogOut,
  ExternalLink,
  Menu as MenuIcon,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/site/logo";
import { ToastProvider, useSignOut } from "@/components/admin/ui";

const NAV = [
  { href: "/admin", label: "Overview", Icon: LayoutDashboard, exact: true },
  { href: "/admin/menu", label: "Menu items", Icon: UtensilsCrossed },
  { href: "/admin/categories", label: "Categories", Icon: ListTree },
  { href: "/admin/gallery", label: "Gallery", Icon: Images },
  { href: "/admin/reservations", label: "Reservations", Icon: CalendarDays },
  { href: "/admin/reviews", label: "Reviews", Icon: MessageSquareQuote },
  { href: "/admin/settings", label: "Settings", Icon: Settings },
];

export default function AdminShell({
  children,
  adminName,
}: {
  children: ReactNode;
  adminName: string;
}) {
  const pathname = usePathname();
  const signOut = useSignOut();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  const sidebar = (
    <div className="h-full flex flex-col bg-ink text-cream">
      <div className="px-6 h-[4.75rem] flex items-center justify-between border-b border-line-light">
        <Link href="/admin" aria-label="Admin dashboard">
          <Logo tone="cream" />
        </Link>
        <button
          type="button"
          className="lg:hidden text-cream/70"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <p className="px-6 pt-4 text-[0.6rem] font-extrabold tracking-[0.26em] uppercase text-cream/35">
        Restaurant CMS
      </p>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" aria-label="Admin">
        {NAV.map(({ href, label, Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all",
                active
                  ? "bg-ember text-cream shadow-lg shadow-ember/25"
                  : "text-cream/60 hover:text-cream hover:bg-cream/5"
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-line-light space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-cream/60 hover:text-cream hover:bg-cream/5 transition-all"
        >
          <ExternalLink className="w-4 h-4" /> View website
        </Link>
        <div className="flex items-center gap-3 px-3.5 py-2.5">
          <span className="w-8 h-8 rounded-full bg-ember/20 border border-ember/40 flex items-center justify-center text-xs font-extrabold text-ember-tint">
            {adminName.slice(0, 1).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold truncate">{adminName}</p>
            <p className="text-[0.62rem] tracking-[0.16em] uppercase text-cream/40 font-bold">
              Manager
            </p>
          </div>
          <button
            type="button"
            onClick={signOut}
            aria-label="Sign out"
            className="w-9 h-9 rounded-full border border-line-light flex items-center justify-center text-cream/60 hover:text-cream hover:border-cream/50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <ToastProvider>
      <div className="min-h-screen bg-cream text-ink">
        {/* desktop sidebar */}
        <aside className="hidden lg:block fixed inset-y-0 left-0 w-64 z-40">{sidebar}</aside>

        {/* mobile drawer */}
        <div
          className={cn(
            "lg:hidden fixed inset-0 z-50 transition-all",
            open ? "visible" : "invisible pointer-events-none"
          )}
        >
          <div
            className={cn(
              "absolute inset-0 bg-ink/60 transition-opacity",
              open ? "opacity-100" : "opacity-0"
            )}
            onClick={() => setOpen(false)}
          />
          <aside
            className={cn(
              "absolute inset-y-0 left-0 w-72 transition-transform duration-300",
              open ? "translate-x-0" : "-translate-x-full"
            )}
          >
            {sidebar}
          </aside>
        </div>

        {/* top bar (mobile) */}
        <header className="lg:hidden sticky top-0 z-30 bg-ink text-cream h-16 flex items-center justify-between px-4 border-b border-line-light">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open admin menu"
            className="w-10 h-10 rounded-full border border-line-light flex items-center justify-center"
          >
            <MenuIcon className="w-5 h-5" />
          </button>
          <Logo tone="cream" className="scale-90" />
          <span className="w-10" />
        </header>

        <main className="lg:ml-64 min-h-screen">
          <div className="max-w-6xl mx-auto px-5 md:px-8 py-8 md:py-10">{children}</div>
        </main>
      </div>
    </ToastProvider>
  );
}
