import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRole, createServiceClient } from "@/lib/supabase/admin";
import { getImageConfig } from "@/lib/ai/client";

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
    const { imagePath } = await req.json();
    if (!imagePath) {
      return NextResponse.json(
        { error: "imagePath is required" },
        { status: 400 },
      );
    }

    const adminClient = createServiceClient();

    // Download image from storage
    const { data: fileData, error: downloadError } = await adminClient.storage
      .from("product-images")
      .download(imagePath);

    if (downloadError || !fileData) {
      console.error("Download error:", downloadError);
      return NextResponse.json(
        { error: "Failed to download image from storage" },
        { status: 400 },
      );
    }

    // Convert to base64 data URL
    const arrayBuffer = await fileData.arrayBuffer();
    const uint8 = new Uint8Array(arrayBuffer);

    if (uint8.length > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image too large (max 10MB)" },
        { status: 400 },
      );
    }

    const b64 = Buffer.from(uint8).toString("base64");
    const mimeType = imagePath.endsWith(".png") ? "image/png" : "image/jpeg";
    const dataUrl = `data:${mimeType};base64,${b64}`;

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
          { error: "Rate limit exceeded. Please try again later." },
          { status: 429 },
        );
      }
      if (aiResponse.status === 402) {
        return NextResponse.json(
          { error: "AI credits exhausted." },
          { status: 402 },
        );
      }

      return NextResponse.json(
        { error: "AI processing failed" },
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
        { error: "AI did not return an image" },
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
        { error: "Failed to upload processed image" },
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
      { error: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 },
    );
  }
}
