import { Flame } from "lucide-react";
import { SigBadge, VegMark } from "@/components/bits";
import { formatINR, cn } from "@/lib/utils";
import type { MenuItem } from "@/lib/data";

/** Image card — used on the homepage signature grid. */
export function DishCard({ item, className }: { item: MenuItem; className?: string }) {
  return (
    <article className={cn("group", className)}>
      <div className="img-frame aspect-[4/5] rounded-2xl">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            className="group-hover:scale-[1.06]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-ink-2">
            <Flame className="w-8 h-8 text-ember/50" />
          </div>
        )}
        <span className="absolute top-3 right-3 rounded-full bg-ink/85 backdrop-blur px-3 py-1.5 text-[0.78rem] font-extrabold tracking-wide text-cream">
          {formatINR(item.price)}
        </span>
      </div>
      <div className="pt-4">
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <VegMark veg={item.vegetarian} />
          <h3 className="font-display text-lg leading-tight">{item.name}</h3>
        </div>
        {item.signature ? (
          <div className="mb-2">
            <SigBadge />
          </div>
        ) : null}
        <p className="text-sm text-mute leading-relaxed line-clamp-2">{item.description}</p>
      </div>
    </article>
  );
}

/** Row with dotted leader — used on the menu page list. */
export function DishRow({ item }: { item: MenuItem }) {
  return (
    <article className="group flex gap-4 sm:gap-5 py-5 border-b border-line/70">
      {item.image ? (
        <div className="img-frame w-20 h-20 sm:w-24 sm:h-24 rounded-xl flex-none">
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            className="group-hover:scale-110"
          />
        </div>
      ) : null}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline">
          <h3 className="flex items-center gap-2 font-display text-[1.05rem] sm:text-lg leading-snug">
            <VegMark veg={item.vegetarian} />
            <span>{item.name}</span>
          </h3>
          <span className="leader hidden sm:block" aria-hidden="true" />
          <span className="ml-auto sm:ml-0 flex-none font-extrabold text-[0.95rem] tracking-wide pl-3 sm:pl-0">
            {formatINR(item.price)}
          </span>
        </div>
        <div className="mt-1 flex items-center gap-2.5 flex-wrap">
          {item.signature ? <SigBadge /> : null}
        </div>
        <p className="mt-1.5 text-sm text-mute leading-relaxed max-w-2xl">
          {item.description}
        </p>
      </div>
    </article>
  );
}
