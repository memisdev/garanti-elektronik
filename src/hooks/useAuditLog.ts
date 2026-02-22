import { logAuditAction } from "@/lib/actions/audit";

export function useAuditLog() {
  const log = async (action: string, detail?: string) => {
    await logAuditAction(action, detail);
  };

  return { log };
}
