/**
 * Placeholder for Next.js server-side Supabase client.
 * During migration, this will use createServerClient from @supabase/ssr.
 *
 * Example (Next.js App Router):
 * ```
 * import { createServerClient } from "@supabase/ssr";
 * import { cookies } from "next/headers";
 *
 * export function createClient() {
 *   const cookieStore = cookies();
 *   return createServerClient(
 *     process.env.NEXT_PUBLIC_SUPABASE_URL!,
 *     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
 *     { cookies: { ... } }
 *   );
 * }
 * ```
 */

// For now, re-export the browser client (Vite SPA has no server context)
export { supabase } from "@/integrations/supabase/client";
