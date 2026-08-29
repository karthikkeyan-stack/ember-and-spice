import { db } from "@/db";
import { uploads } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

/** Serves an image that was uploaded by an admin (stored in the database). */
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params;
    const url = `/api/uploads/${id}`;
    const [row] = await db
      .select()
      .from(uploads)
      .where(eq(uploads.url, url))
      .limit(1);

    if (!row) {
      return new Response("Not found", { status: 404 });
    }

    const bytes = Buffer.from(row.data, "base64");
    return new Response(new Uint8Array(bytes), {
      status: 200,
      headers: {
        "Content-Type": row.mime,
        "Content-Length": String(bytes.length),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Error", { status: 500 });
  }
}
