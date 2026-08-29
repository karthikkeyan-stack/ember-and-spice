import type { ReactNode } from "react";

/** Dark editorial page header for subpages (sits under transparent navbar). */
export default function PageHero({
  eyebrow,
  title,
  sub,
  image,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  sub?: string;
  image?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative bg-ink text-cream overflow-hidden">
      {image ? (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center opacity-35"
            style={{ backgroundImage: `url(${image})` }}
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/55 to-ink"
            aria-hidden="true"
          />
        </>
      ) : (
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            background:
              "radial-gradient(60% 80% at 80% 10%, rgba(188,82,39,0.22), transparent 60%)",
          }}
          aria-hidden="true"
        />
      )}
      <div className="container-x relative pt-40 pb-16 md:pt-48 md:pb-20">
        <p className="eyebrow eyebrow--cream mb-6">{eyebrow}</p>
        <h1 className="display-1 max-w-3xl">{title}</h1>
        {sub ? (
          <p className="mt-6 max-w-xl text-cream/65 text-base md:text-lg leading-relaxed">
            {sub}
          </p>
        ) : null}
        {children}
      </div>
    </section>
  );
}
