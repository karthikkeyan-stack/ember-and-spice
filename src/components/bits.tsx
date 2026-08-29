"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

/** Scroll-triggered reveal wrapper (IntersectionObserver). */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn("reveal", className)}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

export function VegMark({ veg, className }: { veg: boolean; className?: string }) {
  return (
    <span
      className={cn("vegmark", !veg && "vegmark--nonveg", className)}
      role="img"
      aria-label={veg ? "Vegetarian" : "Non-vegetarian"}
      title={veg ? "Vegetarian" : "Non-vegetarian"}
    />
  );
}

export function Stars({ rating, className }: { rating: number; className?: string }) {
  return (
    <span
      className={cn("inline-flex items-center gap-0.5", className)}
      role="img"
      aria-label={`Rated ${rating} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            "w-3.5 h-3.5",
            i <= rating ? "text-ember fill-ember" : "text-line fill-line"
          )}
        />
      ))}
    </span>
  );
}

export function SigBadge() {
  return (
    <span className="badge-sig">
      <FlameDot /> Signature
    </span>
  );
}

function FlameDot() {
  return (
    <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 fill-current" aria-hidden="true">
      <path d="M12 2c1.1 2.2 3.8 3.7 3.8 6.7 0 2.5-1.7 4.3-3.8 4.3s-3.8-1.8-3.8-4.3c0-1.1.4-2 1-2.9.2 1 .7 1.7 1.4 2.1-.3-2.2.1-4.3 1.4-5.9Z" />
    </svg>
  );
}
