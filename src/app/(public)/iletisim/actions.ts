"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";

const contactSchema = z.object({
  name: z.string().min(2, "İsim en az 2 karakter olmalıdır."),
  email: z.string().email("Geçerli bir e-posta adresi girin."),
  message: z.string().min(10, "Mesaj en az 10 karakter olmalıdır."),
  honeypot: z.string().max(0).default(""),
});

export type ActionResult = {
  success: boolean;
  error?: string;
};

export async function submitContactForm(
  input: z.input<typeof contactSchema>,
): Promise<ActionResult> {
  // Honeypot check — bots filling the hidden field get silent "success"
  if (input.honeypot) {
    return { success: true };
  }

  // IP-based rate limiting
  const headerStore = await headers();
  const ip =
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const limit = rateLimit("contact-form", ip, {
    windowMs: 5 * 60 * 1000,
    maxRequests: 3,
  });
  if (!limit.success) {
    return {
      success: false,
      error: "Çok fazla istek gönderildi. Lütfen biraz bekleyin.",
    };
  }

  // Server-side validation
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Geçersiz form verisi.",
    };
  }

  const { name, email, message } = parsed.data;

  // Insert into Supabase
  const supabase = await createClient();
  const { data: inserted, error: dbError } = await supabase.from("contact_messages").insert({
    name,
    email,
    message,
  }).select("id").single();

  if (dbError || !inserted) {
    console.error("Contact form DB error:", dbError);
    return { success: false, error: "Mesaj gönderilemedi. Lütfen tekrar deneyin." };
  }

  // Send email notification — log failure to DB for visibility
  try {
    await sendEmailNotification(name, email, message);
  } catch (err) {
    console.error("Resend email error:", err);
    // Record the email failure in contact_messages so admin can see it
    await supabase
      .from("contact_messages")
      .update({ email_sent: false } as Record<string, boolean>)
      .eq("id", inserted.id)
      .then(() => { }, () => { });
  }

  return { success: true };
}

async function sendEmailNotification(
  name: string,
  email: string,
  message: string,
) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);

  await resend.emails.send({
    from: "Garanti Elektronik <noreply@garantielektronik.net>",
    to: "garantielektronik034@gmail.com",
    subject: `Yeni İletişim Formu: ${name.replace(/[\r\n]/g, " ")}`,
    text: `Ad: ${name}\nE-posta: ${email}\n\nMesaj:\n${message}`,
  });
}
