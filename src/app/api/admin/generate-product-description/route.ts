import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyAdminRole } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { getChatConfig } from "@/lib/ai/client";
import { sanitizeAIOutput } from "@/lib/ai/sanitize";
import { rateLimit } from "@/lib/rate-limit";
import {
  PRODUCT_DESCRIPTION_SYSTEM_PROMPT,
  buildDescriptionUserPrompt,
} from "@/lib/prompts/product-description";

const requestSchema = z.object({
  name: z.string().min(1).max(200),
  code: z.string().max(100).optional(),
  brand: z.string().max(100).optional(),
  category: z.string().max(100).optional(),
  compatibility: z.string().max(500).optional(),
  specs: z.string().max(1000).optional(),
  existingDescription: z.string().max(2000).optional(),
});

const TIMEOUT_MS = 20_000;
const CONTEXT_DESCRIPTIONS_COUNT = 20;
const CONTEXT_DESCRIPTION_MAX_CHARS = 150;

export async function POST(req: NextRequest) {
  const authResult = await verifyAdminRole(["admin", "editor"]);
  if ("error" in authResult) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status },
    );
  }

  const rl = rateLimit("gen-product-desc", authResult.user.id, {
    windowMs: 60_000,
    maxRequests: 20,
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
        { error: "Ürün adı zorunludur." },
        { status: 400 },
      );
    }

    // Fetch recent descriptions for uniqueness context
    const supabase = await createClient();
    const { data: recentProducts } = await supabase
      .from("products")
      .select("description")
      .not("description", "is", null)
      .order("updated_at", { ascending: false })
      .limit(CONTEXT_DESCRIPTIONS_COUNT);

    const existingSnippets = (recentProducts ?? [])
      .map((p) => p.description?.slice(0, CONTEXT_DESCRIPTION_MAX_CHARS))
      .filter(Boolean);

    // Build system prompt with uniqueness context
    let systemPrompt = PRODUCT_DESCRIPTION_SYSTEM_PROMPT;
    if (existingSnippets.length > 0) {
      systemPrompt += `\n\nMEVCUT AÇIKLAMA ÖRNEKLERİ (bunları taklit etme):\n${existingSnippets.map((s, i) => `${i + 1}. "${s}..."`).join("\n")}`;
    }

    const userPrompt = buildDescriptionUserPrompt(parsed.data);
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
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.8,
          max_tokens: 800,
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
      console.error("AI product description error:", aiResponse.status, errText);

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

    const description = sanitizeAIOutput(raw);

    if (!description) {
      return NextResponse.json(
        { error: "AI bir ürün açıklaması oluşturamadı" },
        { status: 500 },
      );
    }

    return NextResponse.json({ description });
  } catch (e) {
    console.error("generate-product-description error:", e);
    return NextResponse.json(
      { error: "Ürün açıklaması oluşturulurken bir hata oluştu" },
      { status: 500 },
    );
  }
}
