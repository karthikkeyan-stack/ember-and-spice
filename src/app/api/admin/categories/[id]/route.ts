import { db } from "@/db";
import { categories } from "@/db/schema";
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
    if (body.name !== undefined) {
      const name = String(body.name).trim().slice(0, 60);
      if (name.length < 2) return Response.json({ ok: false, error: "Name too short." }, { status: 400 });
      update.name = name;
    }
    if (body.enabled !== undefined) update.enabled = Boolean(body.enabled);
    if (body.sortOrder !== undefined) update.sortOrder = Number(body.sortOrder) || 0;
    if (Object.keys(update).length === 0) {
      return Response.json({ ok: false, error: "Nothing to update." }, { status: 400 });
    }
    await db.update(categories).set(update).where(eq(categories.id, id));
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
    await db.delete(categories).where(eq(categories.id, id));
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, error: "Couldn't delete the category." }, { status: 500 });
  }
}
