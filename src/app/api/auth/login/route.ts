import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createSession, verifyPassword, SESSION_COOKIE } from "@/lib/auth";

export const dynamic = "force-dynamic";

const DAY = 24 * 60 * 60;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");

    if (!email || !password) {
      return Response.json({ ok: false, error: "Email and password are required." }, { status: 400 });
    }

    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return Response.json({ ok: false, error: "Incorrect email or password." }, { status: 401 });
    }

    const { token, expiresAt } = await createSession(user.id);
    const res = Response.json({ ok: true, name: user.name });
    res.headers.append(
      "Set-Cookie",
      `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * DAY}${
        process.env.NODE_ENV === "production" ? "; Secure" : ""
      }`
    );
    void expiresAt;
    return res;
  } catch {
    return Response.json({ ok: false, error: "Login failed. Try again." }, { status: 500 });
  }
}
