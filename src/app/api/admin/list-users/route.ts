import { NextResponse } from "next/server";
import { createServiceClient, verifyAdminRole } from "@/lib/supabase/admin";

export async function GET() {
  const auth = await verifyAdminRole();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const serviceClient = createServiceClient();

  // Get all user_roles
  const { data: roles } = await serviceClient
    .from("user_roles")
    .select("user_id, role");

  if (!roles || roles.length === 0) {
    return NextResponse.json([]);
  }

  // Get auth users for email mapping
  const { data: authData, error: authError } =
    await serviceClient.auth.admin.listUsers({ perPage: 1000 });

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 500 });
  }

  const emailMap = new Map<string, string>();
  for (const u of authData.users) {
    emailMap.set(u.id, u.email || "");
  }

  const result = roles.map((r) => ({
    user_id: r.user_id,
    role: r.role,
    email: emailMap.get(r.user_id) || "",
  }));

  return NextResponse.json(result);
}
