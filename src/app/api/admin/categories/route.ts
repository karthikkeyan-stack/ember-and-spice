import { db } from "@/db";
import { categories } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { getAdmin, unauthorized } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await getAdmin();
  if (!admin) return unauthorized();
  const rows = await db.select().from(categories).orderBy(asc(categories.sortOrder));
  return Response.json({ ok: true, categories: rows });
}

export async function POST(req: Request) {
  const admin = await getAdmin();
  if (!admin) return unauthorized();
  try {
    const body = await req.json();
    const name = String(body.name ?? "").trim().slice(0, 60);
    if (name.length < 2) {
      return Response.json({ ok: false, error: "Category name is required." }, { status: 400 });
    }
    let slug = slugify(name);
    if (!slug) slug = `category-${Date.now().toString(36)}`;
    const existing = await db.select({ id: categories.id, slug: categories.slug }).from(categories);
    if (existing.some((r) => r.slug === slug)) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }
    const [row] = await db
      .insert(categories)
      .values({
        name,
        slug,
        sortOrder: Number(body.sortOrder) || existing.length + 1,
        enabled: true,
      })
      .returning({ id: categories.id });
    return Response.json({ ok: true, id: row.id });
  } catch {
    return Response.json({ ok: false, error: "Couldn't create the category." }, { status: 500 });
  }
}
