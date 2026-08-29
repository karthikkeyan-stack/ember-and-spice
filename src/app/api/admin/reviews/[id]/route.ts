import { db } from "@/db";
import { reviews } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getAdmin, unauthorized } from "@/lib/auth";

export const dynamic = "force-dynamic";

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
    if (body.customerName !== undefined) update.customerName = String(body.customerName).trim().slice(0, 80);
    if (body.review !== undefined) update.review = String(body.review).trim().slice(0, 600);
    if (body.rating !== undefined) update.rating = Math.min(5, Math.max(1, Number(body.rating) || 5));
    if (body.date !== undefined) update.date = String(body.date).trim().slice(0, 40);
    if (body.approved !== undefined) update.approved = Boolean(body.approved);
    if (body.sample !== undefined) update.sample = Boolean(body.sample);
    if (Object.keys(update).length === 0) {
      return Response.json({ ok: false, error: "Nothing to update." }, { status: 400 });
    }
    await db.update(reviews).set(update).where(eq(reviews.id, id));
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
    await db.delete(reviews).where(eq(reviews.id, id));
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, error: "Couldn't delete the review." }, { status: 500 });
  }
}
