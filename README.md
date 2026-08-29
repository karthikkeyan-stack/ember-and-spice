# EMBER & SPICE — Premium South Indian Restaurant Website + Admin CMS

A complete, production-style restaurant website for a **concept restaurant** in
Coimbatore, Tamil Nadu — built as a SITECRAFT portfolio project.

Unlike a static HTML demo, this version ships with a **real backend**: the admin
panel is a working CMS backed by PostgreSQL, with session-based login, image
uploads, and CRUD for the menu, categories, gallery, reservations, reviews,
messages and site settings. Every change in the admin panel reflects instantly
on the public website.

---

## 1. Project Overview

| Surface    | What you get |
| ---------- | ------------ |
| Public site | Home, Menu (search + veg/category filters), About, Gallery (lightbox + filters), Reviews (clearly-labelled samples), Contact (working form → admin inbox), Reservations (working form → admin panel) |
| Admin CMS   | `/admin` — login, dashboard (stats, pending reservations, inbox), menu/items CRUD, category CRUD + reorder, gallery manager with uploads, reservation status workflow, review moderation, settings (identity, contact, socials, Google Maps, opening hours) |
| Data        | PostgreSQL via Drizzle ORM. Seed script provides 44 realistic menu items, 18 gallery photos, 6 demo reservations, 5 labelled sample reviews |

**Stack:** Next.js (App Router) · React 19 · TypeScript · Tailwind CSS v4 ·
Drizzle ORM · PostgreSQL · Lucide icons.

---

## 2. Folder Structure

```
├── src/
│   ├── app/
│   │   ├── (site)/            # public pages (navbar/footer layout)
│   │   │   ├── page.tsx       # home
│   │   │   ├── menu/ about/ gallery/ reviews/ contact/ reserve/
│   │   ├── admin/
│   │   │   ├── (auth)/login/  # sign-in screen
│   │   │   └── (panel)/       # guarded CMS — dashboard, menu,
│   │   │                      # categories, gallery, reservations,
│   │   │                      # reviews, settings
│   │   └── api/               # route handlers (public + admin, session-guarded)
│   ├── components/            # site & admin components
│   ├── db/                    # Drizzle schema + client
│   └── lib/                   # auth, settings, data, utils
├── public/
│   ├── images/                # generated brand photography (replaceable)
│   └── uploads/               # runtime uploads from the admin panel
├── scripts/seed.ts            # demo content + admin user
└── drizzle.config.json
```

---

## 3. Running Locally

```bash
npm install
# point .env at a PostgreSQL database
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/app_db

npx drizzle-kit push        # create tables
npx tsx scripts/seed.ts     # demo content + admin user
npm run dev                 # http://localhost:3000
```

Optional seed overrides in `.env`:

```
ADMIN_EMAIL=admin@emberandspice.in
ADMIN_PASSWORD=ember-admin-2026
```

---

## 4. Demo admin credentials

> **Demo only.** Stored as salted scrypt hashes in Postgres; sessions are
> httpOnly cookies. For a real deployment change these credentials (re-seed
> with `ADMIN_EMAIL` / `ADMIN_PASSWORD` set) and rotate anything public.

- **Email:** `admin@emberandspice.in`
- **Password:** `ember-admin-2026`
- Sign in at `/admin/login` (linked as “Team sign-in” in the footer).

---

## 5. Editing everything

Everything content-related is editable from `/admin` — no code changes needed:

| Task                        | Where |
| --------------------------- | ----- |
| Menu dishes, prices, images | Admin → Menu items |
| Menu categories & order     | Admin → Categories |
| Gallery photos              | Admin → Gallery (uploads land in `public/uploads`) |
| Table requests              | Admin → Reservations (pending → confirmed → completed / cancelled) |
| Reviews                     | Admin → Reviews (approve/hide; demo entries stay labelled) |
| Name, tagline, contact      | Admin → Settings |
| Opening hours               | Admin → Settings → Opening hours (drives the live “Open now” badge) |
| Instagram/Facebook/WhatsApp | Admin → Settings → Social & maps |

### Google Maps
1. On google.com/maps find the restaurant location → **Share → Embed a map** → copy the `src="…"` URL.
2. Admin → Settings → **Google Maps embed URL** → paste → save. The homepage
   map placeholder becomes a live map.
3. The **Google Maps link URL** powers the “Open in Google Maps” buttons.

### Replacing the seed photography
All seed images live in `public/images/` (`hero.jpg`, `interior.jpg`,
`kitchen.jpg`, `food/*.jpg`). Replace the files (same names), or point each
dish at a new URL from Admin → Menu items. Menu/gallery images also accept any
external `https://` URL.

### Logo & colours
- Logo: inline SVG in `src/components/site/logo.tsx` (+ favicon in `src/app/icon.svg`).
- Colours: CSS custom properties in `src/app/globals.css` under `@theme`
  (`--color-ink`, `--color-cream`, `--color-ember`, …). Change once, applies
  everywhere.

---

## 6. How the demo content is marked

- Reviews are stored with `sample: true` and rendered with a visible
  “Sample testimonial” badge — never presented as real customers.
- The footer carries “© 2026 … Demo portfolio project”.
- Prices are demo figures, easy to change in Admin → Menu items.

---

## 7. Connecting a real backend later

It already is one. If you move off the sandbox:

- Swap `DATABASE_URL` to any hosted Postgres (Neon, Supabase, RDS…).
- Move image uploads from `public/uploads` to object storage (S3/R2) by
  replacing the handler in `src/app/api/admin/upload/route.ts`.
- Add more admin users with a small script using `hashPassword` from
  `src/lib/password.ts`.

---

## 8. Deployment

```bash
npm run build
npm run start
```

Deploy anywhere that runs Next.js Node output (Vercel, a VPS, Docker).
Run `npx drizzle-kit push` + `npx tsx scripts/seed.ts` against the production
database once. Set `ADMIN_EMAIL`/`ADMIN_PASSWORD` **before** the first seed in
production — and change the demo password afterwards regardless.

## 9. Notes & honest limitations

- This is a **portfolio concept**. Contact details (phone, email, address,
  socials) are demo placeholders, editable in admin settings.
- No real email/SMS is sent for reservations/messages — submissions are stored
  in the database and surface in the admin dashboard. Wiring up an email
  provider (Resend, SES) is a small addition to `src/app/api/reservations`.
- Admin auth uses server-side sessions in Postgres (not JWT) — revoke by
  deleting a row from the `sessions` table.
