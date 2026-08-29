import { db } from "@/db";
import { reservations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getAdmin, unauthorized } from "@/lib/auth";

export const dynamic = "force-dynamic";

const STATUSES = new Set(["pending", "confirmed", "completed", "cancelled"]);

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
    const status = String(body.status ?? "");
    if (!STATUSES.has(status)) {
      return Response.json({ ok: false, error: "Unknown status." }, { status: 400 });
    }
    await db.update(reservations).set({ status }).where(eq(reservations.id, id));
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, error: "Couldn't update the reservation." }, { status: 500 });
  }
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const admin = await getAdmin();
  if (!admin) return unauthorized();
  const id = parseId((await ctx.params).id);
  if (id === null) return Response.json({ ok: false, error: "Invalid id." }, { status: 400 });
  try {
    await db.delete(reservations).where(eq(reservations.id, id));
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, error: "Couldn't delete the reservation." }, { status: 500 });
  }
}
