import { db } from "@/db";
import { messages } from "@/db/schema";
import { desc } from "drizzle-orm";
import { getAdmin, unauthorized } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await getAdmin();
  if (!admin) return unauthorized();
  const rows = await db.select().from(messages).orderBy(desc(messages.createdAt));
  return Response.json({ ok: true, messages: rows });
}
