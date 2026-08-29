import { db } from "@/db";
import { reservations } from "@/db/schema";
import { desc } from "drizzle-orm";
import { getAdmin, unauthorized } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await getAdmin();
  if (!admin) return unauthorized();
  const rows = await db
    .select()
    .from(reservations)
    .orderBy(desc(reservations.date), desc(reservations.time));
  return Response.json({ ok: true, reservations: rows });
}
