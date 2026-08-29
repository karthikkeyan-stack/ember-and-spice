import { db } from "@/db";
import { messages } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const subject = String(body.subject ?? "").trim();
    const message = String(body.message ?? "").trim();

    if (name.length < 2) return Response.json({ ok: false, error: "Please share your name." }, { status: 400 });
    if (!/.+@.+\..+/.test(email)) return Response.json({ ok: false, error: "A valid email is required." }, { status: 400 });
    if (message.length < 5) return Response.json({ ok: false, error: "Write us a short message." }, { status: 400 });

    await db.insert(messages).values({
      name: name.slice(0, 80),
      email: email.slice(0, 120),
      phone: phone.slice(0, 24),
      subject: subject.slice(0, 120) || "General enquiry",
      message: message.slice(0, 2000),
    });

    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, error: "Couldn't send the message. Try again." }, { status: 500 });
  }
}
