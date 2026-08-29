import { db } from "@/db";
import { reservations } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body.name ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const email = String(body.email ?? "").trim();
    const date = String(body.date ?? "").trim();
    const time = String(body.time ?? "").trim();
    const guests = Number(body.guests);
    const specialRequest = String(body.specialRequest ?? "").trim().slice(0, 500);

    if (name.length < 2) return Response.json({ ok: false, error: "Please share your name." }, { status: 400 });
    if (phone.length < 7) return Response.json({ ok: false, error: "A phone number is required." }, { status: 400 });
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return Response.json({ ok: false, error: "Pick a date." }, { status: 400 });
    if (!/^\d{2}:\d{2}$/.test(time)) return Response.json({ ok: false, error: "Pick a time." }, { status: 400 });
    if (!Number.isFinite(guests) || guests < 1 || guests > 30) {
      return Response.json({ ok: false, error: "Guests must be between 1 and 30." }, { status: 400 });
    }
    if (email && !/.+@.+\..+/.test(email)) {
      return Response.json({ ok: false, error: "That email doesn't look right." }, { status: 400 });
    }

    const [row] = await db
      .insert(reservations)
      .values({ name: name.slice(0, 80), phone: phone.slice(0, 24), email: email.slice(0, 120), date, time, guests, specialRequest, status: "pending" })
      .returning({ id: reservations.id });

    return Response.json({ ok: true, id: row.id });
  } catch {
    return Response.json({ ok: false, error: "Couldn't save the request. Try again." }, { status: 500 });
  }
}
