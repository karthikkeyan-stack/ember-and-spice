import { cn } from "@/lib/utils";

export function EmberMark({
  className,
  mark = "#bc5227",
  dot = "#c29b62",
}: {
  className?: string;
  mark?: string;
  dot?: string;
}) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        d="M24 8c2.2 4.4 7.6 7.4 7.6 13.4 0 4.9-3.4 8.6-7.6 8.6s-7.6-3.7-7.6-8.6c0-2.2.8-4.1 2.1-5.8.3 1.9 1.3 3.3 2.7 4.2-.6-4.4.2-8.7 2.8-11.8Z"
        fill={mark}
      />
      <circle cx="24" cy="37" r="2.6" fill={dot} />
    </svg>
  );
}

export function Logo({
  tone = "ink",
  className,
}: {
  tone?: "ink" | "cream";
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <EmberMark className="w-8 h-8" />
      <span
        className={cn(
          "font-display leading-none tracking-tight text-[1.35rem]",
          tone === "cream" ? "text-cream" : "text-ink"
        )}
      >
        Ember <span className="text-ember it">&amp;</span> Spice
      </span>
    </span>
  );
}
