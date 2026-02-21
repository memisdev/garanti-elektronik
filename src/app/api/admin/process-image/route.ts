import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyAdminRole, createServiceClient } from "@/lib/supabase/admin";
import { getImageConfig } from "@/lib/ai/client";

const requestSchema = z.object({
  imagePath: z.string().min(1),
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
      "Remove the background from this product image completely. Keep only the product itself with a transparent background. Output a clean PNG with transparency. Maintain the original quality and details of the product.";

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
    const choices = aiData.choices || [];
    let base64Image: string | null = null;

    for (const choice of choices) {
      const content = choice.message?.content;
      if (Array.isArray(content)) {
        for (const part of content) {
          if (part.type === "image_url" && part.image_url?.url) {
            const imgUrl: string = part.image_url.url;
            if (imgUrl.startsWith("data:")) {
              base64Image = imgUrl.split(",")[1];
            } else {
              base64Image = imgUrl;
            }
            break;
          }
        }
      }
      if (base64Image) break;
    }

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

    // Decode and upload
    const bytes = Buffer.from(base64Image, "base64");

    const processedPath = `processed/${imagePath.replace(/\.[^.]+$/, "")}.png`;

    const { error: uploadError } = await adminClient.storage
      .from("product-images")
      .upload(processedPath, bytes, {
        contentType: "image/png",
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
