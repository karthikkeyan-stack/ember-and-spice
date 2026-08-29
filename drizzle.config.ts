import "dotenv/config";
import { defineConfig } from "drizzle-kit";

/**
 * Drizzle Kit (migrations) should use a DIRECT (unpooled) connection.
 * On Neon, set DIRECT_DATABASE_URL to the unpooled URI and DATABASE_URL to the
 * pooled (…-pooler) URI. Falls back to DATABASE_URL if no direct URL is set.
 * Never hardcode a connection string here.
 */
const databaseUrl =
  process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL (or DIRECT_DATABASE_URL) is required — set it in your environment."
  );
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
});
