import { db } from "@/db";
import { galleryImages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getAdmin, unauthorized } from "@/lib/auth";

export const dynamic = "force-dynamic";

const GALLERY_CATS = new Set(["Food", "Interior", "People", "Details"]);

function parseId(raw: string) {
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const admin = await getAdmin();
  if (!admin) return unauthorized();
  const id = parseId((await ctx.params).id);
  if (id === null) return Response.json({ ok: false, error: "Invalid id." }, { status: 400 });
  try {
    const body = (await req.json()) as Record<string, unknown>;
    const update: Record<string, unknown> = {};
    if (body.title !== undefined) update.title = String(body.title).trim().slice(0, 120) || "Untitled";
    if (body.category !== undefined && GALLERY_CATS.has(body.category as string)) {
      update.category = String(body.category);
    }
    if (body.imageUrl !== undefined) update.imageUrl = String(body.imageUrl).trim().slice(0, 600);
    if (body.sortOrder !== undefined) update.sortOrder = Number(body.sortOrder) || 0;
    if (Object.keys(update).length === 0) {
      return Response.json({ ok: false, error: "Nothing to update." }, { status: 400 });
    }
    await db.update(galleryImages).set(update).where(eq(galleryImages.id, id));
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, error: "Couldn't save changes." }, { status: 500 });
  }
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const admin = await getAdmin();
  if (!admin) return unauthorized();
  const id = parseId((await ctx.params).id);
  if (id === null) return Response.json({ ok: false, error: "Invalid id." }, { status: 400 });
  try {
    await db.delete(galleryImages).where(eq(galleryImages.id, id));
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, error: "Couldn't delete the image." }, { status: 500 });
  }
}
