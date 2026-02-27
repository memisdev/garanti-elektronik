import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServiceClient, verifyAdminRole } from "@/lib/supabase/admin";

const removeRoleSchema = z.object({
  roleId: z.string().uuid(),
});

export async function POST(request: NextRequest) {
  const auth = await verifyAdminRole(["admin"]);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Geçersiz istek formatı" },
      { status: 400 },
    );
  }

  const parsed = removeRoleSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Geçerli roleId zorunludur" },
      { status: 400 },
    );
  }

  const { roleId } = parsed.data;
  const serviceClient = createServiceClient();

  const { data: existing, error: fetchError } = await serviceClient
    .from("user_roles")
    .select("id, user_id, role")
    .eq("id", roleId)
    .maybeSingle();

  if (fetchError || !existing) {
    return NextResponse.json(
      { error: "Kullanıcı rol kaydı bulunamadı" },
      { status: 404 },
    );
  }

  const { error: deleteError } = await serviceClient
    .from("user_roles")
    .delete()
    .eq("id", roleId);

  if (deleteError) {
    return NextResponse.json(
      { error: "Rol kaydı silinemedi" },
      { status: 500 },
    );
  }

  await serviceClient.from("audit_log").insert({
    action: "Kullanıcı rolü kaldırıldı",
    detail: `${existing.user_id} (${existing.role})`,
    user_id: auth.user.id,
  });

  return NextResponse.json({ success: true });
}
