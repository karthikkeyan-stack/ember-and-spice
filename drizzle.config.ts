import "dotenv/config";
import { defineConfig } from "drizzle-kit";

/**
 * Drizzle Kit reads DATABASE_URL from the environment.
 * Locally this comes from .env; on Vercel it comes from the project's
 * Environment Variables. Never hardcode a connection string here.
 */
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is required (set it in .env locally or in Vercel Environment Variables)."
  );
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
});
