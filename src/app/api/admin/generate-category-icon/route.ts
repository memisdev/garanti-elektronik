import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import sharp from "sharp";
import { verifyAdminRole, createServiceClient } from "@/lib/supabase/admin";
import { getIconGenerationConfig } from "@/lib/ai/client";
import { extractImageFromResponse } from "@/lib/ai/extract-image";
import { rateLimit } from "@/lib/rate-limit";

const requestSchema = z.object({
  categoryName: z.string().min(1).max(100),
  categoryDescription: z.string().max(500).optional(),
});

const ICON_SIZE = 256;
const TIMEOUT_MS = 30_000;

export async function POST(req: NextRequest) {
  const authResult = await verifyAdminRole(["admin", "editor"]);
  if ("error" in authResult) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status },
    );
  }

  // Rate limit: 10 requests per 15 minutes per user
  const rl = rateLimit("generate-icon", authResult.user.id, {
    windowMs: 15 * 60 * 1000,
    maxRequests: 10,
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
        { error: "categoryName alanı zorunludur (1-100 karakter)" },
        { status: 400 },
      );
    }

    const { categoryName, categoryDescription } = parsed.data;

    const descHint = categoryDescription
      ? ` Description: ${categoryDescription}.`
      : "";

    const prompt = `Create a minimal, modern icon for the electronic component category '${categoryName}'.${descHint}
Style: flat design, clean lines, no gradients.
Use ONLY dark navy blue color (#1a1f2e) on transparent background.
Simple recognizable silhouette of the component.
Centered, fills ~70% of canvas. No text, no shadows, no 3D.
Consistent line weight. Square aspect ratio. PNG with transparency.`;

    const config = getIconGenerationConfig();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    let aiResponse: Response;
    try {
      aiResponse = await fetch(`${config.url}?key=${config.apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseModalities: ["TEXT", "IMAGE"] },
        }),
        signal: controller.signal,
      });
    } catch (err) {
      clearTimeout(timeout);
      if (err instanceof DOMException && err.name === "AbortError") {
        return NextResponse.json(
          { error: "AI isteği zaman aşımına uğradı (30s)" },
          { status: 504 },
        );
      }
      throw err;
    } finally {
      clearTimeout(timeout);
    }

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("AI icon generation error:", aiResponse.status, errText);

      if (aiResponse.status === 429) {
        return NextResponse.json(
          { error: "AI istek limiti aşıldı. Lütfen daha sonra tekrar deneyin." },
          { status: 429 },
        );
      }
      if (aiResponse.status === 404) {
        return NextResponse.json(
          { error: `AI ikon modeli bulunamadı: ${config.model}. AI_ICON_MODEL ayarını kontrol edin.` },
          { status: 500 },
        );
      }
      if (aiResponse.status === 400) {
        return NextResponse.json(
          { error: `Model görsel üretimini desteklemiyor: ${config.model}. Görsel destekli bir model kullanın (ör. gemini-2.5-flash-image).` },
          { status: 400 },
        );
      }

      return NextResponse.json(
        { error: `AI ikon üretimi başarısız oldu (${aiResponse.status})` },
        { status: 500 },
      );
    }

    const aiData = await aiResponse.json();
    const base64Image = extractImageFromResponse(aiData);

    if (!base64Image) {
      console.error(
        "No image in AI icon response:",
        JSON.stringify(aiData).slice(0, 500),
      );
      return NextResponse.json(
        { error: "AI bir ikon görseli döndürmedi" },
        { status: 500 },
      );
    }

    // Convert to 256x256 WebP
    const rawBytes = Buffer.from(base64Image, "base64");
    const bytes = await sharp(rawBytes)
      .resize(ICON_SIZE, ICON_SIZE, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .webp({ quality: 90, alphaQuality: 100 })
      .toBuffer();

    // Upload to Supabase Storage
    const adminClient = createServiceClient();
    const iconPath = `categories/icon-${Date.now()}.webp`;

    const { error: uploadError } = await adminClient.storage
      .from("product-images")
      .upload(iconPath, bytes, {
        contentType: "image/webp",
        upsert: false,
      });

    if (uploadError) {
      console.error("Icon upload error:", uploadError);
      return NextResponse.json(
        { error: "İkon yüklenemedi" },
        { status: 500 },
      );
    }

    const { data: urlData } = adminClient.storage
      .from("product-images")
      .getPublicUrl(iconPath);

    return NextResponse.json({ iconUrl: urlData.publicUrl });
  } catch (e) {
    console.error("generate-category-icon error:", e);
    return NextResponse.json(
      { error: "İkon üretimi sırasında bir hata oluştu" },
      { status: 500 },
    );
  }
}
