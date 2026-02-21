import { supabase } from "@/integrations/supabase/client";

export function useAuditLog() {
  const log = async (action: string, detail?: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    await supabase.from("audit_log").insert({
      action,
      detail: detail || "",
      user_id: session.user.id,
    });
  };

  return { log };
}
