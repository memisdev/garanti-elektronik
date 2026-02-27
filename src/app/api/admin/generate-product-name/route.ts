import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyAdminRole } from "@/lib/supabase/admin";
import { chatCompletion, AIError } from "@/lib/ai/client";
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

  // --- Parse body ---
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek formatı" }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "En az bir alan (kod, marka, kategori veya uyumluluk) doldurulmalıdır." },
      { status: 400 },
    );
  }

  // --- Call AI ---
  try {
    const result = await chatCompletion({
      systemPrompt: PRODUCT_NAME_SYSTEM_PROMPT,
      userPrompt: buildNameUserPrompt(parsed.data),
      temperature: 0.4,
      maxCompletionTokens: 1024,
      timeoutMs: 15_000,
    });

    console.log(
      "[generate-product-name] finish:", result.finishReason,
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
    let name = sanitizeAIOutput(result.content)
      .split("\n")[0]
      .replace(/^["'`]+|["'`]+$/g, "")
      .replace(/^\*+|\*+$/g, "")
      .replace(/^#+\s*/, "")
      .replace(/^[-•]\s*/, "")
      .replace(/\s+/g, " ")
      .replace(/,\s*$/, "")
      .replace(/\s*\(0\)/g, "")
      .trim();

    // --- Minimum length ---
    if (!name || name.length < 10) {
      return NextResponse.json(
        { error: "AI çok kısa bir ad üretti. Lütfen tekrar deneyin." },
        { status: 500 },
      );
    }

    // --- Quality: verify input codes appear in output ---
    const inputCodes = extractCodes(parsed.data.code);
    const missingCodes = inputCodes.filter(
      (code) => !name.toUpperCase().includes(code.toUpperCase()),
    );
    if (missingCodes.length > 0) {
      console.warn(
        "[generate-product-name] Missing codes in output:",
        missingCodes,
        "output:", name,
      );
      // Don't reject — append missing codes at the start
      name = [...missingCodes, name].join(" ");
    }

    // --- Max length (generous for multi-code SEO names) ---
    if (name.length > 200) {
      name = name.slice(0, 200).replace(/\s+\S*$/, "").trim();
    }

    return NextResponse.json({ name });
  } catch (e) {
    if (e instanceof AIError) {
      return NextResponse.json({ error: e.message }, { status: e.statusCode });
    }
    console.error("generate-product-name error:", e);
    return NextResponse.json(
      { error: "Ürün adı oluşturulurken bir hata oluştu" },
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
    .replace(/\(\d+\)/g, "") // strip "(0)", "(1)" etc.
    .split(/[,;]+/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 3); // ignore tiny fragments
}
