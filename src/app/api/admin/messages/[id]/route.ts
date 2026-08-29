import { db } from "@/db";
import { messages } from "@/db/schema";
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
    const body = await req.json();
    await db.update(messages).set({ read: Boolean(body.read) }).where(eq(messages.id, id));
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, error: "Couldn't update the message." }, { status: 500 });
  }
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const admin = await getAdmin();
  if (!admin) return unauthorized();
  const id = parseId((await ctx.params).id);
  if (id === null) return Response.json({ ok: false, error: "Invalid id." }, { status: 400 });
  try {
    await db.delete(messages).where(eq(messages.id, id));
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, error: "Couldn't delete the message." }, { status: 500 });
  }
}
