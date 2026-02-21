/**
 * Re-export the Supabase browser client.
 * The underlying client now uses createBrowserClient from @supabase/ssr
 * with cookie-based auth (Phase 2 migration).
 */
export { supabase } from "@/integrations/supabase/client";
