import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyAdminRole } from "@/lib/supabase/admin";
import { getChatConfig } from "@/lib/ai/client";
import { sanitizeAIOutput } from "@/lib/ai/sanitize";
import { rateLimit } from "@/lib/rate-limit";
import {
  PRODUCT_NAME_SYSTEM_PROMPT,
  buildNameUserPrompt,
} from "@/lib/prompts/product-name";

const requestSchema = z
  .object({
    code: z.string().max(100).optional(),
    brand: z.string().max(100).optional(),
    category: z.string().max(100).optional(),
    compatibility: z.string().max(500).optional(),
    currentName: z.string().max(200).optional(),
  })
  .refine(
    (data) => data.code || data.brand || data.category || data.compatibility,
    { message: "En az bir alan doldurulmalıdır" },
  );

const TIMEOUT_MS = 15_000;

export async function POST(req: NextRequest) {
  const authResult = await verifyAdminRole(["admin", "editor"]);
  if ("error" in authResult) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status },
    );
  }

  const rl = rateLimit("gen-product-name", authResult.user.id, {
    windowMs: 60_000,
    maxRequests: 30,
  });
  if (!rl.success) {
    return NextResponse.json(
      { error: "İstek limiti aşıldı. Lütfen daha sonra tekrar deneyin." },
      { status: 429 },
    );
  }

  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Geçersiz istek formatı" },
        { status: 400 },
      );
    }

    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "En az bir alan (kod, marka, kategori veya uyumluluk) doldurulmalıdır." },
        { status: 400 },
      );
    }

    const userPrompt = buildNameUserPrompt(parsed.data);
    const config = getChatConfig();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    let aiResponse: Response;
    try {
      aiResponse = await fetch(config.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({
          model: config.model,
          messages: [
            { role: "system", content: PRODUCT_NAME_SYSTEM_PROMPT },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.3,
          max_tokens: 100,
        }),
        signal: controller.signal,
      });
    } catch (err) {
      clearTimeout(timeout);
      if (err instanceof DOMException && err.name === "AbortError") {
        return NextResponse.json(
          { error: "AI isteği zaman aşımına uğradı" },
          { status: 504 },
        );
      }
      throw err;
    } finally {
      clearTimeout(timeout);
    }

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("AI product name error:", aiResponse.status, errText);

      if (aiResponse.status === 429) {
        return NextResponse.json(
          { error: "AI istek limiti aşıldı. Lütfen daha sonra tekrar deneyin." },
          { status: 429 },
        );
      }

      return NextResponse.json(
        { error: `AI istek hatası (${aiResponse.status})` },
        { status: 500 },
      );
    }

    const data = await aiResponse.json();
    const raw = data?.choices?.[0]?.message?.content ?? "";

    // Sanitize + post-processing
    let name = sanitizeAIOutput(raw)
      .replace(/^["']+|["']+$/g, "") // strip surrounding quotes
      .replace(/,\s*$/, "") // trailing comma
      .replace(/ {2,}/g, " ") // double spaces
      .trim();

    if (!name) {
      return NextResponse.json(
        { error: "AI bir ürün adı oluşturamadı" },
        { status: 500 },
      );
    }

    // Enforce max length
    if (name.length > 120) {
      name = name.slice(0, 120).replace(/\s+\S*$/, "").trim();
    }

    return NextResponse.json({ name });
  } catch (e) {
    console.error("generate-product-name error:", e);
    return NextResponse.json(
      { error: "Ürün adı oluşturulurken bir hata oluştu" },
      { status: 500 },
    );
  }
}
