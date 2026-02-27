import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServiceClient, verifyAdminRole } from "@/lib/supabase/admin";

const updateRoleSchema = z.object({
  roleId: z.string().uuid(),
  role: z.enum(["admin", "editor"]),
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

  const parsed = updateRoleSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Geçerli roleId ve role zorunludur" },
      { status: 400 },
    );
  }

  const { roleId, role } = parsed.data;
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

  const { error: updateError } = await serviceClient
    .from("user_roles")
    .update({ role })
    .eq("id", roleId);

  if (updateError) {
    return NextResponse.json(
      { error: "Rol güncellenemedi" },
      { status: 500 },
    );
  }

  await serviceClient.from("audit_log").insert({
    action: "Kullanıcı rolü güncellendi",
    detail: `${existing.user_id}: ${existing.role} -> ${role}`,
    user_id: auth.user.id,
  });

  return NextResponse.json({ success: true });
}
