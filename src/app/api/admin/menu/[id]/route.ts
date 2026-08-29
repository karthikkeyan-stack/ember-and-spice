import { db } from "@/db";
import { menuItems } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getAdmin, unauthorized } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const admin = await getAdmin();
  if (!admin) return unauthorized();
  const { id } = await ctx.params;
  const itemId = Number(id);
  if (!Number.isFinite(itemId)) {
    return Response.json({ ok: false, error: "Invalid id." }, { status: 400 });
  }
  try {
    const body = (await req.json()) as Record<string, unknown>;
    const update: Record<string, unknown> = {};
    if (body.name !== undefined) update.name = String(body.name).trim().slice(0, 120);
    if (body.description !== undefined) update.description = String(body.description).trim().slice(0, 600);
    if (body.image !== undefined) update.image = String(body.image).trim().slice(0, 600);
    if (body.price !== undefined) {
      const p = Number(body.price);
      if (!Number.isFinite(p) || p < 0) return Response.json({ ok: false, error: "Invalid price." }, { status: 400 });
      update.price = Math.round(p);
    }
    if (body.categoryId !== undefined) update.categoryId = body.categoryId ? Number(body.categoryId) : null;
    if (body.vegetarian !== undefined) update.vegetarian = Boolean(body.vegetarian);
    if (body.signature !== undefined) update.signature = Boolean(body.signature);
    if (body.available !== undefined) update.available = Boolean(body.available);
    if (body.sortOrder !== undefined) update.sortOrder = Number(body.sortOrder) || 0;
    if (Object.keys(update).length === 0) {
      return Response.json({ ok: false, error: "Nothing to update." }, { status: 400 });
    }
    await db.update(menuItems).set(update).where(eq(menuItems.id, itemId));
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, error: "Couldn't save changes." }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const admin = await getAdmin();
  if (!admin) return unauthorized();
  const { id } = await ctx.params;
  const itemId = Number(id);
  if (!Number.isFinite(itemId)) {
    return Response.json({ ok: false, error: "Invalid id." }, { status: 400 });
  }
  try {
    await db.delete(menuItems).where(eq(menuItems.id, itemId));
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, error: "Couldn't delete the item." }, { status: 500 });
  }
}
