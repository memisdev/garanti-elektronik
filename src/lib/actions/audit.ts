"use server";

import { createClient } from "@/lib/supabase/server";

export async function logAuditAction(
  action: string,
  detail?: string,
): Promise<void> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error("Audit log: no session");
      return;
    }

    await supabase.from("audit_log").insert({
      action,
      detail: detail || "",
      user_id: user.id,
    });
  } catch (err) {
    console.error("Audit log error:", err);
  }
}
