// Drizzle client for Supabase Postgres.
//
// DATABASE_URL should be the Supavisor pooler string from the Supabase
// dashboard (Settings → Database → Connection string):
//   - transaction mode (port 6543) for the app — requires prepare: false
//   - session mode (port 5432) works too and is what migrations use
//
// This module is server-only. Never import it from a client component — the
// connection string carries full database credentials.

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as { pgClient?: ReturnType<typeof postgres> };

function makeClient() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set — add the Supabase connection string to .env.local");
  }
  // Supabase's transaction-mode pooler doesn't support prepared statements.
  return postgres(url, { prepare: false });
}

// Reuse the connection across Next.js dev hot-reloads.
const client = globalForDb.pgClient ?? makeClient();
if (process.env.NODE_ENV !== "production") globalForDb.pgClient = client;

export const db = drizzle(client, { schema });
export * as tables from "./schema";
