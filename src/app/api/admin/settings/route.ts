import { getAdmin, unauthorized } from "@/lib/auth";
import { getSettings, setSetting } from "@/lib/settings";

export const dynamic = "force-dynamic";

const ALLOWED = new Set([
  "restaurantName",
  "tagline",
  "phone",
  "email",
  "address",
  "instagramUrl",
  "facebookUrl",
  "whatsappNumber",
  "mapsUrl",
  "mapsEmbedUrl",
  "hours",
]);

export async function GET() {
  const admin = await getAdmin();
  if (!admin) return unauthorized();
  const data = await getSettings();
  return Response.json({ ok: true, settings: data });
}

export async function PATCH(req: Request) {
  const admin = await getAdmin();
  if (!admin) return unauthorized();
  try {
    const body = (await req.json()) as Record<string, unknown>;
    for (const [key, value] of Object.entries(body)) {
      if (!ALLOWED.has(key)) continue;
      if (key === "hours") {
        setSettingSafe(key, JSON.stringify(value));
      } else if (typeof value === "string") {
        setSettingSafe(key, value);
      }
    }
    const data = await getSettings();
    return Response.json({ ok: true, settings: data });
  } catch {
    return Response.json({ ok: false, error: "Couldn't save settings." }, { status: 500 });
  }
}

async function setSettingSafe(key: string, value: string) {
  await setSetting(key, value.slice(0, 4000));
}
