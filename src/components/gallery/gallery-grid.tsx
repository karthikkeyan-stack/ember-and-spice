"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { X, ChevronLeft, ChevronRight, Images } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GalleryImage } from "@/lib/data";

const FILTERS = ["All", "Food", "Interior", "People", "Details"];

export default function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [filter, setFilter] = useState("All");
  const [active, setActive] = useState<number | null>(null);

  const visible = useMemo(
    () => images.filter((g) => filter === "All" || g.category === filter),
    [images, filter]
  );

  const close = useCallback(() => setActive(null), []);
  const step = useCallback(
    (dir: 1 | -1) => {
      setActive((cur) =>
        cur === null ? cur : (cur + dir + visible.length) % visible.length
      );
    },
    [visible.length]
  );

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active, close, step]);

  const current = active !== null ? visible[active] : null;

  return (
    <div className="container-x">
      {/* filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            className="chip"
            data-active={filter === f}
            onClick={() => {
              setFilter(f);
              setActive(null);
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="py-24 text-center text-mute">
          <Images className="w-8 h-8 mx-auto mb-4 text-ember/40" />
          <p className="font-display text-xl">No photographs here yet</p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 [&>*]:mb-5">
          {visible.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActive(i)}
              className="group relative block w-full break-inside-avoid rounded-2xl overflow-hidden focus-visible:outline-ember"
              aria-label={`Open photo: ${img.title}`}
            >
              <img
                src={img.imageUrl}
                alt={img.title}
                loading="lazy"
                className="w-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="absolute bottom-0 left-0 right-0 p-5 text-left translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                <span className="block text-cream font-display text-lg leading-tight">
                  {img.title}
                </span>
                <span className="block text-[0.62rem] font-extrabold tracking-[0.22em] uppercase text-cream/60 mt-1">
                  {img.category}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}

      {/* lightbox */}
      {current ? (
        <div
          className="fixed inset-0 z-[80] bg-ink/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-10"
          role="dialog"
          aria-modal="true"
          aria-label={current.title}
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute top-5 right-5 w-11 h-11 rounded-full border border-line-light text-cream flex items-center justify-center hover:bg-cream/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <button
            type="button"
            aria-label="Previous photo"
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
            className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full border border-line-light text-cream flex items-center justify-center hover:bg-cream/10 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            aria-label="Next photo"
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full border border-line-light text-cream flex items-center justify-center hover:bg-cream/10 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <figure
            className={cn("max-w-4xl w-full")}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={current.imageUrl}
              alt={current.title}
              className="w-full max-h-[78vh] object-contain rounded-xl"
            />
            <figcaption className="mt-4 flex items-baseline justify-between text-cream">
              <span className="font-display text-lg">{current.title}</span>
              <span className="text-[0.62rem] font-extrabold tracking-[0.22em] uppercase text-cream/50">
                {current.category} · {active !== null ? active + 1 : 0}/{visible.length}
              </span>
            </figcaption>
          </figure>
        </div>
      ) : null}
    </div>
  );
}
