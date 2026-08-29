import { db } from "@/db";
import { galleryImages } from "@/db/schema";
import { asc } from "drizzle-orm";
import { getAdmin, unauthorized } from "@/lib/auth";

export const dynamic = "force-dynamic";

const GALLERY_CATS = new Set(["Food", "Interior", "People", "Details"]);

export async function GET() {
  const admin = await getAdmin();
  if (!admin) return unauthorized();
  const rows = await db.select().from(galleryImages).orderBy(asc(galleryImages.sortOrder));
  return Response.json({ ok: true, images: rows });
}

export async function POST(req: Request) {
  const admin = await getAdmin();
  if (!admin) return unauthorized();
  try {
    const body = await req.json();
    const imageUrl = String(body.imageUrl ?? "").trim().slice(0, 600);
    if (!imageUrl) {
      return Response.json({ ok: false, error: "An image is required." }, { status: 400 });
    }
    const category = GALLERY_CATS.has(body.category) ? String(body.category) : "Food";
    const [row] = await db
      .insert(galleryImages)
      .values({
        title: String(body.title ?? "").trim().slice(0, 120) || "Untitled",
        category,
        imageUrl,
        sortOrder: Number(body.sortOrder) || 0,
      })
      .returning({ id: galleryImages.id });
    return Response.json({ ok: true, id: row.id });
  } catch {
    return Response.json({ ok: false, error: "Couldn't add the image." }, { status: 500 });
  }
}
