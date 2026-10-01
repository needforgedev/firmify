// Browser Supabase client. Uses the publishable (anon) key — every query runs
// under the signed-in user's JWT, so RLS is always enforced. No service-role
// key exists in this app by design.

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
