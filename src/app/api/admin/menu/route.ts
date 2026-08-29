import { db } from "@/db";
import { categories, menuItems } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { getAdmin, unauthorized } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await getAdmin();
  if (!admin) return unauthorized();
  const rows = await db
    .select({
      item: menuItems,
      categoryName: categories.name,
    })
    .from(menuItems)
    .leftJoin(categories, eq(menuItems.categoryId, categories.id))
    .orderBy(asc(menuItems.sortOrder));
  return Response.json({
    ok: true,
    items: rows.map((r) => ({ ...r.item, categoryName: r.categoryName ?? "—" })),
  });
}

function parseItem(body: Record<string, unknown>) {
  const name = String(body.name ?? "").trim();
  const price = Number(body.price);
  const categoryId = body.categoryId ? Number(body.categoryId) : null;
  return {
    valid: name.length >= 2 && Number.isFinite(price) && price >= 0 && price < 1_000_000,
    name: name.slice(0, 120),
    price: Math.round(price),
    categoryId,
    description: String(body.description ?? "").trim().slice(0, 600),
    image: String(body.image ?? "").trim().slice(0, 600),
    vegetarian: Boolean(body.vegetarian),
    signature: Boolean(body.signature),
    available: body.available === undefined ? true : Boolean(body.available),
    sortOrder: Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 0,
  };
}

export async function POST(req: Request) {
  const admin = await getAdmin();
  if (!admin) return unauthorized();
  try {
    const body = await req.json();
    const item = parseItem(body);
    if (!item.valid) {
      return Response.json({ ok: false, error: "A name and a valid price are required." }, { status: 400 });
    }
    const { valid: _v, name, ...rest } = item;
    const [row] = await db
      .insert(menuItems)
      .values({ name, ...rest, slug: `${slugify(name)}-${Date.now().toString(36)}` })
      .returning({ id: menuItems.id });
    return Response.json({ ok: true, id: row.id });
  } catch {
    return Response.json({ ok: false, error: "Couldn't create the item." }, { status: 500 });
  }
}

export { parseItem as parseMenuItem };
