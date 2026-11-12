import { NextResponse } from "next/server";
import sharp from "sharp";
import { randomUUID } from "node:crypto";
import { requireAdmin } from "@/lib/supabase";
import { sameOrigin, failure } from "@/lib/http";
export async function POST(request: Request) {
  if (!sameOrigin(request)) return failure("Geçersiz kaynak.", 403);
  const admin = await requireAdmin();
  if (!admin) return failure("Yetkisiz erişim.", 401);
  if (Number(request.headers.get("content-length") || 0) > 6 * 1024 * 1024)
    return failure("Dosya en fazla 5 MB olabilir.", 413);
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File) || file.size > 5 * 1024 * 1024)
      return failure("Geçerli bir görsel seçin. En fazla 5 MB.");
    const buffer = Buffer.from(await file.arrayBuffer());
    const im = sharp(buffer, { limitInputPixels: 25_000_000 });
    const meta = await im.metadata();
    if (!["jpeg", "png", "webp"].includes(meta.format || ""))
      return failure("PNG, JPEG veya WebP görsel seçin.");
    const body = await im
      .rotate()
      .resize(1800, 1800, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer();
    const path = `products/${randomUUID()}.webp`;
    const { error } = await admin.db.storage
      .from("product-images")
      .upload(path, body, { contentType: "image/webp", upsert: false });
    if (error) return failure("Görsel yüklenemedi.", 400);
    return NextResponse.json({
      url: admin.db.storage.from("product-images").getPublicUrl(path).data
        .publicUrl,
    });
  } catch {
    return failure("Görsel işlenemedi. PNG, JPEG veya WebP deneyin.");
  }
}
