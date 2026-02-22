#!/usr/bin/env node
/**
 * Regenerates all category icons using the updated pipeline.
 * Reads env from .env.local, calls Gemini API, applies #14181F recolor,
 * uploads to Supabase Storage, and updates the category record.
 *
 * Usage: node scripts/regenerate-category-icons.mjs
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// Load .env.local
const envFile = readFileSync(resolve(ROOT, ".env.local"), "utf-8");
const env = Object.fromEntries(
  envFile
    .split("\n")
    .filter((l) => l && !l.startsWith("#"))
    .map((l) => {
      const idx = l.indexOf("=");
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim()];
    }),
);

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const AI_API_KEY = env.AI_API_KEY;
const AI_ICON_MODEL = env.AI_ICON_MODEL || env.AI_IMAGE_MODEL || "gemini-3-pro-image-preview";

if (!SUPABASE_URL || !SERVICE_KEY || !AI_API_KEY) {
  console.error("Missing env vars. Need NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, AI_API_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
const ICON_SIZE = 256;
const BRAND_R = 0x14, BRAND_G = 0x18, BRAND_B = 0x1f;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${AI_ICON_MODEL}:generateContent?key=${AI_API_KEY}`;

function extractBase64Image(aiData) {
  const candidates = aiData.candidates;
  if (candidates) {
    for (const candidate of candidates) {
      const parts = candidate.content?.parts;
      if (parts) {
        for (const part of parts) {
          if (part.inlineData?.data) return part.inlineData.data;
        }
      }
    }
  }
  return null;
}

async function generateAndProcess(categoryName, categoryDescription) {
  const descHint = categoryDescription ? ` Description: ${categoryDescription}.` : "";

  const prompt = `Create a minimal, modern icon for the electronic component category '${categoryName}'.${descHint}
Style: solid dark icon on pure white background, high contrast, flat design.
Use ONLY a single dark color (#14181F) for the icon. Background must be pure white (#ffffff).
Simple recognizable silhouette of the component, bold and clearly visible.
Centered, fills ~80% of canvas. No text, no shadows, no 3D, no gradients.
Consistent thick line weight. Square aspect ratio. 256x256px.`;

  console.log(`  Calling Gemini for "${categoryName}"...`);
  const res = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseModalities: ["TEXT", "IMAGE"] },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API ${res.status}: ${errText.slice(0, 200)}`);
  }

  const aiData = await res.json();
  const base64Image = extractBase64Image(aiData);
  if (!base64Image) throw new Error("No image in Gemini response");

  console.log(`  Processing image...`);
  const rawBytes = Buffer.from(base64Image, "base64");
  const flattened = await sharp(rawBytes)
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .resize(ICON_SIZE, ICON_SIZE, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255 },
    })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { data: pixels, info } = flattened;
  const out = Buffer.alloc(pixels.length);

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;

    if (lum >= 250) {
      out[i] = BRAND_R; out[i + 1] = BRAND_G; out[i + 2] = BRAND_B; out[i + 3] = 0;
    } else if (lum <= 64) {
      out[i] = BRAND_R; out[i + 1] = BRAND_G; out[i + 2] = BRAND_B; out[i + 3] = 255;
    } else {
      const alpha = Math.round(255 * (1 - (lum - 64) / (250 - 64)));
      out[i] = BRAND_R; out[i + 1] = BRAND_G; out[i + 2] = BRAND_B; out[i + 3] = alpha;
    }
  }

  const bytes = await sharp(out, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .webp({ quality: 90, alphaQuality: 100 })
    .toBuffer();

  return bytes;
}

async function main() {
  console.log("Fetching categories...");
  const { data: categories, error } = await supabase
    .from("categories")
    .select("id, name, slug, description, image_url")
    .order("name");

  if (error) {
    console.error("Failed to fetch categories:", error.message);
    process.exit(1);
  }

  console.log(`Found ${categories.length} categories\n`);

  for (const cat of categories) {
    console.log(`[${cat.name}] (${cat.id})`);
    try {
      const bytes = await generateAndProcess(cat.name, cat.description);

      const iconPath = `categories/icon-${cat.slug}-${Date.now()}.webp`;
      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(iconPath, bytes, { contentType: "image/webp", upsert: false });

      if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

      const { data: urlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(iconPath);

      const { error: updateError } = await supabase
        .from("categories")
        .update({ image_url: urlData.publicUrl })
        .eq("id", cat.id);

      if (updateError) throw new Error(`DB update failed: ${updateError.message}`);

      console.log(`  Done: ${urlData.publicUrl}\n`);

      // Rate limit: wait 3s between API calls
      await new Promise((r) => setTimeout(r, 3000));
    } catch (err) {
      console.error(`  FAILED: ${err.message}\n`);
    }
  }

  console.log("All categories processed.");
}

main();
