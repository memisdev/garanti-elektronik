import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/integrations/supabase/types";

/**
 * Supabase client with service_role key — bypasses RLS.
 * Server-only: never import this in client components.
 */
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  return createSupabaseClient<Database>(url, key);
}

/**
 * Verify the current request is from an authenticated admin user.
 * Uses cookie-based auth from `@supabase/ssr` (same as middleware).
 */
export async function verifyAdminRole(
  allowedRoles: Database["public"]["Enums"]["app_role"][] = ["admin"],
): Promise<
  { user: { id: string; email?: string } } | { error: string; status: number }
> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Unauthorized", status: 401 };
  }

  const { data: roleData } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .in("role", allowedRoles)
    .maybeSingle();

  if (!roleData) {
    return { error: "Admin yetkisi gerekli", status: 403 };
  }

  return { user: { id: user.id, email: user.email } };
}
