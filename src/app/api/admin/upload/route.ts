import { randomBytes } from "crypto";
import { getAdmin, unauthorized } from "@/lib/auth";
import { db } from "@/db";
import { uploads } from "@/db/schema";

export const dynamic = "force-dynamic";

const MIME_EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/avif": ".avif",
};

const MAX = 6 * 1024 * 1024; // 6 MB

/**
 * Images are stored in the database (base64) rather than the local filesystem.
 * Serverless hosts (Vercel) have a read-only/ephemeral filesystem, so writing
 * to public/uploads would not persist. Files are served back via /api/uploads/[id].
 */
export async function POST(req: Request) {
  const admin = await getAdmin();
  if (!admin) return unauthorized();
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return Response.json({ ok: false, error: "No file received." }, { status: 400 });
    }
    const ext = MIME_EXT[file.type];
    if (!ext) {
      return Response.json(
        { ok: false, error: "Only image files (jpg, png, webp, gif, avif)." },
        { status: 400 }
      );
    }
    if (file.size > MAX) {
      return Response.json({ ok: false, error: "Image must be under 6 MB." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString("base64");
    const url = `/api/uploads/${Date.now()}-${randomBytes(4).toString("hex")}${ext}`;

    const [row] = await db
      .insert(uploads)
      .values({ url, mime: file.type, size: file.size, data: base64 })
      .returning({ url: uploads.url });

    return Response.json({ ok: true, url: row.url });
  } catch {
    return Response.json({ ok: false, error: "Upload failed." }, { status: 500 });
  }
}
