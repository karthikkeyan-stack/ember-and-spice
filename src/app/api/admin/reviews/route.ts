import { db } from "@/db";
import { reviews } from "@/db/schema";
import { desc } from "drizzle-orm";
import { getAdmin, unauthorized } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await getAdmin();
  if (!admin) return unauthorized();
  const rows = await db.select().from(reviews).orderBy(desc(reviews.createdAt));
  return Response.json({ ok: true, reviews: rows });
}

export async function POST(req: Request) {
  const admin = await getAdmin();
  if (!admin) return unauthorized();
  try {
    const body = await req.json();
    const customerName = String(body.customerName ?? "").trim().slice(0, 80);
    const review = String(body.review ?? "").trim().slice(0, 600);
    const rating = Math.min(5, Math.max(1, Number(body.rating) || 5));
    if (customerName.length < 2 || review.length < 5) {
      return Response.json({ ok: false, error: "Name and review text are required." }, { status: 400 });
    }
    const [row] = await db
      .insert(reviews)
      .values({
        customerName,
        review,
        rating,
        date: String(body.date ?? "").trim().slice(0, 40),
        approved: body.approved === undefined ? true : Boolean(body.approved),
        sample: body.sample === undefined ? true : Boolean(body.sample),
      })
      .returning({ id: reviews.id });
    return Response.json({ ok: true, id: row.id });
  } catch {
    return Response.json({ ok: false, error: "Couldn't create the review." }, { status: 500 });
  }
}
