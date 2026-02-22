import sharp from "sharp";
import pngToIco from "png-to-ico";
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PUBLIC = join(ROOT, "public");
const INPUT = join(ROOT, "garanti logo.jpeg");

/**
 * Flood-fill from image edges to mark background pixels.
 * Only pixels connected to the border AND matching background color become transparent.
 * This preserves white letters inside the red logo.
 */
function floodFillBackground(pixels, width, height) {
  const mask = new Uint8Array(width * height); // 0 = not visited, 1 = background

  function isBackground(idx) {
    const r = pixels[idx * 4];
    const g = pixels[idx * 4 + 1];
    const b = pixels[idx * 4 + 2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const saturation = max === 0 ? 0 : (max - min) / max;
    const luminance = r * 0.299 + g * 0.587 + b * 0.114;
    // Background: high luminance, low saturation (gray/white)
    return luminance > 180 && saturation < 0.12;
  }

  // BFS from all edge pixels
  const queue = [];
  // Seed all 4 edges
  for (let x = 0; x < width; x++) {
    if (isBackground(x)) { mask[x] = 1; queue.push(x); }
    const bot = (height - 1) * width + x;
    if (isBackground(bot)) { mask[bot] = 1; queue.push(bot); }
  }
  for (let y = 1; y < height - 1; y++) {
    const left = y * width;
    if (isBackground(left)) { mask[left] = 1; queue.push(left); }
    const right = y * width + width - 1;
    if (isBackground(right)) { mask[right] = 1; queue.push(right); }
  }

  // BFS
  let head = 0;
  while (head < queue.length) {
    const idx = queue[head++];
    const x = idx % width;
    const y = Math.floor(idx / width);
    const neighbors = [];
    if (x > 0) neighbors.push(idx - 1);
    if (x < width - 1) neighbors.push(idx + 1);
    if (y > 0) neighbors.push(idx - width);
    if (y < height - 1) neighbors.push(idx + width);

    for (const n of neighbors) {
      if (mask[n] === 0 && isBackground(n)) {
        mask[n] = 1;
        queue.push(n);
      }
    }
  }

  // Apply mask: set background pixels to transparent
  for (let i = 0; i < width * height; i++) {
    if (mask[i] === 1) {
      pixels[i * 4 + 3] = 0;
    }
  }

  // Soften edges: partially transparent for pixels adjacent to background
  for (let i = 0; i < width * height; i++) {
    if (mask[i] === 1) continue;
    const x = i % width;
    const y = Math.floor(i / width);
    let bgNeighbors = 0;
    const check = [
      x > 0 ? i - 1 : -1,
      x < width - 1 ? i + 1 : -1,
      y > 0 ? i - width : -1,
      y < height - 1 ? i + width : -1,
    ];
    for (const n of check) {
      if (n >= 0 && mask[n] === 1) bgNeighbors++;
    }
    if (bgNeighbors > 0 && bgNeighbors < 4) {
      // Edge pixel — slight transparency for anti-aliasing
      const r = pixels[i * 4];
      const g = pixels[i * 4 + 1];
      const b = pixels[i * 4 + 2];
      const luminance = r * 0.299 + g * 0.587 + b * 0.114;
      if (luminance > 200) {
        pixels[i * 4 + 3] = Math.round(255 * (1 - bgNeighbors * 0.2));
      }
    }
  }
}

async function main() {
  const raw = sharp(INPUT);
  const meta = await raw.metadata();
  console.log(`Input: ${meta.width}x${meta.height}, format: ${meta.format}`);

  // Trim first to get tight bounds
  const trimmed = await sharp(INPUT)
    .trim({ threshold: 20 })
    .toBuffer();

  const trimMeta = await sharp(trimmed).metadata();
  console.log(`After trim: ${trimMeta.width}x${trimMeta.height}`);

  // Get raw RGBA pixels
  const { data, info } = await sharp(trimmed)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixels = Buffer.from(data);

  // Flood-fill background removal from edges only
  floodFillBackground(pixels, info.width, info.height);

  const transparentBase = await sharp(pixels, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toBuffer();

  // Trim transparent border
  const finalBase = await sharp(transparentBase)
    .trim()
    .png()
    .toBuffer();

  const finalMeta = await sharp(finalBase).metadata();
  console.log(`Final base: ${finalMeta.width}x${finalMeta.height}`);

  // Generate all icon sizes
  const sizes = [
    { name: "favicon-16x16.png", size: 16 },
    { name: "favicon-32x32.png", size: 32 },
    { name: "apple-touch-icon.png", size: 180 },
    { name: "icon-192.png", size: 192 },
    { name: "icon-512.png", size: 512 },
  ];

  for (const { name, size } of sizes) {
    await sharp(finalBase)
      .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(join(PUBLIC, name));
    console.log(`Generated: ${name} (${size}x${size})`);
  }

  // logo.png for header — height 40px, proportional width @2x for retina
  const logoHeight = 40;
  const aspectRatio = finalMeta.width / finalMeta.height;
  const logoWidth = Math.round(logoHeight * aspectRatio);
  await sharp(finalBase)
    .resize(logoWidth * 2, logoHeight * 2, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(join(PUBLIC, "logo.png"));
  console.log(`Generated: logo.png (${logoWidth * 2}x${logoHeight * 2} @2x)`);

  // favicon.ico (16 + 32 multi-size)
  const ico16 = await sharp(finalBase)
    .resize(16, 16, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  const ico32 = await sharp(finalBase)
    .resize(32, 32, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const icoBuffer = await pngToIco([ico16, ico32]);
  writeFileSync(join(PUBLIC, "favicon.ico"), icoBuffer);
  console.log("Generated: favicon.ico (16+32)");

  // OG Image (1200x630) — dark background, logo centered, text below
  const ogWidth = 1200;
  const ogHeight = 630;
  const logoSize = 160;

  const ogLogo = await sharp(finalBase)
    .resize(logoSize, logoSize, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const textSvg = `<svg width="${ogWidth}" height="${ogHeight}" xmlns="http://www.w3.org/2000/svg">
    <text x="${ogWidth / 2}" y="${355 + logoSize / 2 + 10}" text-anchor="middle"
      font-family="Inter, system-ui, -apple-system, sans-serif" font-weight="800" font-size="48" fill="white"
      letter-spacing="-1">Garanti Elektronik</text>
    <text x="${ogWidth / 2}" y="${355 + logoSize / 2 + 60}" text-anchor="middle"
      font-family="Inter, system-ui, -apple-system, sans-serif" font-weight="400" font-size="22" fill="#999999"
      letter-spacing="0.5">Orijinal TV Yedek Parça Tedarikçisi</text>
  </svg>`;

  await sharp({
    create: {
      width: ogWidth,
      height: ogHeight,
      channels: 4,
      background: { r: 26, g: 26, b: 26, alpha: 255 },
    },
  })
    .composite([
      {
        input: ogLogo,
        top: Math.round((ogHeight - logoSize) / 2 - 60),
        left: Math.round((ogWidth - logoSize) / 2),
      },
      {
        input: Buffer.from(textSvg),
        top: 0,
        left: 0,
      },
    ])
    .png()
    .toFile(join(PUBLIC, "og-image.png"));
  console.log("Generated: og-image.png (1200x630)");

  console.log("\nAll logo assets generated successfully!");
}

main().catch(console.error);
