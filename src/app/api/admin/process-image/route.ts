import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import sharp from "sharp";
import { verifyAdminRole, createServiceClient } from "@/lib/supabase/admin";
import { getImageConfig } from "@/lib/ai/client";
import { extractImageFromResponse } from "@/lib/ai/extract-image";

const TARGET_SIZE = 800;
const CONTENT_SIZE = 700;

const requestSchema = z.object({
  imagePath: z
    .string()
    .min(1)
    .regex(/^[a-zA-Z0-9._\-/]+$/, "Geçersiz dosya yolu karakteri")
    .refine((p) => !p.includes("..") && !p.startsWith("/"), {
      message: "Geçersiz dosya yolu",
    }),
});

// Magic bytes for allowed image types
const MAGIC_BYTES: Array<{ mime: string; bytes: number[] }> = [
  { mime: "image/jpeg", bytes: [0xff, 0xd8] },
  { mime: "image/png", bytes: [0x89, 0x50, 0x4e, 0x47] },
  { mime: "image/webp", bytes: [0x52, 0x49, 0x46, 0x46] }, // RIFF header
];

function detectMimeType(buffer: Uint8Array): string | null {
  for (const { mime, bytes } of MAGIC_BYTES) {
    if (bytes.every((b, i) => buffer[i] === b)) {
      return mime;
    }
  }
  return null;
}

export async function POST(req: NextRequest) {
  // Auth + role check
  const authResult = await verifyAdminRole(["admin", "editor"]);
  if ("error" in authResult) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status },
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
        { error: "imagePath alanı zorunludur" },
        { status: 400 },
      );
    }

    const { imagePath } = parsed.data;
    const adminClient = createServiceClient();

    // Download image from storage
    const { data: fileData, error: downloadError } = await adminClient.storage
      .from("product-images")
      .download(imagePath);

    if (downloadError || !fileData) {
      console.error("Download error:", downloadError);
      return NextResponse.json(
        { error: "Görsel depodan indirilemedi" },
        { status: 400 },
      );
    }

    // Convert to buffer and validate
    const arrayBuffer = await fileData.arrayBuffer();
    const uint8 = new Uint8Array(arrayBuffer);

    if (uint8.length > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Görsel çok büyük (maks. 10MB)" },
        { status: 400 },
      );
    }

    // Magic-byte MIME validation
    const detectedMime = detectMimeType(uint8);
    if (!detectedMime) {
      return NextResponse.json(
        { error: "Desteklenmeyen görsel formatı" },
        { status: 400 },
      );
    }

    const b64 = Buffer.from(uint8).toString("base64");
    const dataUrl = `data:${detectedMime};base64,${b64}`;

    // Call Gemini to remove background
    const prompt =
      "Remove the background from this product image completely. Keep only the product itself with a transparent background. Output a clean PNG with transparency. Maintain the original quality and details of the product. Do not add any shadows, reflections, or visual effects.";

    const config = getImageConfig();

    const aiResponse = await fetch(config.url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: dataUrl } },
            ],
          },
        ],
        modalities: ["image", "text"],
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errText);

      if (aiResponse.status === 429) {
        return NextResponse.json(
          { error: "İstek limiti aşıldı. Lütfen daha sonra tekrar deneyin." },
          { status: 429 },
        );
      }
      if (aiResponse.status === 402) {
        return NextResponse.json(
          { error: "AI kredisi tükendi." },
          { status: 402 },
        );
      }

      return NextResponse.json(
        { error: "AI işlemi başarısız oldu" },
        { status: 500 },
      );
    }

    const aiData = await aiResponse.json();

    // Extract image from response
    const base64Image = extractImageFromResponse(aiData);

    if (!base64Image) {
      console.error(
        "No image in AI response:",
        JSON.stringify(aiData).slice(0, 500),
      );
      return NextResponse.json(
        { error: "AI bir görsel döndürmedi" },
        { status: 500 },
      );
    }

    // Decode, normalize to 800x800 canvas, convert to WebP, and upload
    const rawBytes = Buffer.from(base64Image, "base64");
    const trimmed = await sharp(rawBytes)
      .trim()
      .resize(CONTENT_SIZE, CONTENT_SIZE, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .toBuffer();

    const { width = 0, height = 0 } = await sharp(trimmed).metadata();
    const padX = Math.round((TARGET_SIZE - width) / 2);
    const padY = Math.round((TARGET_SIZE - height) / 2);

    const bytes = await sharp(trimmed)
      .extend({
        top: padY,
        bottom: TARGET_SIZE - height - padY,
        left: padX,
        right: TARGET_SIZE - width - padX,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .webp({ quality: 85, alphaQuality: 100 })
      .toBuffer();

    const processedPath = `processed/${imagePath.replace(/\.[^.]+$/, "")}.webp`;

    const { error: uploadError } = await adminClient.storage
      .from("product-images")
      .upload(processedPath, bytes, {
        contentType: "image/webp",
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json(
        { error: "İşlenmiş görsel yüklenemedi" },
        { status: 500 },
      );
    }

    const { data: processedUrlData } = adminClient.storage
      .from("product-images")
      .getPublicUrl(processedPath);

    const { data: originalUrlData } = adminClient.storage
      .from("product-images")
      .getPublicUrl(imagePath);

    return NextResponse.json({
      originalUrl: originalUrlData.publicUrl,
      processedUrl: processedUrlData.publicUrl,
      processedPath,
    });
  } catch (e) {
    console.error("process-image error:", e);
    return NextResponse.json(
      { error: "İşlem sırasında bir hata oluştu" },
      { status: 500 },
    );
  }
}
