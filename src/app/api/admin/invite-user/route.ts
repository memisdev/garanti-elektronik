import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServiceClient, verifyAdminRole } from "@/lib/supabase/admin";

const inviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(["admin", "editor"]),
  password: z.string().min(8).optional(),
});

export async function POST(request: NextRequest) {
  const auth = await verifyAdminRole();
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

  const parsed = inviteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "E-posta ve rol zorunludur" },
      { status: 400 },
    );
  }

  const { email, role, password } = parsed.data;
  const serviceClient = createServiceClient();

  // Create user with service role
  const { data: newUser, error: createError } =
    await serviceClient.auth.admin.createUser({
      email,
      password: password || undefined,
      email_confirm: true,
    });

  if (createError) {
    console.error("invite-user createUser error:", createError.message);
    return NextResponse.json(
      { error: "Kullanıcı oluşturulurken bir hata oluştu" },
      { status: 400 },
    );
  }

  // Assign role
  const { error: roleError } = await serviceClient
    .from("user_roles")
    .insert({ user_id: newUser.user.id, role });

  if (roleError) {
    console.error("invite-user role assignment error:", roleError.message);
    return NextResponse.json(
      { error: "Rol atanırken bir hata oluştu" },
      { status: 400 },
    );
  }

  // Audit log
  await serviceClient.from("audit_log").insert({
    action: "Kullanıcı davet edildi",
    detail: `${email} (${role})`,
    user_id: auth.user.id,
  });

  return NextResponse.json({ success: true, user_id: newUser.user.id });
}
