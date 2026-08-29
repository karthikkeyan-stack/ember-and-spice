import {
  pgTable,
  serial,
  integer,
  text,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

/* ------------------------------------------------------------------ */
/*  ADMIN USERS + SESSIONS                                            */
/* ------------------------------------------------------------------ */

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull().default("Admin"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const sessions = pgTable("sessions", {
  token: text("token").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/* ------------------------------------------------------------------ */
/*  MENU                                                              */
/* ------------------------------------------------------------------ */

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  sortOrder: integer("sort_order").notNull().default(0),
  enabled: boolean("enabled").notNull().default(true),
});

export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  categoryId: integer("category_id").references(() => categories.id, {
    onDelete: "set null",
  }),
  description: text("description").notNull().default(""),
  /** Price in whole INR rupees */
  price: integer("price").notNull().default(0),
  image: text("image").notNull().default(""),
  vegetarian: boolean("vegetarian").notNull().default(true),
  signature: boolean("signature").notNull().default(false),
  available: boolean("available").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/* ------------------------------------------------------------------ */
/*  GALLERY                                                           */
/* ------------------------------------------------------------------ */

export const galleryImages = pgTable("gallery_images", {
  id: serial("id").primaryKey(),
  title: text("title").notNull().default(""),
  /** Food | Interior | People | Details */
  category: text("category").notNull().default("Food"),
  imageUrl: text("image_url").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/* ------------------------------------------------------------------ */
/*  RESERVATIONS                                                      */
/* ------------------------------------------------------------------ */

export const reservations = pgTable("reservations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull().default(""),
  date: text("date").notNull(), // YYYY-MM-DD
  time: text("time").notNull(), // HH:MM (24h)
  guests: integer("guests").notNull().default(2),
  specialRequest: text("special_request").notNull().default(""),
  /** pending | confirmed | completed | cancelled */
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/* ------------------------------------------------------------------ */
/*  REVIEWS                                                           */
/* ------------------------------------------------------------------ */

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  review: text("review").notNull(),
  rating: integer("rating").notNull().default(5),
  date: text("date").notNull().default(""),
  approved: boolean("approved").notNull().default(true),
  /** sample = demo testimonial, never presented as a real customer */
  sample: boolean("sample").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/* ------------------------------------------------------------------ */
/*  SETTINGS + CONTACT MESSAGES                                       */
/* ------------------------------------------------------------------ */

export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull().default(""),
});

/* ------------------------------------------------------------------ */
/*  UPLOADED IMAGES (stored in DB — works on read-only serverless FS) */
/* ------------------------------------------------------------------ */

export const uploads = pgTable("uploads", {
  id: serial("id").primaryKey(),
  /** Public path returned to the browser, e.g. /api/uploads/12 */
  url: text("url").notNull().unique(),
  mime: text("mime").notNull().default("image/jpeg"),
  size: integer("size").notNull().default(0),
  data: text("data").notNull(), // base64-encoded image bytes
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().default(""),
  phone: text("phone").notNull().default(""),
  subject: text("subject").notNull().default(""),
  message: text("message").notNull(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
