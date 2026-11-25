// src/lib/server-image-optimizer.ts
import sharp from "sharp";

/**
 * Server-only helper to optimize uploaded image buffers into WebP (full, med, thumb)
 */
export async function optimizeUploadBuffer(buffer: Buffer) {
  const [thumb, med, full, meta] = await Promise.all([
    sharp(buffer).resize(320, undefined, { withoutEnlargement: true }).webp({ quality: 80 }).toBuffer(),
    sharp(buffer).resize(720, undefined, { withoutEnlargement: true }).webp({ quality: 82 }).toBuffer(),
    sharp(buffer).resize(1200, undefined, { withoutEnlargement: true }).webp({ quality: 84 }).toBuffer(),
    sharp(buffer).metadata(),
  ]);

  return {
    thumb,
    med,
    full,
    width: meta.width,
    height: meta.height,
  };
}
