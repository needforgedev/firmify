import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    // Set in .env / .env.local once the Supabase project exists.
    // `drizzle-kit generate` works without it; `migrate`/`push`/`studio` need it.
    url: process.env.DATABASE_URL ?? "postgresql://placeholder:placeholder@localhost:5432/postgres",
  },
  // Never let drizzle-kit touch Supabase-managed schemas (auth, storage, …).
  schemaFilter: ["public"],
  verbose: true,
  strict: true,
});
