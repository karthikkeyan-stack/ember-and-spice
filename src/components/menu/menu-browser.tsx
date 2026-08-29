"use client";

import { useMemo, useState } from "react";
import { Search, Flame } from "lucide-react";
import { DishRow } from "@/components/site/dish";
import { cn } from "@/lib/utils";
import type { Category, MenuItem } from "@/lib/data";

type Diet = "all" | "veg" | "nonveg";

export default function MenuBrowser({
  categories,
  items,
}: {
  categories: Category[];
  items: MenuItem[];
}) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [diet, setDiet] = useState<Diet>("all");

  const enabledCats = categories.filter((c) => c.enabled);
  const available = items.filter((i) => i.available);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return available.filter((item) => {
      if (cat !== "all" && item.categoryId !== Number(cat)) return false;
      if (diet === "veg" && !item.vegetarian) return false;
      if (diet === "nonveg" && item.vegetarian) return false;
      if (q && !`${item.name} ${item.description}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [available, query, cat, diet]);

  const groups = useMemo(() => {
    if (cat !== "all") {
      const c = enabledCats.find((c) => c.id === Number(cat));
      return c ? [{ cat: c, items: filtered }] : [];
    }
    return enabledCats
      .map((c) => ({ cat: c, items: filtered.filter((i) => i.categoryId === c.id) }))
      .filter((g) => g.items.length > 0);
  }, [cat, filtered, enabledCats]);

  const count = filtered.length;

  return (
    <div className="container-x">
      {/* sticky toolbar */}
      <div className="sticky top-[4.75rem] z-30 -mx-4 px-4 py-4 bg-cream/90 backdrop-blur-md border-b border-line/60 mb-4">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-mute" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the menu — dosa, biryani, coffee…"
              aria-label="Search the menu"
              className="field !pl-11 !rounded-full"
            />
          </div>
          <div
            className="flex rounded-full border border-line p-1 gap-1 self-start md:self-auto"
            role="group"
            aria-label="Dietary filter"
          >
            {(
              [
                ["all", "All"],
                ["veg", "Veg"],
                ["nonveg", "Non-veg"],
              ] as [Diet, string][]
            ).map(([val, label]) => (
              <button
                key={val}
                type="button"
                onClick={() => setDiet(val)}
                aria-pressed={diet === val}
                className={cn(
                  "px-4 py-2 rounded-full text-[0.7rem] font-extrabold tracking-[0.14em] uppercase transition-all",
                  diet === val
                    ? val === "veg"
                      ? "bg-leaf text-cream"
                      : val === "nonveg"
                        ? "bg-[#8e3b2c] text-cream"
                        : "bg-ink text-cream"
                    : "text-mute hover:text-ink"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div
          className="flex gap-2 mt-3 overflow-x-auto pb-1 -mx-1 px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="tablist"
          aria-label="Menu categories"
        >
          <button
            type="button"
            className="chip"
            data-active={cat === "all"}
            onClick={() => setCat("all")}
          >
            All
          </button>
          {enabledCats.map((c) => (
            <button
              key={c.id}
              type="button"
              className="chip"
              data-active={cat === String(c.id)}
              onClick={() => setCat(String(c.id))}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs font-bold tracking-[0.18em] uppercase text-mute mt-6 mb-2" aria-live="polite">
        {count} {count === 1 ? "dish" : "dishes"}
      </p>

      {groups.length === 0 ? (
        <div className="py-20 text-center">
          <Flame className="w-8 h-8 text-ember/40 mx-auto mb-4" />
          <p className="font-display text-2xl mb-2">Nothing matches that search</p>
          <p className="text-sm text-mute">
            Try a different dish name, or clear the filters above.
          </p>
          <button
            type="button"
            className="btn btn-outline mt-6"
            onClick={() => {
              setQuery("");
              setCat("all");
              setDiet("all");
            }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        groups.map(({ cat: c, items: catItems }) => (
          <section key={c.id} className="mt-10" aria-labelledby={`cat-${c.id}`}>
            <div className="flex items-baseline gap-4 mb-2">
              <h2 id={`cat-${c.id}`} className="font-display text-2xl md:text-[1.7rem]">
                {c.name}
              </h2>
              <span className="leader" aria-hidden="true" />
              <span className="text-xs font-bold tracking-[0.18em] uppercase text-mute">
                {catItems.length}
              </span>
            </div>
            <div>
              {catItems.map((item) => (
                <DishRow key={item.id} item={item} />
              ))}
            </div>
          </section>
        ))
      )}

      <div className="mt-14 rounded-2xl border border-line bg-paper p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <p className="font-display text-lg">Vegetarian, vegan or avoiding something?</p>
          <p className="text-sm text-mute mt-1">
            Tell the team when you arrive — most dishes adapt happily. Green mark = vegetarian.
          </p>
        </div>
        <a href="/reserve" className="btn btn-dark flex-none">
          Reserve a table
        </a>
      </div>
    </div>
  );
}
