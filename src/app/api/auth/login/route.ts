import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";
import { buildRateLimitKey, getClientIpFromHeaders } from "@/lib/client-ip";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Geçersiz istek formatı" },
      { status: 400 },
    );
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "E-posta ve şifre zorunludur" },
      { status: 400 },
    );
  }

  const { email, password } = parsed.data;

  // Rate limit: 5 attempts per 15 minutes per IP+UA+email
  const limit = rateLimit("auth-login", buildRateLimitKey(request.headers, email.toLowerCase()), {
    windowMs: 15 * 60 * 1000,
    maxRequests: 5,
  });

  if (!limit.success) {
    return NextResponse.json(
      { error: "Çok fazla giriş denemesi. Lütfen daha sonra tekrar deneyin." },
      { status: 429 },
    );
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    const ip = getClientIpFromHeaders(request.headers);
    console.warn(`Failed login attempt from ${ip}`);
    return NextResponse.json(
      {
        error:
          error.message === "Invalid login credentials"
            ? "E-posta veya şifre hatalı."
            : "Giriş başarısız. Lütfen tekrar deneyin.",
      },
      { status: 401 },
    );
  }

  if (!data.user) {
    return NextResponse.json(
      { error: "Giriş başarısız. Lütfen tekrar deneyin." },
      { status: 401 },
    );
  }

  // Check admin/editor role
  const { data: roleData } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", data.user.id)
    .in("role", ["admin", "editor"])
    .maybeSingle();

  if (!roleData) {
    await supabase.auth.signOut();
    return NextResponse.json(
      { error: "Bu panele erişim yetkiniz bulunmamaktadır." },
      { status: 403 },
    );
  }

  return NextResponse.json({ success: true });
}
