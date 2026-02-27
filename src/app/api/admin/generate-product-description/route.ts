import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyAdminRole } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { chatCompletion, AIError } from "@/lib/ai/client";
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

const CONTEXT_DESCRIPTIONS_COUNT = 20;
const CONTEXT_DESCRIPTION_MAX_CHARS = 150;

export async function POST(req: NextRequest) {
  // --- Auth ---
  const authResult = await verifyAdminRole(["admin", "editor"]);
  if ("error" in authResult) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status },
    );
  }

  // --- Rate limit ---
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

  // --- Parse body ---
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek formatı" }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Ürün adı zorunludur." }, { status: 400 });
  }

  try {
    // --- Fetch recent descriptions for uniqueness ---
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

    let systemPrompt = PRODUCT_DESCRIPTION_SYSTEM_PROMPT;
    if (existingSnippets.length > 0) {
      systemPrompt += `\n\nMEVCUT AÇIKLAMA ÖRNEKLERİ (bunları taklit etme):\n${existingSnippets.map((s, i) => `${i + 1}. "${s}..."`).join("\n")}`;
    }

    // --- Call AI ---
    const result = await chatCompletion({
      systemPrompt,
      userPrompt: buildDescriptionUserPrompt(parsed.data),
      temperature: 0.75,
      maxCompletionTokens: 4096,
      timeoutMs: 30_000,
    });

    console.log(
      "[generate-product-description] finish:", result.finishReason,
      "tokens:", result.usage.completionTokens,
      "length:", result.content.length,
    );

    // --- Truncation guard ---
    if (result.finishReason === "length") {
      return NextResponse.json(
        { error: "AI yanıtı kesildi (token limiti). Lütfen tekrar deneyin." },
        { status: 500 },
      );
    }

    // --- Post-processing ---
    const description = sanitizeAIOutput(result.content);

    // --- Minimum quality ---
    if (!description || description.length < 100) {
      return NextResponse.json(
        { error: "AI çok kısa bir açıklama üretti. Lütfen tekrar deneyin." },
        { status: 500 },
      );
    }

    // --- Quality: verify key inputs appear in output ---
    const qualityWarnings: string[] = [];

    // Check part codes
    const inputCodes = extractCodes(parsed.data.code);
    for (const code of inputCodes) {
      if (!description.toUpperCase().includes(code.toUpperCase())) {
        qualityWarnings.push(`Parça kodu eksik: ${code}`);
      }
    }

    // Check brand
    if (
      parsed.data.brand &&
      !description.toUpperCase().includes(parsed.data.brand.toUpperCase())
    ) {
      qualityWarnings.push(`Marka eksik: ${parsed.data.brand}`);
    }

    if (qualityWarnings.length > 0) {
      console.warn(
        "[generate-product-description] Quality warnings:",
        qualityWarnings,
      );
    }

    return NextResponse.json({ description, qualityWarnings });
  } catch (e) {
    if (e instanceof AIError) {
      return NextResponse.json({ error: e.message }, { status: e.statusCode });
    }
    console.error("generate-product-description error:", e);
    return NextResponse.json(
      { error: "Ürün açıklaması oluşturulurken bir hata oluştu" },
      { status: 500 },
    );
  }
}

/**
 * Extract distinct part codes from a comma/space-separated code string.
 * Strips version markers like "(0)" and whitespace.
 */
function extractCodes(raw?: string): string[] {
  if (!raw) return [];
  return raw
    .replace(/\(\d+\)/g, "")
    .split(/[,;]+/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 3);
}
