import { NextRequest, NextResponse } from "next/server";
import { createServiceClient, verifyAdminRole } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  const auth = await verifyAdminRole();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { email, role, password } = await request.json();

  if (!email || !role) {
    return NextResponse.json(
      { error: "E-posta ve rol zorunludur" },
      { status: 400 },
    );
  }

  const serviceClient = createServiceClient();

  // Create user with service role
  const { data: newUser, error: createError } =
    await serviceClient.auth.admin.createUser({
      email,
      password: password || undefined,
      email_confirm: true,
    });

  if (createError) {
    return NextResponse.json({ error: createError.message }, { status: 400 });
  }

  // Assign role
  const { error: roleError } = await serviceClient
    .from("user_roles")
    .insert({ user_id: newUser.user.id, role });

  if (roleError) {
    return NextResponse.json({ error: roleError.message }, { status: 400 });
  }

  // Audit log
  await serviceClient.from("audit_log").insert({
    action: "Kullanıcı davet edildi",
    detail: `${email} (${role})`,
    user_id: auth.user.id,
  });

  return NextResponse.json({ success: true, user_id: newUser.user.id });
}
