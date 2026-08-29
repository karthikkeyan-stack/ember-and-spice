import { db } from "@/db";
import { categories, galleryImages, menuItems, reviews } from "@/db/schema";
import { asc, eq } from "drizzle-orm";

export type Category = typeof categories.$inferSelect;
export type MenuItem = typeof menuItems.$inferSelect;
export type GalleryImage = typeof galleryImages.$inferSelect;
export type Review = typeof reviews.$inferSelect;

export async function getMenuData(): Promise<{
  categories: Category[];
  items: MenuItem[];
}> {
  try {
    const [cats, items] = await Promise.all([
      db.select().from(categories).orderBy(asc(categories.sortOrder)),
      db.select().from(menuItems).orderBy(asc(menuItems.sortOrder)),
    ]);
    return { categories: cats, items };
  } catch {
    return { categories: [], items: [] };
  }
}

export async function getSignatureItems(limit = 6): Promise<MenuItem[]> {
  try {
    const rows = await db
      .select()
      .from(menuItems)
      .where(eq(menuItems.signature, true))
      .orderBy(asc(menuItems.sortOrder));
    return rows.filter((r) => r.available).slice(0, limit);
  } catch {
    return [];
  }
}

export async function getApprovedReviews(limit?: number): Promise<Review[]> {
  try {
    const rows = await db
      .select()
      .from(reviews)
      .where(eq(reviews.approved, true))
      .orderBy(asc(reviews.createdAt));
    return limit ? rows.slice(0, limit) : rows;
  } catch {
    return [];
  }
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  try {
    return await db.select().from(galleryImages).orderBy(asc(galleryImages.sortOrder));
  } catch {
    return [];
  }
}
